import React from 'react';
import { useEffect, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase-config';
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


interface ImageCatalogProps {
	onSelectImage: (src: string) => void;
}

const ImageCatalog: React.FC<ImageCatalogProps> = ({ onSelectImage }) => {
	const [images, setImages] = useState<any[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			const querySnapshot = await getDocs(collection(firestore, 'images'));
			const data = querySnapshot.docs.map(doc => doc.data());
			setImages(data);
		};
		fetchData();
	}, []);

	return (
		<div className="catalog-container">
			<div className="flex">
				<FormControl
					sx={{
						m: 1,
						minWidth: 120,
						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								borderColor: "white"
							},
							"&:hover fieldset": {
								borderColor: "gray"
							},
							"&.Mui-focused fieldset": {
								borderColor: "gray"
							}
						}
					}}
					size="small"
					variant="outlined"
				>
					<InputLabel
						id="demo-select-small-label"
						sx={{ color: "white" }}
					>
						Ordenar por:
					</InputLabel>
					<Select
						labelId="demo-select-small-label"
						id="demo-select-small"
						value=""
						label="Age"
						onChange={() => { }}
						style={{ borderColor: "white", color: "white" }}
					>
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						<MenuItem value={10}>Relevancia</MenuItem>
						<MenuItem value={20}>Menor precio</MenuItem>
						<MenuItem value={30}>Mayor precio</MenuItem>
					</Select>
				</FormControl>
				<div className="input-search">
					<input
						className="input-transparent"
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<SearchIcon style={{ color: "white" }} />
				</div>
			</div>
			<div id="catalog" className="container_catalog-img">
				{images.map((image, index) => (
					<img
						key={index}
						src={image.src}
						alt={`Imagen de ${image.categoria}`}
						className="catalog-img"
						onClick={() => onSelectImage(image.src)}
					/>
				))}
			</div>
		</div>
	);
};

export default ImageCatalog;