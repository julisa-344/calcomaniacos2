import './style/CartPage.scss';
import './../theme.scss';
import React, { useContext } from 'react';
import Card from '../components/CardComponent';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '../components/Button';

import { CartContext, CartContetType } from '../CartContext';

function CartPage() {
	const { cart } = useContext<CartContetType>(CartContext);

	return (
		<>
			<main className="bg-color mt-h main">
				<h2 className="title text-center m-b">Carrito</h2>
				{cart.map((product, index) => (
					<div className='item-product' key={index}>
						<img src={product.img} alt={product.name} className='img-cart' />
						<p>{product.name}</p>
						<p>{product.price}</p>
						<div>
							<button>-</button>
							<span>1</span>
							<button>+</button>
						</div>

					</div>
				))}

				<div>
					<h2 className='sub-title'>Adicionar Cupon</h2>
					<div className='flex justify-between align-center'>
						<Box
						className='flex align-center'
							component="form"
							sx={{
								'& > :not(style)': { m: 1, width: '60%' },
							}}
							noValidate
							autoComplete="off"
						>
							<TextField id="outlined-basic" label="Cupon" variant="outlined" />
							<Button text='Insertar' onClick={() => { }} variant='outlined' />
						</Box>
						<Button text='Finalizar compra' onClick={() => { }}  />
					</div>
				</div>
				<section>
					<h2 className='title m-4 text-center'>Productos que te pueden interesar</h2>

					<section className='flex justify-around p-6'>
						<Card name='Product' price='s/. 76'  img = "../assets/RM1.png" />
						<Card name='Product' price='s/. 76'  img = "../assets/RM2.png" />
						<Card name='Product' price='s/. 76'  img = "../assets/RM3.png" />
					</section>
				</section>
			</main>
		</>
	);
}
export default CartPage;