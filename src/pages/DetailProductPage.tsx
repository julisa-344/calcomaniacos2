import './../theme.scss';
import { useState } from "react";
import Card from "../components/CardComponent";
import Button from "../components/Button";
import Footer from "../components/FooterComponent";
import Header from "../components/HeaderComponent";
function DetailProductPage() {

    const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
    const [showReviews, setShowReviews] = useState(false);

    const handleAdditionalInfoClick = () => {
        setShowAdditionalInfo(true);
        setShowReviews(false);
    };

    const handleReviewsClick = () => {
        setShowAdditionalInfo(false);
        setShowReviews(true);
    };

    return (
        <>
            <Header />
            <main>
                <section className="w-full flex m-4 product-detail">
                    <div className="w-50 flex justify-center">
                        <img src="../public/img/product1.png" alt="" />
                    </div>
                    <div className="contend-info-products">
                        <h2 className="title">ISDIN Fotoprotector Fusion</h2>
                        <p className='title'>S/. 99</p>

                        <p className='text'>Fotoprotector facial de textura ultraligera y fase externa acuosa con acabado final sedoso
                            Protege tu piel con Fusion Water MAGIC SPF 50, el fotoprotector facial ultraligero de absorción inmediata y uso diario que se funde con la piel y proporciona una alta protección. Hidrata la piel y aporta acción antioxidante.</p>
                        <Button text="Agregar al carrito" onClick={() => { }} />
                        <div className='content-beneficios'>
                            <h3 className='sub-title'>Beneficios</h3>
                            <div className='flex align-center'>
                                <img className='icon-benefices' src="../public/Vector.svg" alt="" />
                                <p className='text'>gidratante</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='w-full flex justify-center m-4'>
                    <Button text="Informacion Adicional" onClick={handleAdditionalInfoClick} className='switch-btn' />
                    <Button text="Reviews" onClick={handleReviewsClick} className='switch-btn' />
                </section>
                <section className='w-full'>
                    {showAdditionalInfo && (
                        <div className='additional-info flex'>
                            <div className='w-33 flex justify-center align-center'>
                                <div className='content-info'>
                                    <h2 className='sub-title'>Ingredientes</h2>
                                    <p className='text'>AQUA (WATER), DIBUTYL ADIPATE, PROPANEDIOL, ETHYLHEXYL SALICYLATE, ETHYLHEXYL TRIAZONE, BIS-ETHYLHEXYLOXYPHENOL METHOXYPHENYL TRIAZINE, DIMETHICONE, BUTYL</p>
                                </div>
                            </div>
                            <div className='w-33 flex justify-center align-center '>
                                <div>
                                    <img className='w-full' src="../public/img/imginfa.png" alt="" />

                                </div>
                            </div>
                            <div className='w-33 flex justify-center align-center '>
                                <div className='content-info'>
                                    <h2 className='sub-title'>Modo de uso</h2>

                                    <div>
                                        <img src="" alt="" />
                                        <div>
                                            <h3 className='sub-title'>Cantidad</h3>
                                            <p className='text'>Lorem ipsum dolor sit amet, consectetur.</p>
                                        </div>
                                        <div>
                                            <h3 className='sub-title'>Cantidad</h3>
                                            <p className='text'>Lorem ipsum dolor sit amet, consectetur.</p>
                                        </div>
                                        <div>
                                            <h3 className='sub-title'>Cantidad</h3>
                                            <p className='text'>Lorem ipsum dolor sit amet, consectetur.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {showReviews && (
                        <div className='reviews'>
                            <h2 className='sub-title'>Crea tu resena</h2>
                            <div>
                                <input type="text" />
                                <Button text="Enviar" onClick={() => { }} />
                            </div>

                            <div>
                                <img src="" alt="" />
                                <div>
                                    <h2>HarvetzHarvetz</h2>
                                    <div>
                                        <img src="" alt="" />
                                        <img src="" alt="" />
                                        <img src="" alt="" />
                                    </div>
                                    <p>Excelente producto, me encanta</p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <h2 className='title m-4 text-center'>Productos que te pueden interesar</h2>

                <section className='flex justify-around m-6'>
                    <Card title='Product' price='s/. 76' img="../../public/img/product1.png" />
                    <Card title='Product' price='s/. 76' img="../../public/img/product1.png" />
                    <Card title='Product' price='s/. 76' img="../../public/img/product1.png" />
                </section>

            </main>
            <Footer />
        </>
    );
}

export default DetailProductPage;