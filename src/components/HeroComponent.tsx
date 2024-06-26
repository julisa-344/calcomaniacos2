import { useState, useEffect } from 'react';
import './style/Hero.scss';
import ButtonComponent from './Button';
import { useNavigate } from 'react-router-dom';

function HeroComponent() {

    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/make-collection');
      };
      
    const [backgroundImageIndex, setBackgroundImageIndex] = useState(0);
    const backgroundImageList = [
        '/img/bg1.png',
        '/img/bg2.png',
        '/img/bg3.png',
        '/img/bg4.png'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundImageIndex((prevIndex) => (prevIndex + 1) % backgroundImageList.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [backgroundImageList.length]);

    return (
        <div className="bg-color m-height m-width absolute bg">
            <div className="m-height m-width relative p-4 herobg" style={{ backgroundImage: `url(${backgroundImageList[backgroundImageIndex]})` }}>
                <div className="text-center">
                    <div className="mb-4">
                        <h1 className="title-main ">
                            Calcomaniacos
                        </h1>

                        <p className="sub-title ">
                            Locos por los stickers
                        </p>
                        <ButtonComponent text='Crea tu colecciòn' onClick={handleButtonClick} variant='outlined' />
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroComponent;
