import './style/card.scss';
import Button from './Button';
import './../theme.scss';
import { useNavigate } from "react-router-dom";

type CardProps = {
    img: string;
    name: string;
    price: number;
    description?: string;
    acabado?: object;
};
function Card({ img, name, price, description, acabado}: CardProps & { [key: string]: any }) {
    let navigate = useNavigate();
    console.log("CardProps", acabado );

    const handleNavigate = () => {
        navigate("/detail-product", 
        { state: { img, name, price, description, acabado} });
      };
    return (
        <div className="card" >
            <img className='img-product' src={img} alt="producto" />
            <h3 className='sub-title'>{name}</h3>
            <p className='text'>S/. {price}</p>
            <Button onClick={handleNavigate} text="Comprar" variant='outlined' />
        </div>
    );
}

export default Card;
