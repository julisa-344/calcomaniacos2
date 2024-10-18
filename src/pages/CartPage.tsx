import "./style/CartPage.scss";
import "./../theme.scss";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/CardComponent";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "../components/Button";
import { CartContext, CartContextType } from "../CartContext";
import DeleteIcon from "@mui/icons-material/Delete";

// import the required functions to store collections in Firestore
import { collection, addDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ModalComponent from "../components/ModalComponent";

function CartPage() {
  const { cart, setCart } = useContext<CartContextType>(CartContext);
  const [counts, setCounts] = useState<{ [key: number]: number }>({});
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({
      title: "",
      content: "",
      img: "",
    });


  useEffect(() => {
    const calculateTotal = () => {
      const totalAmount = cart.reduce(
        (sum, product, index) => sum + product.price * (counts[index] || 1),
        0
      );
      setTotal(totalAmount);
    };
    calculateTotal();
  }, [cart, counts]);

  const increment = (index: number) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [index]: (prevCounts[index] || 1) + 1,
    }));
  };

  const decrement = (index: number) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [index]: prevCounts[index] > 1 ? prevCounts[index] - 1 : 1,
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
    // setShowModal(true);

    // Define the timestamp
    const timestamp = new Date().toISOString();

    if (!auth.currentUser) {
      setModalContent({
        title: "Inicia sesión",
        content: "Debes iniciar sesión para realizar una compra.",
        img: "/login.jpeg", // Replace with an appropriate image path
      });
      setShowModal(true);
      return;
    }


    // First, validate that the user is logged in
    if (!auth.currentUser) {
      console.error("User is not logged in");
      return;
    }

    // Define the userId
    const uid = auth.currentUser?.uid;

    // Define the purchaseId
    const purchaseId = `${uid}-${timestamp}-${Math.floor(
      Math.random() * 1000
    )}`;

    const customStickers = cart.filter((product) =>
      product.img.startsWith("data:")
    );

    console.log("Custom stickers: ", customStickers);

    const storage = getStorage();

    // Upload the custom stickers to the cloud storage
    customStickers.forEach(async (product, index) => {
      const image = product.img;
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(
        storage,
        `user-content/${uid}/${purchaseId}-${index}.png`
      );
      await uploadBytes(storageRef, blob);
      //   .then((snapshot) => {
      //     console.log("Uploaded file successfully!");
      //     // Get the download URL
      //     getDownloadURL(snapshot.ref)
      //       .then((url) => {
      //         console.log("File available at", url);
      //         // Use the URL to display the image or store it in your database
      //       })
      //       .catch((error) => {
      //         console.error("Error getting download URL:", error);
      //       });
      //   })
      //   .catch((error) => {
      //     console.error("Error uploading file:", error);
      //   });
      const url = await getDownloadURL(storageRef);
      cart[index].img = url;
    });

    // Define the items
    const items = cart.map((product, index) => ({
      acabado: product.acabado,
      tamanio: product.img,
      price: product.price,
      quantity: counts[index] || 1,
    }));

    // Define the purchase object
    const purchase = {
      purchaseId,
      // userId,
      timestamp,
      items,
    };

    // Send the data to Firestore
    const purchaseRef = collection(firestore, "purchases");
    addDoc(purchaseRef, purchase);

    // navigate("/payment", { state: { total } });
    setModalContent({
      title: "¡Compra exitosa!",
      content:
        "Tu compra ha sido realizada con éxito. En breve recibirás un correo con los detalles de tu compra.",
      img: "/start2.png",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (!auth.currentUser) {
      navigate("/login"); // Redirect to the login page
    }
  };

  return (
    <>
      <main className="bg-color mt-h main">
        <h2 className="title text-center m-b">Carrito</h2>
        {cart.length === 0 ? (
          <div className="text-center">
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
                <button onClick={() => decrement(index)} className="btn-small">
                  -
                </button>
                <span>{counts[index] || 1}</span>
                <button onClick={() => increment(index)} className="btn-small">
                  +
                </button>
              </div>
              <DeleteIcon onClick={() => removeItem(index)} />
            </div>
          ))
        )}
        <div>
          <h2 className="sub-title">Adicionar Cupon</h2>
          <div className="flex justify-between">
            <Box
              className="flex align-center justify-between"
              component="form"
              sx={{ "& > :not(style)": { m: 1 } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Cupon"
                variant="outlined"
                sx={{
                  "& .MuiInputBase-root": { color: "white" },
                  "& .MuiInputLabel-root": { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "gray" },
                    "&.Mui-focused fieldset": { borderColor: "gray" },
                  },
                }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <Button text="Insertar" onClick={() => {}} variant="outlined" />
            </Box>
            <p className="sub-title">S/. {total}</p>
          </div>
          <Button
            className="text-end"
            text="Finalizar compra"
            onClick={handleCheckout}
          />
        </div>
        <section>
          {showModal && ( //"/start2.png"
            <ModalComponent
              title={modalContent.title}
              content={modalContent.content}
              img={modalContent.img}
              onClose={() => handleCloseModal()}
            />
          )}
        </section>
        {/* <section>
          <h2 className="title m-4 text-center">
            Productos que te pueden interesar
          </h2>
          <section className="flex justify-around p-6">
            <Card
              id=""
              key=""
              name="Product"
              price={10}
              img="../assets/RM1.png"
            />
            <Card
              id=""
              key=""
              name="Product"
              price={10}
              img="../assets/RM2.png"
            />
            <Card
              id=""
              key=""
              name="Product"
              price={10}
              img="../assets/RM3.png"
            />
          </section>
        </section> */}
      </main>
    </>
  );
}

export default CartPage;
