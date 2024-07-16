import * as React from 'react';
import "./style/shopPage.scss";
import "../theme.scss";
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Grid,
	TextField,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
} from '@mui/material';
import {
	Search as SearchIcon,
	FilterList as FilterListIcon,
} from '@mui/icons-material'; import { useEffect, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase-config';
import Card from '../components/CardComponent';

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
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [age, setAge] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const querySnapshot = await getDocs(collection(firestore, 'products'));
			const productsData = querySnapshot.docs.map(
				(doc) => ({ id: doc.id, ...doc.data() } as Product)
			);
			setProducts(productsData);
			setIsLoading(false);
		};
		fetchData();
	}, []);

	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
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

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};

	const drawerContent = (
		<div style={{ width: 250 }}>
			<List>
				<ListItem>
					<ListItemText primary="Filtros" />
				</ListItem>
				<ListItem>
					<FormControl component="fieldset">
						{categories.map((category, index) => (
							<FormControlLabel
								key={index}
								control={
									<Checkbox
										checked={selectedCategories.includes(category)}
										onChange={(e) =>
											handleCategoryChange(category, e.target.checked)
										}
										style={{ color: 'gray' }}
									/>
								}
								label={category}
							/>
						))}
					</FormControl>
				</ListItem>
			</List>
		</div>
	);

	return (
		<main className="main bg-color">
			<section className="p-4">
				<Grid container spacing={4}>
					<Grid item >
						<div className="flex justify-between align-center mb-4">
							<div className="input-search">
								<TextField
									className="input-transparent"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									placeholder="Buscar..."
								/>
								<SearchIcon style={{ color: 'white', textAlign:'right' }} />
							</div>
							<FormControl
								sx={{
									m: 1,
									minWidth: 120,
									'& .MuiOutlinedInput-root': {
										'& fieldset': {
											borderColor: 'white',
										},
										'&:hover fieldset': {
											borderColor: 'gray',
										},
										'&.Mui-focused fieldset': {
											borderColor: 'gray',
										},
									},
								}}
								size="small"
								variant="outlined"
							>
								<InputLabel
									id="demo-select-small-label"
									sx={{ color: 'white' }}
								>
									Ordenar por:
								</InputLabel>
								<Select
									labelId="demo-select-small-label"
									id="demo-select-small"
									value={age}
									onChange={handleChange}
									label="Age"
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
							<div className='filter-icon'
							>
								<IconButton
									onClick={toggleDrawer}
									edge="start"
									color="inherit"
									aria-label="open drawer"
								>
									<FilterListIcon style={{ color: 'white' }} />
								</IconButton>
							</div>

						</div>
						<section className='flex justify-between w-max'>
							<aside className='section_filtros'>
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
												style={{ color: "white" }}
											/>
											{category}
										</label>
									))}
								</div>
							</aside>
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

					</Grid>
				</Grid>
				{<Drawer
					anchor="left"
					open={drawerOpen}
					onClose={toggleDrawer}
					variant="temporary"
					ModalProps={{
						keepMounted: true,
					}}
				>
					{drawerContent}
				</Drawer>}
			</section>
		</main>
	);
}

export default ShopPage;
