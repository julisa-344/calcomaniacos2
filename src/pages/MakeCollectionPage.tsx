import './../theme.scss';
import { useState } from "react";
import "./style/MakeCollection.scss";
import Canvas from "../components/Canvas";
import ImageCatalog from "../components/ImgCatalog";
import { IconButton } from '@mui/material';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import GestureIcon from '@mui/icons-material/Gesture';
import GradientIcon from '@mui/icons-material/Gradient';

function MakeCollection() {

	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [color, setColor] = useState<string>("#00FF00");
	const [gradientColor1, setGradientColor1] = useState<string>("#FF0000");
	const [gradientColor2, setGradientColor2] = useState<string>("#0000FF");
	const [useGradient, setUseGradient] = useState<boolean>(false);

	const handleSelectImage = (src: string) => {
		setSelectedImages((prevImages) => [...prevImages, src]);
	};

	const handleColorChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		setColor((event.target as HTMLInputElement).value);
	};

	const handleGradientColor1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
		setGradientColor1(event.target.value);
	};

	const handleGradientColor2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
		setGradientColor2(event.target.value);
	};

	const handleUseGradientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUseGradient(event.target.checked);
	};

	return (
		<main className="main bg-color">
			<h2 className='title  text-center'>Crea tu colección</h2>
			<section className="container">
				<div className="content-canvas">
					<div className="action-canvas">
						<div className="color-picker-container">
							<IconButton onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleColorChange(event)}>
								<ColorLensIcon />
							</IconButton>
							<IconButton>
								<GestureIcon />
							</IconButton>
							<IconButton>
								<GradientIcon />
							</IconButton>
						</div>

					</div>
					<Canvas
						lineWidth={20}
						color={color}
						gradientColor1={gradientColor1}
						gradientColor2={gradientColor2}
						useGradient={useGradient}
						imageSrcs={selectedImages}
					/>
				</div>
				<ImageCatalog onSelectImage={handleSelectImage} />

				<div>
				</div>
			</section>
		</main>
	);
}

export default MakeCollection;
