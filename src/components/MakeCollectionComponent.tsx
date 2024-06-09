import { useEffect, useState } from 'react';
import Button from './Button'
import './style/MakeCollection.scss';
import { fabric } from 'fabric';

function MakeCollection() {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [imagePairs, setImagePairs] = useState<Map<fabric.Image, fabric.Image>>(new Map());
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch("data.json");
            const images = await data.json();
            setImages(images);
        };

        fetchData();
    }, []);
    
    useEffect(() => {
      setCanvas(new fabric.Canvas('canvasId'));
    }, []);
    
    const addToCanvas = (image: { src: string }) => {
        if (!canvas) {
            console.error('Canvas is not initialized yet');
            return;
        }

        const imageUrl = new URL(image.src, window.location.href).href;

        fabric.Image.fromURL(imageUrl, (img) => {
            const canvasCenterX = canvas.getWidth() / 2;
            const canvasCenterY = canvas.getHeight() / 2;
            console.log('fabric', imageUrl);

            img.set({
                left: canvasCenterX,
                top: canvasCenterY,
                scaleX: 0.5,
                scaleY: 0.5,
                hasBorders: false,
                hasControls: true,
                originX: "center",
                originY: "center",
                lockUniScaling: true,
            });
        
            img.setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
                bl: true,
                br: true,
                tl: true,
                tr: true,
            });
        
            const silhouetteImg = new fabric.Image(img.getElement(), {
                left: canvasCenterX,
                top: canvasCenterY,
                scaleX: img.scaleX,
                scaleY: img.scaleY,
                originX: "center",
                originY: "center",
                selectable: false,
                evented: false,
                angle: img.angle,
                flipX: img.flipX,
                flipY: img.flipY,
            });
        
            img.on("moving", () => updateSilhouetteTransform(img, silhouetteImg));
            img.on("scaling", () => updateSilhouetteTransform(img, silhouetteImg));
            img.on("rotating", () => updateSilhouetteTransform(img, silhouetteImg));
            img.on("flipping", () => updateSilhouetteTransform(img, silhouetteImg));
        
            img.on("modified", () => updateSilhouette(img, silhouetteImg));
        
            setImagePairs((prevPairs) => new Map(prevPairs.set(img, silhouetteImg)));
        
            canvas.add(silhouetteImg);
            canvas.add(img);
            updateSilhouette(img, silhouetteImg);
        });
    };
    
    function updateSilhouetteTransform(img: fabric.Image, silhouetteImg: fabric.Image) {
        silhouetteImg.set({
            left: img.left,
            top: img.top,
            scaleX: img.scaleX,
            scaleY: img.scaleY,
            angle: img.angle,
            flipX: img.flipX,
            flipY: img.flipY,
        });
        canvas?.renderAll();
    }
    
    function updateSilhouette(img: fabric.Image, silhouetteImg: fabric.Image) {
        const scaleX = img.scaleX || 1;
        const scaleY = img.scaleY || 1;
        const margin = 12 / Math.max(scaleX, scaleY); // tamaño inicial de la silueta
        const silhouetteDataURL = ""; // Define or fetch silhouetteDataURL here

        fabric.Image.fromURL(silhouetteDataURL, function (newSilhouetteImg) {
            silhouetteImg.setElement(newSilhouetteImg.getElement());
            silhouetteImg.set({
                left: img.left,
                top: img.top,
                angle: img.angle,
                scaleX: scaleX,
                scaleY: scaleY,
                flipX: img.flipX,
                flipY: img.flipY,
            });
            canvas?.renderAll();
        });
    }
    
    return (
        <section className="container">
            <div className="content-canvas">
                <div className='action-canvas'>
                    <div className="color-picker-container">
                        <label htmlFor="silhouette-type">Tipo de Silueta:</label>
                        <select id="silhouette-type" className="color-picker">
                            <option value="solid">Sólido</option>
                            <option value="gradient">Degradado</option>
                        </select>
                        <input type="color" id="color-picker" className="color-picker" value="#ffffff" />
                        <input type="color" id="gradient-color-picker" className="color-picker" value="#000000" style={{ display: "none" }} />
                        <button id="update-silhouette-thickness-btn">Actualizar Grosor de Silueta</button>
                    </div>
                </div>
                <canvas id="canvas" width="567" height="794"></canvas>
            </div>
            <div>
                <div className="catalog-container">
                    <div className="catalog-categories">
                    </div>
                    <div id="catalog" className='container_catalog-img'>
                        {images.map((image: any, index: number) => (
                            <img
                                key={index}
                                src={image ? image.src : ''}
                                alt={`Imagen de ${image ? image.categoria : ''}`}
                                className="catalog-img"
                                onClick={() => addToCanvas(image)}
                            />
                        ))}
                    </div>
                </div>
                {/* <div className="table-container">
                    <table id="size-table">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Ancho (px)</th>
                                <th>Alto (px)</th>
                                <th>Ancho (cm)</th>
                                <th>Alto (cm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id="image-name">N/A</td>
                                <td id="image-width">N/A</td>
                                <td id="image-height">N/A</td>
                                <td id="image-width-cm">N/A</td>
                                <td id="image-height-cm">N/A</td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}
                <Button text='Eliminar imagen' onClick={() => { }} />
            </div>
        </section>
    );
}

export default MakeCollection;