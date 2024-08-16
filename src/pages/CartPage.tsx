import './style/CartPage.scss';
import './../theme.scss';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/CardComponent';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '../components/Button';
import { CartContext, CartContextType } from '../CartContext';
import DeleteIcon from "@mui/icons-material/Delete";

function CartPage() {
    const { cart, setCart } = useContext<CartContextType>(CartContext);
    const [counts, setCounts] = useState<{ [key: number]: number }>({});
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const calculateTotal = () => {
            const totalAmount = cart.reduce((sum, product, index) => sum + product.price * (counts[index] || 1), 0);
            setTotal(totalAmount);
        };
        calculateTotal();
    }, [cart, counts]);

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

    const removeItem = (index: number) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);

        const updatedCounts = { ...counts };
        delete updatedCounts[index];
        setCounts(updatedCounts);
    };

    const handleCheckout = () => {
        navigate('/payment', { state: { total } });
    };

    return (
        <>
            <main className="bg-color mt-h main">
                <h2 className="title text-center m-b">Carrito</h2>
                {cart.length === 0 ? (
                    <div className='text-center'> 
                    <img src="../img/cart-empty.png" alt="" />
                    </div>

                ) : (
                    cart.map((product, index) => (
                        <div className="item-product" key={index}>
                            <img src={product.img} alt={product.name} className="img-cart" />
                            <p>{`${product.name}`}</p>
                            <p>Tamaño: {product.tamano}</p>
                            <p>Acabado: {product.acabado}</p>
                            <p> S/. {product.price * (counts[index] || 1)}</p>
                            <div className="flex justify-between align-center content-btn">
                                <button onClick={() => decrement(index)} className="btn-small">-</button>
                                <span>{counts[index] || 1}</span>
                                <button onClick={() => increment(index)} className="btn-small">+</button>
                            </div>
                            <DeleteIcon onClick={() => removeItem(index)} />
                        </div>
                    ))
                )}
                <div>
                    <h2 className="sub-title">Adicionar Cupon</h2>
                    <div className="flex justify-between">
                        <Box className="flex align-center justify-between" component="form" sx={{ "& > :not(style)": { m: 1 }, }} noValidate autoComplete="off">
                            <TextField id="outlined-basic" label="Cupon" variant="outlined" sx={{ "& .MuiInputBase-root": { color: "white", }, "& .MuiInputLabel-root": { color: "white", }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "white", }, "&:hover fieldset": { borderColor: "gray", }, "&.Mui-focused fieldset": { borderColor: "gray", }, }, }} InputLabelProps={{ style: { color: "white" }, }} />
                            <Button text="Insertar" onClick={() => {}} variant="outlined" />
                        </Box>
                        <p className="sub-title">S/. {total}</p>
                    </div>
                    <Button className="text-end" text="Finalizar compra" onClick={handleCheckout} />
                </div>
                <section>
                    <h2 className="title m-4 text-center">Productos que te pueden interesar</h2>
                    <section className="flex justify-around p-6">
                        <Card id="" key="" name="Product" price={10} img="../assets/RM1.png" />
                        <Card id="" key="" name="Product" price={10} img="../assets/RM2.png" />
                        <Card id="" key="" name="Product" price={10} img="../assets/RM3.png" />
                    </section>
                </section>
            </main>
        </>
    );
}

export default CartPage;
