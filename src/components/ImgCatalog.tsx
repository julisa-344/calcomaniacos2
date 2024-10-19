import React, { useState, useEffect } from 'react';
// import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { SelectChangeEvent } from '@mui/material';

import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { firestore, auth } from '../firebase-config';


interface ImageData {
	id: string;
	nombre: string;
	src: string;
	visualizeUrl?: string;
	categoria: string;
	sub_categoria: string;
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

	console.log(categorias, subcategorias)
	const handleChangeSubcategoria = (categoria: string) => (event: SelectChangeEvent<string[]>) => {
		setSelectedSubcategorias({
			...selectedSubcategorias,
			[categoria]: event.target.value as string[],
		});
	};

	console.log(handleChangeSubcategoria)
	useEffect(() => {
		const fetchData = async () => {
		  try {
			const querySnapshot = await getDocs(collection(firestore, 'stickers'));
			const data: ImageData[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot): ImageData => ({
			  id: doc.id,
			  nombre: doc.data().nombre,
			  src: doc.data().visualizeUrl || doc.data().imageSrc,
			  categoria: doc.data().categoria,
			  sub_categoria: doc.data().sub_categoria,
			  tags: doc.data().tags,
			}));
	
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
	
			console.log(data, "images"); // Mueve el console.log aquí para asegurarte de que los datos se han cargado
		  } catch (error) {
			console.log("Error fetching data: ", error);
		  }
		};
	
		const authenticateAndFetchData = async () => {
			onAuthStateChanged(auth, (user) => {
			  if (user) {
				// User is signed in, fetch data
				fetchData();
			  } else {
				// No user is signed in, sign in anonymously or with email/password
				signInWithEmailAndPassword(auth, 'your-email@example.com', 'your-password')
				  .then(() => {
					fetchData();
				  })
				  .catch((error) => {
					console.error("Error signing in: ", error);
				  });
			  }
			});
		  };
	  
		  authenticateAndFetchData();
		}, []);

	console.log(images, "images")	
	console.log(setImages, "setImages")

	const filteredImages = images.filter(image => {
		const selectedSubs = selectedSubcategorias[image.categoria] || [];
		return selectedSubs.length === 0 || selectedSubs.includes(image.sub_categoria);
	});

	const handleImageClick = (image: ImageData) => {
		onSelectImage(image.src, image.nombre);
	};

	return (
		<>
			{/* <div className='flex'>
				{categorias.map((categoria) => (
					<FormControl
						key={categoria}
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
						<InputLabel id={`${categoria}-label`} sx={{ color: 'white' }}>
							{categoria}
						</InputLabel>
						<Select
							labelId={`${categoria}-label`}
							multiple
							value={selectedSubcategorias[categoria] || []}
							onChange={handleChangeSubcategoria(categoria)}
							input={<OutlinedInput id={`${categoria}-select`} label="Subcategoría" />}
						>
							{subcategorias[categoria].map((subcategoria) => (
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
						src={image.src || ''}
						alt={`Imagen de ${image.categoria}`}
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
