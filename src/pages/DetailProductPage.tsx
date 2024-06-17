import './../theme.scss';
import { useState, useContext } from "react";
import Card from "../components/CardComponent";
import Button from "../components/Button";
import { CartContext, CartContetType } from '../CartContext';
import { useLocation } from "react-router-dom";

function DetailProductPage() {

    const { cart, setCart } = useContext<CartContetType>(CartContext);
    const location = useLocation();
    const product = location.state;

    const handleAddToCart = () => {
        const product = {
          name: 'Nombre del producto',
          price: 'Precio del producto',
          img: 'URL de la imagen del producto',
        };
    
        setCart([...cart, product]);

        console.log(setCart)
      };

    return (
        <>
            <main className="bg-color">
                <section className="w-full flex p-4 product-detail">
                    <div className="w-50 flex justify-center">
                        <img src="../assets/RM4.png" alt="" />
                    </div>
                    <div className="contend-info-products">
                        <h2 className="title">ISDIN Fotoprotector Fusion</h2>
                        <p className='title'>S/. 99</p>

                        <p className='text'>Decora y personaliza portátiles, ventanas y más
                            Pegatinas de vinilo removibles y troqueladas.
                            Súper duradero y resistente al agua
                            Borde blanco de 3,2 mm (1/8 de pulgada) alrededor de cada diseño
                            Acabado mate
                            Los tipos de pegatinas se pueden imprimir y enviar desde diferentes ubicaciones.
                            Para pedidos con más de 2 pegatinas pequeñas, se imprimirán en pares con dos pegatinas en una hoja para reducir el desperdicio de hojas.</p>

                            <div>
                                <h3 className='sub-title'>Acabado</h3>
                                <div className='flex w-full'>
                                    <Button className='mr-4' text='Matte' onClick={()=>{}} variant='outlined'></Button>
                                    <Button  className="mr-4" text='Matte' onClick={()=>{}} variant='outlined'></Button>
                                    <Button className='mr-4' text='Matte' onClick={()=>{}} variant='outlined'></Button>

                                </div>
                            </div>
                            <div>
                                <h3 className='sub-title'>Tamano</h3>
                                <div className='flex w-full flex-wrap'>
                                    <Button className='mr-4 m-b' text='Pequeno (3x4cm)' onClick={()=>{}} variant='outlined'></Button>
                                    <Button  className="mr-4 m-b" text='Mediano (3x4cm)' onClick={()=>{}} variant='outlined'></Button>
                                    <Button className='mr-4 m-b' text='Grande (3x4cm)' onClick={()=>{}} variant='outlined'></Button>
                                    <Button className='mr-4 m-b' text='Extra Grande (3x4cm)' onClick={()=>{}} variant='outlined'></Button>
                                </div>
                            </div>
                        <Button text="Agregar al carrito" onClick={handleAddToCart} className='m-t'/>
                    </div>
                </section>

                <h2 className='title m-4 text-center'>Productos que te pueden interesar</h2>

                <section className='flex justify-around p-6'>
                    <Card name='Product' price='s/. 76' img="../../public/img/product1.png" />
                    <Card name='Product' price='s/. 76' img="../../public/img/product1.png" />
                    <Card name='Product' price='s/. 76' img="../../public/img/product1.png" />
                </section>

            </main>
        </>
    );
}

export default DetailProductPage;