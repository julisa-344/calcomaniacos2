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
import emailjs from 'emailjs-com';

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

  const calculatePrice = (type: string, quantity: number): number => {
    switch (type) {
      case "trasferible":
        if (quantity === 1) return 22.5;
        if (quantity === 2) return 20;
        return 18;
      case "vinil":
        if (quantity === 1) return 20;
        if (quantity === 2) return 18;
        return 16;
      case "vinil hologràfico":
        if (quantity === 1) return 23;
        if (quantity === 2) return 20;
        return 18;
      case "tatto":
        if (quantity === 1) return 24;
        if (quantity === 2) return 23;
        return 20;
      case "tatto fotoluminiscente":
        if (quantity === 1) return 25;
        if (quantity === 2) return 22;
        return 21;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const calculateTotal = () => {
      const itemCounts: { [key: string]: number } = {};
  
      // Contar la cantidad de cada tipo de acabado
      cart.forEach((product, index) => {
        const count = counts[index] || 1;
        if (itemCounts[product.acabado]) {
          itemCounts[product.acabado] += count;
        } else {
          itemCounts[product.acabado] = count;
        }
      });
  
      // Calcular el total basado en el tipo y la cantidad
      const updatedCart = cart.map((product, index) => {
        const quantity = itemCounts[product.acabado];
        const price = calculatePrice(product.acabado, quantity);
        return { ...product, price };
      });
  
      setCart(updatedCart);
  
      const initialTotal = updatedCart.reduce((sum, product, index) => {
        const count = counts[index] || 1;
        return sum + product.price * count;
      }, 0);
  
      const discountedTotal = initialTotal * (1 - discount / 100);
      setTotal(discountedTotal);
    };
  
    calculateTotal();
  }, [cart, discount, counts, setCart]);

  const increment = (index: number) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [index]: (prevCounts[index] || 1) + 1,
    }));
  }
  
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
      acabado: product.acabado,
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

    // Enviar correo electrónico al usuario usando EmailJS
    const userTemplateParams = {
      to_name: auth.currentUser?.displayName || 'Cliente',
      user_email: userEmail,
      admin_email: 'calcomaniacos.pe@gmail.com',
      purchase_id: purchaseId,
      items: JSON.stringify(items, null, 2),
      total: total.toFixed(2),
      message: 'Gracias por tu compra! Aquí tienes el resumen de tu compra.',
    };

    emailjs.send('service_zrba569', 'template_f0psaxe', userTemplateParams, 'KgLmLp1EAALkSW72J')
      .then((response) => {
        console.log('Correo enviado con éxito al usuario:', response.status, response.text);
      }, (error) => {
        console.error('Error al enviar el correo al usuario:', error);
      });

    // Enviar correo electrónico al administrador usando EmailJS
    const adminTemplateParams = {
      to_name: auth.currentUser?.displayName || 'Cliente',
      user_id: uid,
      purchase_id: purchaseId,
      items: JSON.stringify(items, null, 2),
      total: total.toFixed(2),
    };

    emailjs.send('service_zrba569', 'template_l9bu4lf', adminTemplateParams, 'KgLmLp1EAALkSW72J')
      .then((response) => {
        console.log('Correo enviado con éxito al administrador:', response.status, response.text);
      }, (error) => {
        console.error('Error al enviar el correo al administrador:', error);
      });

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