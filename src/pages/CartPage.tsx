import './style/CartPage.scss';
import './../theme.scss';
import { useContext, useState, useEffect } from 'react';
import Card from '../components/CardComponent';
import { TextField } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '../components/Button';
import { CartContext, CartContextType } from '../CartContext';
import DeleteIcon from "@mui/icons-material/Delete";

// import the required functions to store collections in Firestore
// import { collection, addDoc } from 'firebase/firestore';
// import { firestore, auth } from "../firebase-config";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { firestore, auth } from './firebase-config';

function CartPage() {
    const { cart, setCart } = useContext<CartContextType>(CartContext);
    const [counts, setCounts] = useState<{ [key: number]: number }>({});
    const [total, setTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);

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
        console.log("Products to buy: ", cart);
        setShowModal(true);

        // Send the data to firestore:
        // 1. Create a new collection in Firestore (purchase)
        // The payload should be as follows:
        /*
              For each purchase:
              {
                  "purchaseId": "purchase-123",
                  "userId": "user-456",
                  "timestamp": "2020-01-01T00:00:00Z",
                  "items": [
                      {
                      "acabado": "glossy",
                      "tamanio": "gs://your-bucket/stickers/sticker-789.png",
                      "price": 2.99,
                      "quantity": 2
                      },
                      {
                      "acabado": "sticker-101",
                      "tamanio": "gs://your-bucket/stickers/sticker-101.png",
                      "price": 1.99,
                      "quantity": 1
                      }
                  ]
              }
  
              ** Keep in mind that if the user has created a custom collection, we first have to upload that to cloud storage. Then, we can add the URL (image source) to the collection.
          */
        // 2. Updload the purchase and set it into the 'purchases' firestore collection
        // 3. Send an email to the user with the purchase details
        // 4. Redirect the user to the payment page

        // The 'cart' object has the producuts, with the following structure:
        // acabado,
        // img,
        // name,
        // price,
        // tamano

        // First, identify if the sticker is a custom one (it should have the 'data' string at the start of the img attribute)

        // Then, for each product in the cart, upload the image to the cloud storage

        // Define the timestamp
        // const timestamp = new Date().toISOString();

        // // First, validate that the user is logged in
        // if (!auth.currentUser) {
        //     console.error("User is not logged in");
        //     return;
        // }

        // // Define the userId
        // const uid = auth.currentUser?.uid;



        // // Define the purchaseId
        // const purchaseId = `${uid}-${timestamp}-${Math.floor(
        //     Math.random() * 1000
        // )}`;

        // const customStickers = cart.filter((product) =>
        //     product.img.startsWith("data:")
        // );

        // console.log("Custom stickers: ", customStickers);

        // const storage = getStorage();

        // // Upload the custom stickers to the cloud storage
        // customStickers.forEach(async (product, index) => {
        //     const image = product.img;
        //     const response = await fetch(image);
        //     const blob = await response.blob();
        //     const storageRef = ref(
        //         storage,
        //         `user-content/${uid}/${purchaseId}-${index}.png`
        //     );
        //     await uploadBytes(storageRef, blob);
        //     //   .then((snapshot) => {
        //     //     console.log("Uploaded file successfully!");
        //     //     // Get the download URL
        //     //     getDownloadURL(snapshot.ref)
        //     //       .then((url) => {
        //     //         console.log("File available at", url);
        //     //         // Use the URL to display the image or store it in your database
        //     //       })
        //     //       .catch((error) => {
        //     //         console.error("Error getting download URL:", error);
        //     //       });
        //     //   })
        //     //   .catch((error) => {
        //     //     console.error("Error uploading file:", error);
        //     //   });
        //     const url = await getDownloadURL(storageRef);
        //     cart[index].img = url;
        // });

        // // Define the items
        // const items = cart.map((product, index) => ({
        //     acabado: product.acabado,
        //     tamanio: product.img,
        //     price: product.price,
        //     quantity: counts[index] || 1,
        // }));

        // // Define the purchase object
        // const purchase = {
        //     purchaseId,
        //     // userId,
        //     timestamp,
        //     items,
        // };

        // // Send the data to Firestore
        // const purchaseRef = collection(firestore, "purchases");
        // addDoc(purchaseRef, purchase);

        // navigate("/payment", { state: { total } });
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
                            <Button text="Insertar" onClick={() => { }} variant="outlined" />
                        </Box>
                        <p className="sub-title">S/. {total}</p>
                    </div>
                    <Button className="text-end" text="Finalizar compra" onClick={handleCheckout} />
                </div>
                <section>
                    {showModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Compra satisfactoria</h2>
                                <p>Gracias por tu compra. Recibirás un correo con los detalles.</p>
                                <button onClick={() => setShowModal(false)}>Cerrar</button>
                            </div>
                        </div>
                    )}

                </section>
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
