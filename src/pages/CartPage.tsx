import "./style/CartPage.scss";
import "./../theme.scss";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "../components/Button";
import { CartContext, CartContextType } from "../CartContext";
import { CouponContext, validateCoupon } from "../CouponContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, addDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ModalComponent from "../components/ModalComponent";

function CartPage() {
  const { cart, setCart } = useContext<CartContextType>(CartContext);
  const { coupon, setCoupon, discount, setDiscount } = useContext(CouponContext);
  const [couponCode, setCouponCode] = useState("");
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
      const initialTotal = cart.reduce(
        (sum, product, index) => sum + product.price * (counts[index] || 1),
        0
      );
      const discountedTotal = initialTotal * (1 - discount / 100);
      setTotal(discountedTotal);
    };
    calculateTotal();
  }, [cart, counts, discount]);

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

  const handleApplyCoupon = async () => {
    if (!auth.currentUser) {
      alert("Por favor, inicia sesión para aplicar un cupón.");
      return;
    }

    if (coupon) {
      alert("El cupón ya está aplicado. No se puede usar más de un cupón por compra.");
      return;
    }

    const discountValue = await validateCoupon(couponCode);
    if (discountValue > 0) {
      setCoupon(couponCode);
      setDiscount(discountValue);
      alert(`Cupón aplicado! Descuento del ${discountValue}%`);
    } else {
      alert("Cupón inválido");
    }
  };

  const handleCheckout = async () => {
    const timestamp = new Date().toISOString();
    if (!auth.currentUser) {
      setModalContent({
        title: "Inicia sesión",
        content: "Debes iniciar sesión para realizar una compra.",
        img: "/login.jpeg",
      });
      setShowModal(true);
      return;
    }
    const uid = auth.currentUser?.uid;
    const userEmail = auth.currentUser?.email;
    const purchaseId = `${uid}-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    const customStickers = cart.filter((product) => product.img.startsWith("data:"));
    const storage = getStorage();
    const uploadPromises = customStickers.map(async (product, index) => {
      const image = product.img;
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `user-content/${uid}/${purchaseId}-${index}.png`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      cart[index].img = url;
    });
    await Promise.all(uploadPromises);
    const items = cart.map((product, index) => ({
      style: product.acabado,
      imageSrc: product.img,
      price: product.price,
      quantity: counts[index] || 1,
    }));
  
    const purchase = {
      id: purchaseId,
      items: items,
      timestamp: timestamp,
      userId: uid || "",
      userEmail: userEmail || "",
    };
  
    const purchaseRef = collection(firestore, "purchases");
    await addDoc(purchaseRef, purchase);
  
    setModalContent({
      title: "¡Compra exitosa!",
      content: "Tu compra ha sido realizada con éxito. En breve recibirás un correo con los detalles de tu compra.",
      img: "/success.png",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (!auth.currentUser) {
      navigate("/login");
    }
  };

  return (
    <>
      <main className="bg-color mt-h main">
        <h2 className="title text-center m-b">Carrito</h2>
        {cart.length === 0 ? (
          <div className="text-center">
            <img src="../img/cart-empty.png" alt="Carrito vacío" />
          </div>
        ) : (
          <>
            {cart.map((product, index) => (
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
            ))}

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
                    label="Código de Cupón"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
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
                  <Button
                    text="Insertar"
                    onClick={handleApplyCoupon}
                    variant="outlined"
                  />
                </Box>
                <p className="sub-title">S/. {total.toFixed(2)}</p>
              </div>
              <Button
                className="text-end"
                text="Finalizar compra"
                onClick={handleCheckout}
              />
            </div>
          </>
        )}
        <section>
          {showModal && (
            <ModalComponent
              title={modalContent.title}
              content={modalContent.content}
              img={modalContent.img}
              onClose={handleCloseModal}
            />
          )}
        </section>
      </main>
    </>
  );
}

export default CartPage;