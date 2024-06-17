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
        <div className="item-product">
          {cart.map((product, index) => (
            <div key={index}>
              <p>{product.name}</p>
              <p>{product.price}</p>
              <img src={product.img} alt={product.name} className='img-cart' />
            </div>
          ))}
  
          <div>
            <button>-</button>
            <span>1</span>
            <button>+</button>
          </div>
        </div>
        <div>
          <h2 className='sub-title'>Adicionar Cupon</h2>
          <div className='flex'>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '60%' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField id="outlined-basic" label="Cupon" variant="outlined" />
            <Button text='Insertar' onClick={()=>{}}/>
          </Box>
          <Button text='Finalizar compra' onClick={()=>{}} variant='outlined'/>
          </div>
        </div>
        <section>
          <h2 className='sub-title'>Productos que te pueden interesar</h2>
          <div className='flex justify-between'>
            <Card
              key={16}
              name='Harry Poter'
              price='S/. 16.90'
              img='../assets/AM1.png'
            />
            <Card
              key={17}
              name='Harry Poter'
              price='S/. 13.90'
              img='../assets/AM1.png'
            />
            <Card
              key={18}
              name='Harry Poter'
              price='S/. 14.90'
              img='../assets/AM1.png'
            />
          </div>
        </section>
      </main>
    </>
  );
}
export default CartPage;