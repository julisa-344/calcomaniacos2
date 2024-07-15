import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Box, Chip } from '@mui/material';
import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { useTheme } from '@mui/material/styles';
import { firestore } from '../firebase-config';
import { SelectChangeEvent } from '@mui/material';

interface ImageData {
	id: string;
	nombre: string;
	src: string;
	categoria: string;
	sub_categoria: string;
	tags: string[];
}

interface ImageCatalogProps {
	onSelectImage: (src: string) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const ImageCatalog: React.FC<ImageCatalogProps> = ({ onSelectImage }) => {
	const [images, setImages] = useState<ImageData[]>([]);
	const [categorias, setCategorias] = useState<string[]>([]);
	const [subcategorias, setSubcategorias] = useState<{ [key: string]: string[] }>({});
	const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
	const [selectedSubcategoria, setSelectedSubcategoria] = useState<string | null>(null);

	const theme = useTheme();
	const [selectedSubcategorias, setSelectedSubcategorias] = useState<string[]>([]);


	const handleChangeSubcategoria = (event: SelectChangeEvent<string | string[]>) => {
		setSelectedSubcategorias(event.target.value as string[]);
	};

	const handleChangeCategoria = (event: SelectChangeEvent<string | null>) => {
		setSelectedCategoria(event.target.value);
		setSelectedSubcategoria(null);
	};

	useEffect(() => {
		const fetchData = async () => {
			const querySnapshot = await getDocs(collection(firestore, 'images'));
			const data: ImageData[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot): ImageData => ({
				id: doc.id,
				nombre: doc.data().nombre,
				src: doc.data().src,
				categoria: doc.data().categoria,
				sub_categoria: doc.data().sub_categoria,
				tags: doc.data().tags
			}));

			// Extract unique categorias and their subcategorias
			const categoriasSet = new Set<string>();
			const subcategoriasMap: { [key: string]: string[] } = {};

			data.forEach((image: ImageData) => {
				categoriasSet.add(image.categoria);
				if (!subcategoriasMap[image.categoria]) {
					subcategoriasMap[image.categoria] = [];
				}
				if (!subcategoriasMap[image.categoria].includes(image.sub_categoria)) {
					subcategoriasMap[image.categoria].push(image.sub_categoria);
				}
			});

			setCategorias(Array.from(categoriasSet));
			setSubcategorias(subcategoriasMap);
			setImages(data);
		};

		fetchData();
	}, []);

	const filteredImages = selectedCategoria
		? images.filter(image => image.categoria === selectedCategoria &&
			(selectedSubcategorias.length === 0 || selectedSubcategorias.includes(image.sub_categoria)))
		: images;

	const handleImageClick = (src: string) => {
		onSelectImage(src);
	};

	return (
		<>	
		<div className='flex'>
		{categorias.map((categoria) => (
			<FormControl sx={{
				m: 1,
				width: '90px',
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
			}}>
				<InputLabel id="categoria-label" sx={{color:'white'}}>{categoria}</InputLabel>
				<Select
					labelId="categoria-label"
					value={selectedCategoria}
					onChange={handleChangeCategoria}
					input={<OutlinedInput id="categoria-select" label="Categoría" />}
				>
					<MenuItem key={categoria} value={categoria}>
						{categoria}
					</MenuItem>
				</Select>
			</FormControl>
		))}
		</div>
			<div id="catalog" className="container_catalog-img">
				{filteredImages.map((image) => (
					<img
						key={image.id}
						src={image.src}
						alt={`Imagen de ${image.categoria}`}
						className="catalog-img"
						onClick={() => handleImageClick(image.src)}
					/>
				))}
			</div>
		</>
	);
};

export default ImageCatalog;