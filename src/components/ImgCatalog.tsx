/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
// import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { SelectChangeEvent } from '@mui/material';

import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { firestore, auth } from '../firebase-config';


interface ImageData {
	id: string;
	name: string;
	src: string;
	visualizeUrl?: string;
	imageSrc?: string;
	category: string;
	subcategory: string;
	tags: string[];
}

interface ImageCatalogProps {
	onSelectImage: (src: string, name: string) => void;
}


const ImageCatalog: React.FC<ImageCatalogProps> = ({ onSelectImage }) => {
	const [images, setImages] = useState<ImageData[]>([]);
	
	const [categorias, setCategorias] = useState<string[]>([]);
	const [subcategorias, setSubcategorias] = useState<{ [key: string]: string[] }>({});
	const [selectedSubcategorias, setSelectedSubcategorias] = useState<{ [key: string]: string[] }>({});

	const handleChangeSubcategoria = (category: string) => (event: SelectChangeEvent<string[]>) => {
		setSelectedSubcategorias({
			...selectedSubcategorias,
			[category]: event.target.value as string[],
		});
	};

	useEffect(() => {
		const fetchData = async () => {
		  try {
			const querySnapshot = await getDocs(collection(firestore, 'stickers'));
			const data: ImageData[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot): ImageData => ({
			  id: doc.id,
			  name: doc.data().name,
			  src: doc.data().visualizeUrl || doc.data().imageSrc,
			  category: doc.data().category,
			  subcategory: doc.data().subcategory,
			  tags: doc.data().tags,
			}));
	
			const categoriasSet = new Set<string>();
			const subcategoriasMap: { [key: string]: string[] } = {};
	
			data.forEach((image: ImageData) => {
			  categoriasSet.add(image.category);
			  if (!subcategoriasMap[image.category]) {
				subcategoriasMap[image.category] = [];
			  }
			  if (!subcategoriasMap[image.category].includes(image.subcategory)) {
				subcategoriasMap[image.category].push(image.subcategory);
			  }
			});
	
			setCategorias(Array.from(categoriasSet));
			setSubcategorias(subcategoriasMap);
			setImages(data);
	
			// console.log(data, "images"); // Mueve el console.log aquí para asegurarte de que los datos se han cargado
		  } catch (error) {
			console.log("Error fetching data: ", error);
		  }
		};
	
		fetchData();
	}, []);


	const filteredImages = images.filter(image => {
		const selectedSubs = selectedSubcategorias[image.category] || [];
		return selectedSubs.length === 0 || selectedSubs.includes(image.subcategory);
	});

	const handleImageClick = (image: ImageData) => {
		onSelectImage(image.imageSrc ? image.imageSrc : image.src, image.name);
	};

	return (
		<>
			{/* <div className='flex'>
				{categorias.map((category) => (
					<FormControl
						key={category}
						sx={{
							m: 1,
							width: '180px',
							"& .MuiOutlinedInput-root": {
								"& fieldset": {
									borderColor: "white",
								},
								"&:hover fieldset": {
									borderColor: "gray",
								},
								"&.Mui-focused fieldset": {
									borderColor: "gray",
								},
							},
						}}
					>
						<InputLabel id={`${category}-label`} sx={{ color: 'white' }}>
							{category}
						</InputLabel>
						<Select
							labelId={`${category}-label`}
							multiple
							value={selectedSubcategorias[category] || []}
							onChange={handleChangeSubcategoria(category)}
							input={<OutlinedInput id={`${category}-select`} label="Subcategoría" />}
						>
							{subcategorias[category].map((subcategoria) => (
								<MenuItem key={subcategoria} value={subcategoria}>
									{subcategoria}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				))}
			</div> */}

			<div id="catalog" className="container_catalog-img">
				{filteredImages.map((image) => (
					<img
						key={image.id}
						src={image.src || image.imageSrc||''}
						alt={`Imagen de ${image.category}`}
						className="catalog-img"
						onClick={() => handleImageClick(image)}
					/>
				))}
				<p>jola</p>
			</div>
		</>
	);
};
export default ImageCatalog;
