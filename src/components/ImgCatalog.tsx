import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
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

const ImageCatalog: React.FC<ImageCatalogProps> = ({ onSelectImage }) => {
	const [images, setImages] = useState<ImageData[]>([]);
	const [categorias, setCategorias] = useState<string[]>([]);
	const [subcategorias, setSubcategorias] = useState<{ [key: string]: string[] }>({});
	const [selectedSubcategorias, setSelectedSubcategorias] = useState<{ [key: string]: string[] }>({});

	const handleChangeSubcategoria = (categoria: string) => (event: SelectChangeEvent<string[]>) => {
		setSelectedSubcategorias({
			...selectedSubcategorias,
			[categoria]: event.target.value as string[],
		});
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
				tags: doc.data().tags,
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

	const filteredImages = images.filter(image => {
		const selectedSubs = selectedSubcategorias[image.categoria] || [];
		return selectedSubs.length === 0 || selectedSubs.includes(image.sub_categoria);
	});

	const handleImageClick = (src: string) => {
		onSelectImage(src);
	};

	return (
		<>
			<div className='flex'>
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