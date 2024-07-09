import "./../theme.scss";
import { useState } from "react";
import "./style/MakeCollection.scss";
import Canvas from "../components/Canvas";
import ImageCatalog from "../components/ImgCatalog";
import { IconButton } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import GestureIcon from "@mui/icons-material/Gesture";
import GradientIcon from "@mui/icons-material/Gradient";
import Button from "../components/Button";

function MakeCollection() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [color, setColor] = useState<string>("#fff");
  const [gradientColor1, setGradientColor1] = useState<string>("#FF0000");
  const [gradientColor2, setGradientColor2] = useState<string>("#0000FF");
  const [useGradient, setUseGradient] = useState<boolean>(false);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSelectImage = (src: string) => {
    setSelectedImages((prevImages) => [...prevImages, src]);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleGradientColor1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGradientColor1(event.target.value);
  };

  const handleGradientColor2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGradientColor2(event.target.value);
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const activateGradient = () => {
    setUseGradient(true);
  };

  return (
    <main className="main bg-color">
      <h2 className="title text-center">Crea tu colección</h2>
      <section className="container">
        <div className="content-canvas">
          <div className="action-canvas">
            <div className="color-picker-container">
              <IconButton onClick={toggleColorPicker}>
                <ColorLensIcon />
              </IconButton>
              <IconButton>
                <GestureIcon />
              </IconButton>
              <IconButton onClick={activateGradient}>
                <GradientIcon />
              </IconButton>
              {showColorPicker && (
                <div>
                  <label htmlFor="colorPicker"></label>
                  <input
                    type="color"
                    id="colorPicker"
                    value={color}
                    onChange={handleColorChange}
                    disabled={useGradient}
                  />
                </div>
              )}
              {useGradient && (
                <div>
                  <label htmlFor="gradientColor1Picker"></label>
                  <input
                    type="color"
                    id="gradientColor1Picker"
                    value={gradientColor1}
                    onChange={handleGradientColor1Change}
                  />
                  <label htmlFor="gradientColor2Picker"></label>
                  <input
                    type="color"
                    id="gradientColor2Picker"
                    value={gradientColor2}
                    onChange={handleGradientColor2Change}
                  />
                </div>
              )}
            </div>
          </div>
          <Canvas
            color={color}
            gradientColor1={gradientColor1}
            gradientColor2={gradientColor2}
            useGradient={useGradient}
            imageSrcs={selectedImages}
            width={600}
            height={700}
            triggerDownload={triggerDownload}
          />
        </div>
        <div className="flex direction-column justify-between">
          <ImageCatalog onSelectImage={handleSelectImage} />
          <Button
            className="text-center"
            text="Descargar"
            onClick={() => setTriggerDownload((prev) => !prev)}
          />
          <p className="text-center">
            {triggerDownload && "Descargando..."}
          </p>
        </div>
      </section>
    </main>
  );
}

export default MakeCollection;
