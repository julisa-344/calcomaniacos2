import './../theme.scss';
import { useContext } from "react";
import Card from "../components/CardComponent";
import Button from "../components/Button";
import { CartContext, CartContetType } from '../CartContext';
import { useLocation } from "react-router-dom";

function DetailProductPage() {

	const { cart, setCart } = useContext<CartContetType>(CartContext);
	const location = useLocation();
	const product = location.state;

	const handleAddToCart = () => {
		const productToAdd = {
			name: product.name,
			price: product.price,
			img: product.img,
		};

		setCart([...cart, productToAdd]);
		console.log(cart);
	};
	return (
		<>
			<main className="bg-color">
				<section className="w-full flex p-4 product-detail">
					<div className="w-50 flex justify-center">
						<img src={product.img} alt="" />
					</div>
					<div className="contend-info-products">
						<h2 className="title">{product.name}</h2>
						<p className='title'> S/. {product.price}</p>

						<p className='text'>{product.description}</p>

						<div>
							<h3 className='sub-title'>Acabado</h3>
							<div className='flex w-full'>
								<Button className='mr-4' text='Olografico' onClick={() => { }} variant='outlined'></Button>
								<Button className="mr-4" text='Matte' onClick={() => { }} variant='outlined'></Button>
								<Button className='mr-4' text='Transparente' onClick={() => { }} variant='outlined'></Button>

							</div>
						</div>
						<div>
							<h3 className='sub-title'>Tamano</h3>
							<div className='flex w-full flex-wrap'>
								<Button className='mr-4 m-b' text='Pequeno (3x4cm)' onClick={() => { }} variant='outlined'></Button>
								<Button className="mr-4 m-b" text='Mediano (6x8cm)' onClick={() => { }} variant='outlined'></Button>
								<Button className='mr-4 m-b' text='Grande (15x15cm)' onClick={() => { }} variant='outlined'></Button>
								<Button className='mr-4 m-b' text='Extra Grande (20x20cm)' onClick={() => { }} variant='outlined'></Button>
							</div>
						</div>
						<Button text="Agregar al carrito" onClick={handleAddToCart} className='m-t' />
					</div>
				</section>

				<h2 className='title m-4 text-center'>Productos que te pueden interesar</h2>

				<section className='flex justify-around p-6'>
					<Card name='Product' price={12} img="../assets/RM1.png" />
					<Card name='Product' price={12} img="../assets/RM2.png" />
					<Card name='Product' price={12} img="../assets/RM3.png" />
				</section>

			</main>
		</>
	);
}

export default DetailProductPage;