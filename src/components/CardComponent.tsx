import './style/card.scss';
import Button from './Button';
import './../theme.scss';
import { useNavigate } from "react-router-dom";

type CardProps = {
    img: string;
    name: string;
    price: string;
};

function Card({ img, name, price }: CardProps) {
    let navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/detail-product");
      };
  
    return (
        <div className="card" >
            <img className='img-product' src={img} alt="producto" />
            <h3 className='sub-title'>{name}</h3>
            <p className='text'>{price}</p>
            <Button onClick={handleNavigate} text="Comprar" variant='outlined' />
        </div>
    );
}

export default Card;
