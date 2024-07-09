import * as React from 'react';
import "./style/shopPage.scss";
import "../theme.scss";
import Card from "../components/CardComponent";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase-config';

interface Product {
	id: string;
	nombre: string;
	precio: number;
	src: string;
	categoria: string;
	descripcion: string;
	acabado: {
		glossy: string;
		matte: string;
		transparent: string;
	};
}

function ShopPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [age, setAge] = React.useState('');

	useEffect(() => {
		const fetchData = async () => {
			const querySnapshot = await getDocs(collection(firestore, 'images')); // Utiliza la colección 'images'
			const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
			setProducts(productsData);
		};
		fetchData();
	}, []);

	const filteredProducts = products.filter(
		(product) =>
			product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) &&
			(selectedCategories.length === 0 ||
				selectedCategories.includes(product.categoria))
	);

	const handleCategoryChange = (category: string, isChecked: boolean) => {
		if (isChecked) {
			setSelectedCategories((prev) => [...prev, category]);
		} else {
			setSelectedCategories((prev) => prev.filter((c) => c !== category));
		}
	};

	const categories = products
		.map((product) => product.categoria)
		.filter((value, index, self) => self.indexOf(value) === index);

	const handleChange = (event: SelectChangeEvent) => {
		setAge(event.target.value);
	};

	return (
		<>
			<main className="bg-color">
				<section>
					<h2>
						Descubre los mejores stickers para tu laptop, celular, tablet y más.
					</h2>
					<img src="" alt="" />
				</section>
				<section className="p-4">
					<section className="gallery-content">
						<aside>
							<h2 className="title">Filtros</h2>
							<p className="sub-title">Por categoría</p>
							<div className="content-category">
								{categories.map((category, index) => (
									<label className="text" key={index}>
										<Checkbox
											checked={selectedCategories.includes(category)}
											onChange={(e) =>
												handleCategoryChange(category, e.target.checked)
											}
											style={{ color: 'white' }} 
										/>
										{category}
									</label>
								))}
							</div>
						</aside>
						<section className="contet-products">
							<div className="flex justify-between align-center mb-4">
								<div className="input-search">
									<input
										className="input-transparent"
										type="text"
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
									<SearchIcon  style={{ color: 'white' }} />
								</div>
								<FormControl sx={{ m: 1, minWidth: 120 }} size="small" variant="outlined">
									<InputLabel id="demo-select-small-label">Ordenar por:</InputLabel>
									<Select
										labelId="demo-select-small-label"
										id="demo-select-small"
										value={age}
										label="Age"
										onChange={handleChange}
										style={{ borderColor: 'white', color: 'white' }}
									>
										<MenuItem value="">
											<em>None</em>
										</MenuItem>
										<MenuItem value={10}>Relevancia</MenuItem>
										<MenuItem value={20}>Menor precio</MenuItem>
										<MenuItem value={30}>Mayor precio</MenuItem>
									</Select>
								</FormControl>
							</div>
							<div className="content-card">
								{filteredProducts.map((product: Product) => (
									<Card
										key={product.id}
										id={product.id}
										name={product.nombre}
										price={product.precio}
										img={product.src}
										description={product.descripcion}
										acabado={product.acabado}
									/>
								))}
							</div>
						</section>
					</section>
				</section>
			</main>
		</>
	);
}

export default ShopPage;
