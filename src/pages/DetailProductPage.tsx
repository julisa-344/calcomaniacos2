import "./style/DetailProduct.scss";
import { useContext, useState } from "react";
import Card from "../components/CardComponent";
import Button from "../components/Button";
import { CartContext, CartContextType } from '../CartContext';
import { useLocation } from "react-router-dom";

function DetailProductPage() {
  const { cart, setCart } = useContext<CartContextType>(CartContext);
  const location = useLocation();
  const product = location.state;
  const [selectedFinish, setSelectedFinish] = useState("default");
  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCart = () => {
    const productToAdd = {
      name: product.name,
      price: product.price,
      img: product.img,
      tamano: selectedSize,
      acabado: selectedFinish,
    };
    setCart([...cart, productToAdd]);
  };

  const handleFinishClick = (finishType: string) => {
    setSelectedFinish(finishType);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const getImageSrc = () => {
    return selectedFinish === 'default' ? product.img : product.acabado[selectedFinish];
  };

  return (
    <>
      <main className="bg-color">
        <section className="w-full flex p-4 product-detail">
          <div className="w-50 flex justify-center">
            <img
              className="detail-img"
              src={getImageSrc()}
              alt={product.name}
            />
          </div>
          <div className="contend-info-products">
            <h2 className="title">{product.name}</h2>
            <p className="title">S/. {product.price}</p>
            <p className="text">{product.description}</p>

            <div>
              <h3 className="sub-title">Acabado</h3>
              <div className="flex w-full">
                {["Glossy", "Matte", "Transparent"].map(finish => (
                  <Button
                    key={finish}
                    className="mr-4"
                    text={finish}
                    onClick={() => handleFinishClick(finish.toLowerCase())}
                    variant="outlined"
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="sub-title">Tamaño</h3>
              <div className="flex w-full flex-wrap">
                {["3x4cm", "6x8cm", "15x15cm", "20x20cm"].map(size => (
                  <Button
                    key={size}
                    className="mr-4 m-b"
                    text={`${size === "3x4cm" ? "Pequeño" : size === "6x8cm" ? "Mediano" : size === "15x15cm" ? "Grande" : "Extra Grande"} (${size})`}
                    onClick={() => handleSizeClick(size)}
                    variant="outlined"
                  />
                ))}
              </div>
            </div>

            <Button
              text="Agregar al carrito"
              onClick={handleAddToCart}
              className="m-t"
            />
          </div>
        </section>

        <h2 className="title m-4 text-center">
          Productos que te pueden interesar
        </h2>

        <section className="flex justify-around p-6">
          {["../assets/RM1.png", "../assets/RM2.png", "../assets/RM3.png"].map((img, index) => (
            <Card key={index} id="" name="Product" price={12} img={img} />
          ))}
        </section>
      </main>
    </>
  );
}

export default DetailProductPage;