import "./style/DetailProduct.scss";
import { useContext, useState } from "react";
// import Card from "../components/CardComponent";
import Button from "../components/Button";
import { CartContext, CartContextType } from '../CartContext';
import { useLocation } from "react-router-dom";

function DetailProductPage() {
	const { cart, setCart } = useContext<CartContextType>(CartContext);
	const location = useLocation();
	const product = location.state;
	const [selectedSize, setSelectedSize] = useState("");
  const [selectedFinish, setSelectedFinish] = useState("default");

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
		if (selectedFinish === 'default') {
			return product.img;
		} else {
			return product.acabado[selectedFinish];
		}
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
                <Button
                  className="mr-4"
                  text="Glossy"
                  onClick={() => handleFinishClick("glossy")}
                  variant="outlined"
                />
                <Button
                  className="mr-4"
                  text="Matte"
                  onClick={() => handleFinishClick("matte")}
                  variant="outlined"
                />
                <Button
                  className="mr-4"
                  text="Transparente"
                  onClick={() => handleFinishClick("transparent")}
                  variant="outlined"
                />
              </div>
            </div>

            <div>
              <h3 className="sub-title">Tamaño</h3>
              <div className="flex w-full flex-wrap">
                <Button
                  className="mr-4 m-b"
                  text="Pequeño (3x4cm)"
                  onClick={() => handleSizeClick("3x4cm")}
                  variant="outlined"
                />
                <Button
                  className="mr-4 m-b"
                  text="Mediano (6x8cm)"
                  onClick={() => handleSizeClick("6x8cm")}
                  variant="outlined"
                />
                <Button
                  className="mr-4 m-b"
                  text="Grande (15x15cm)"
                  onClick={() => handleSizeClick("15x15cm")}
                  variant="outlined"
                />
                <Button
                  className="mr-4 m-b"
                  text="Extra Grande (20x20cm)"
                  onClick={() => handleSizeClick("20x20cm")}
                  variant="outlined"
                />
              </div>
            </div>

            <Button
              text="Agregar al carrito"
              onClick={handleAddToCart}
              className="m-t"
            />
          </div>
        </section>

        {/* <h2 className="title m-4 text-center">
          Productos que te pueden interesar
        </h2>

        <section className="flex justify-around p-6">
          <Card id="" name="Product" price={12} img="../assets/RM1.png" />
          <Card id="" name="Product" price={12} img="../assets/RM2.png" />
          <Card id="" name="Product" price={12} img="../assets/RM3.png" />
        </section> */}
      </main>
    </>
  );
}

export default DetailProductPage;