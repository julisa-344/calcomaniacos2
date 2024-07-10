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
	name: string;
	price: number;
	img: string;
	category: string;
	description: string;
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
			const querySnapshot = await getDocs(collection(firestore, 'products'));
			const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
			setProducts(productsData);
		};
		fetchData();
	}, []);
	
	const filteredProducts = products.filter(
		(product) =>
			product.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
			(selectedCategories.length === 0 ||
				selectedCategories.includes(product.category))
	);

	const handleCategoryChange = (category: string, isChecked: boolean) => {
		if (isChecked) {
			setSelectedCategories((prev) => [...prev, category]);
		} else {
			setSelectedCategories((prev) => prev.filter((c) => c !== category));
		}
	};

	const categories = products
		.map((product) => product.category)
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
									<SearchIcon style={{ color: 'white' }} />
								</div>
							</div>
							<div className="content-card">
								{filteredProducts.map((product: Product) => (
									<Card
										key={product.id}
										id={product.id}
										name={product.name}
										price={product.price}
										img={product.img}
										description={product.description}
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
