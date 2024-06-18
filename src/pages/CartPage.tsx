import './style/CartPage.scss';
import './../theme.scss';
import React, { useContext, useState } from 'react';
import Card from '../components/CardComponent';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '../components/Button';

import { CartContext, CartContetType } from '../CartContext';

function CartPage() {
	const { cart } = useContext<CartContetType>(CartContext);
	const [counts, setCounts] = useState<{ [key: number]: number }>({});

	const increment = (index: number) => {
		setCounts(prevCounts => ({
			...prevCounts,
			[index]: (prevCounts[index] || 1) + 1
		}));
	};

	const decrement = (index: number) => {
		setCounts(prevCounts => ({
			...prevCounts,
			[index]: prevCounts[index] > 1 ? prevCounts[index] - 1 : 1
		}));
	};

	return (
		<>
			<main className="bg-color mt-h main">
				<h2 className="title text-center m-b">Carrito</h2>
				{cart.map((product, index) => (
					<div className='item-product' key={index}>
						<img src={product.img} alt={product.name} className='img-cart' />
						<p>{product.name}</p>
						<p> S/. {product.price * (counts[index] || 1)}</p>
						<div className='flex justify-between align-center content-btn'>
							<button onClick={() => decrement(index)} className='btn-small'>-</button>
							<span>{counts[index] || 1}</span>
							<button onClick={() => increment(index)} className='btn-small'>+</button>
						</div>
					</div>
				))}
				<div>
					<h2 className='sub-title'>Adicionar Cupon</h2>
					<div className='flex justify-between'>
						<Box
							className='flex align-center justify-between'
							component="form"
							sx={{
								'& > :not(style)': { m: 1 },
							}}
							noValidate
							autoComplete="off"
						>

							<TextField id="outlined-basic" label="Cupon" variant="outlined" />
							<Button text='Insertar' onClick={() => { }} variant='outlined' />
						</Box>
						<p className='sub-title'>
							S/. {cart.reduce((total, product, index) => total + product.price * (counts[index] || 1), 0)}
						</p>
					</div>
					<Button className='text-end' text='Finalizar compra' onClick={() => { }} />
				</div>
				<section>
					<h2 className='title m-4 text-center'>Productos que te pueden interesar</h2>

					<section className='flex justify-around p-6'>
						<Card name='Product' price={10} img="../assets/RM1.png" />
						<Card name='Product' price={10} img="../assets/RM2.png" />
						<Card name='Product' price={10} img="../assets/RM3.png" />
					</section>
				</section>
			</main>
		</>
	);
}
export default CartPage;