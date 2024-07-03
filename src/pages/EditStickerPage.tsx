import { useLocation } from 'react-router-dom';
import { useState } from "react";

import "./style/EditSticker.scss";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '../components/Button';
import { IconButton } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import GestureIcon from '@mui/icons-material/Gesture';
import GradientIcon from '@mui/icons-material/Gradient';
import Canvas from "../components/Canvas";

import "./style/EditSticker.scss";

function createData(
	acabado: string,
	valor: string
) {
	return { acabado, valor };
}

const rows = [
	createData('Acabado', 'Vinil'),
	createData('Ancho', '25 cm'),
	createData('Alto', '5 cm'),
	createData('Precio Final', '20 soles')
];

function EditStickerPage() {
	const location = useLocation();
	const imageUrl = location.state?.imageUrl;

	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [color, setColor] = useState<string>("#00FF00");
	const [gradientColor1, setGradientColor1] = useState<string>("#FF0000");
	const [gradientColor2, setGradientColor2] = useState<string>("#0000FF");
	const [useGradient, setUseGradient] = useState<boolean>(false);


	return (
		<main className="main bg-color">
			<h1 className="title text-center">Edita tu Sticker</h1>
			<section className='flex'>
				<section>
				<Canvas
						lineWidth={20}
						color={color}
						gradientColor1={gradientColor1}
						gradientColor2={gradientColor2}
						useGradient={useGradient}
						imageSrcs={selectedImages}
					/>
					<div>
						{imageUrl && <img className='image-edit' src={imageUrl} alt="Selected" />}
					</div>
				</section>
				<section className='aside-detail_sticker'>
					<div className='subir-img'>
						<FileUploadOutlinedIcon />
						<p>.png .jpg</p>
						<Button className='text-end' text='Subir' onClick={() => { }}  />

					</div>
					<h2 className='sub-title'>Detalles</h2>
					<div>
						<TableContainer sx={{ Width: 'fit-content' }} component={Paper}>
							<Table aria-label="simple table">
								<TableBody>
									{rows.map((row) => (
										<TableRow
											key={row.acabado}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{row.acabado}
											</TableCell>
											<TableCell align="right">{row.valor}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				</section>
				<section>
				<div className="action-canvas">
						<div className="color-picker-container">
							<IconButton >
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
				</section>
			</section>

		</main>
	);
}

export default EditStickerPage;