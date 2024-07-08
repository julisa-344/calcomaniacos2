import './style/card.scss';
import Button from './Button';
import './../theme.scss';
import React, { useState, useEffect } from 'react';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import { addToFavorites, removeFromFavorites, getFavorites } from '../firebaseFunctions';
import { Product } from '../types';

interface CardProps extends Product {}

const Card: React.FC<CardProps> = ({ id, name, price, img, description, acabado }) => {
	const [isFavorite, setIsFavorite] = useState<boolean>(false);

	useEffect(() => {
		const fetchFavorites = async () => {
			const favorites = await getFavorites();
			setIsFavorite(favorites.some(fav => fav.productId === id));
		};

		fetchFavorites();
	}, [id]);

	const toggleFavorite = async () => {
		if (isFavorite) {
			await removeFromFavorites(id);
		} else {
			await addToFavorites(id);
		}
		setIsFavorite(!isFavorite);
	};

	let navigate = useNavigate();
	const handleNavigate = () => {
		navigate("/detail-product",
			{ state: { img, name, price, description, acabado } });
	};

	return (
		<div className="card" >
			<ImageListItemBar
				sx={{
					background: 'rgba(0, 0, 0, 0.0)',
				}}
				position="top"
				actionIcon={
					<IconButton onClick={toggleFavorite} sx={{ color: 'white' }} aria-label={`star`}>
						{isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>
				}
				actionPosition="right"
			/>

			<img className='img-product' src={img} alt="producto" />
			<h3 className='sub-title'>{name}</h3>
			<p className='text'>S/. {price}</p>
			<Button onClick={handleNavigate} text="Comprar" variant='outlined' />
		</div>
	);
}

export default Card;
