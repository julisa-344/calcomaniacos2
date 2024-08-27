import "./../theme.scss";
import * as React from 'react';
import { useState } from "react";
import "./style/MakeCollection.scss";
import Canvas from "../components/Canvas";
import ImageCatalog from "../components/ImgCatalog";
import { TableContainer, Table, TableBody, TableRow, TableCell, Paper, Box } from '@mui/material';
import Button from "../components/Button";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CropPortraitIcon from '@mui/icons-material/CropPortrait';
import ImageIcon from '@mui/icons-material/Image';

function MakeCollection() {
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [selectedImageName, setSelectedImageName] = useState<string>('');
	const [color, setColor] = useState('#0000');
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [triggerDownload, setTriggerDownload] = useState(false);
	const [selectedView, setSelectedView] = useState('canvas');
	const [value, setValue] = React.useState(0);
	const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

	// console.log(triggerDownload, "triggerDownload");
	function createData(detalle: string, valor: string) {
		return { detalle, valor };
	}

	const handleSelectImage = (src: string, name: string) => {
		setSelectedImages((prevImages) => [...prevImages, src]);
		setSelectedImageName(name);
	};

	const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setColor(event.target.value);
	};

	const toggleColorPicker = () => {
		setShowColorPicker(!showColorPicker);
	};


	const handleImageResize = (width: number, height: number) => {
		setImageDimensions({ width, height });
	};

	const rows = [
		createData('Nombre', selectedImageName),
		createData('Tamaño', `${imageDimensions.width.toFixed(2)} cm x ${imageDimensions.height.toFixed(2)} cm`),
	];

	return (
		<main className="main bg-color">
			<h2 className="title mb-4 text-center">Crea tu colección</h2>
			<section className="container">
				<div className={`content-canvas ${selectedView === 'canvas' ? 'show' : 'hide'}`}>
					<div className="">
				
					</div>
					<Canvas
						color={color}
						imageSrcs={selectedImages}
						width={500}
						height={700}
						triggerDownload={triggerDownload}
						onResize={handleImageResize}
					/>
				</div>
				<div className={`container-catalog flex direction-column justify-between ${selectedView === 'catalog' ? 'show' : 'hide'}`}>
					<ImageCatalog onSelectImage={handleSelectImage} />
				</div>
				<div className="aside-detail_sticker">
					<div>
						<h2 className="">Detalles</h2>
						<TableContainer sx={{ Width: "fit-content" }} component={Paper}>
							<Table aria-label="simple table">
								<TableBody>
									{rows.map((row) => (
										<TableRow
											key={row.detalle}
											sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{row.detalle}
											</TableCell>
											<TableCell align="right">{row.valor}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
					<Button
						className="text-center"
						text="Descargar"
						onClick={() => setTriggerDownload(true)}
					/>
				</div>
			</section>
			<Button
				className="text-center btn-mobile"
				text="Descargar"
				onClick={() => setTriggerDownload(true)}
			/>

			<Box className="bottom-bar" sx={{ width: "100%" }}>
				<BottomNavigation
					showLabels
					value={value}
					onChange={(event, newValue) => {
						setValue(newValue);
					}}
				>
					<BottomNavigationAction
						label="Canva"
						icon={<CropPortraitIcon />}
						onClick={() => setSelectedView('canvas')}
					/>
					<BottomNavigationAction
						label="Catalogo"
						icon={<ImageIcon />}
						onClick={() => setSelectedView('catalog')}
					/>
				</BottomNavigation>
			</Box>
		</main>
	);
}

export default MakeCollection;
