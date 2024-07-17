import { useState, useRef } from 'react';
import { Modal, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TextField } from '@mui/material';
import Button from '../components/Button';
import "./style/createSticker.scss";
import { useNavigate } from 'react-router-dom';

function createDataShape(shape: string) {
	return { shape };
}

const rowsShape = [
	createDataShape('Contorno'),
	createDataShape('Cuadrado'),
	createDataShape('Circular'),
	createDataShape('Redondeado'),
];

function createDataSize(size: string) {
	return { size };
}

const rowsSize = [
	createDataSize('2 x 2 cm'),
	createDataSize('3 x 2 cm'),
	createDataSize('3 x 3 cm'),
	createDataSize('4 x 3 cm'),
	createDataSize('4 x 4 cm'),
	createDataSize('5 x 4 cm'),
	createDataSize('personaliza el tamano'),

];

function createDataQuantity(quantity: number | string) {
	return { quantity };
}

const rowsQuantity = [
	createDataQuantity(10),
	createDataQuantity(20),
	createDataQuantity(30),
	createDataQuantity(40),
	createDataQuantity(50),
	createDataQuantity('personaliza la cantidad'),
];

const itemData = [
	{
		img: '../img/HOLOGRAFICO.png',
		title: 'Holographico',
	},
	{
		img: '../img/GLITTER.png',
		title: 'Glitter',
	},
	{
		img: '../img/ORO.png',
		title: 'Oro',
	},
	{
		img: '../img/PLATA.png',
		title: 'Plata',
	}
];

const CustomModal = ({ open, handleClose, title, label, handleSave }: { open: boolean, handleClose: () => void, title: string, label: string, handleSave: () => void }) => (
	<Modal open={open} onClose={handleClose}>
		<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
			<h2>{title}</h2>
			<TextField fullWidth label={label} variant="outlined" />
			<Button className='m-t' onClick={handleSave} variant="text" text="Guardar" />
		</Box>
	</Modal>
);

function CreateStickerPage() {
	const [selectedShape, setSelectedShape] = useState('');
	const [selectedSize, setSelectedSize] = useState('');
	const [selectedQuantity, setSelectedQuantity] = useState('');
	const [selectedMaterial, setSelectedMaterial] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [modalLabel, setModalLabel] = useState('');
	const [customValue, setCustomValue] = useState('');

	const [image, setImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	const handleRowClick = (row: any) => {
		if (row.size === 'personaliza el tamano' || row.quantity === 'personaliza la cantidad') {
			setModalTitle(row.size ? 'Personalizar tamaño' : 'Personalizar Cantidad');
			setModalLabel(row.size ? 'Tamaño' : 'Cantidad');
			setModalOpen(true);
		} else {
			if (row.size) setSelectedSize(row.size);
			if (row.quantity) setSelectedQuantity(row.quantity);
		}
	};
	console.log(setCustomValue);

	const handleModalClose = () => {
		setModalOpen(false);
	};

	const handleSave = () => {
		if (modalTitle.includes('Tamaño')) {
			setSelectedSize(customValue);
		} else {
			setSelectedQuantity(customValue);
		}
		setModalOpen(false);
	};

	const handleMaterialClick = (material: any) => {
		setSelectedMaterial(material.title);
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files ? event.target.files[0] : null;
		if (file && file.type.match('image.*')) {
			const reader = new FileReader();
			reader.onload = () => {
				const imageUrl = reader.result as string;
				setImage(imageUrl);
				navigate('/edit-sticker', {
					state: {
						imageUrl,
						shape: selectedShape,
						size: selectedSize,
						quantity: selectedQuantity,
						material: selectedMaterial,
						image,
					}
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<main className="main bg-color">
			<h1 className="title text-center mb-4">Crea tu propio sticker</h1>
			<div className="flex justify-center gap-2">
				<div className="flex direction-column">
					<h2 className="sub-title">Forma</h2>
					<TableContainer sx={{ width: '160px', height: 'fit-content' }} component={Paper}>
						<Table aria-label="simple table">
							<TableBody>
								{rowsShape.map((row) => (
									<TableRow
										key={row.shape}
										sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedShape === row.shape ? '#E8E8E8' : 'inherit' }}
										onClick={() => setSelectedShape(row.shape)}
									>
										<TableCell component="th" scope="row">{row.shape}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>

				<div className="flex direction-column">
					<h2 className="sub-title">Tamano</h2>
					<TableContainer sx={{ width: '160px', height: 'fit-content' }} component={Paper}>
						<Table aria-label="simple table">
							<TableBody>
								{rowsSize.map((row) => (
									<TableRow
										key={row.size}
										sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedSize === row.size ? '#E8E8E8' : 'inherit' }}
										onClick={() => handleRowClick(row)}
									>
										<TableCell component="th" scope="row">{row.size}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>

				<div className="flex direction-column">
					<h2 className="sub-title">Cantidad</h2>
					<TableContainer sx={{ width: '160px', height: 'fit-content' }} component={Paper}>
						<Table aria-label="simple table">
							<TableBody>
								{rowsQuantity.map((row) => (
									<TableRow
										key={row.quantity}
										sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: selectedQuantity === row.quantity ? '#E8E8E8' : 'inherit' }}
										onClick={() => handleRowClick(row)}
									>
										<TableCell component="th" scope="row">{row.quantity}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
				<CustomModal
					open={modalOpen}
					handleClose={handleModalClose}
					title={modalTitle}
					label={modalLabel}
					handleSave={handleSave}
				/>
				<div>
					<h2 className="sub-title">Material</h2>
					<div className="flex justify-center gap-2">
						<section style={{ width: '290px', flexWrap: 'wrap' }} className="flex">
							{itemData.map((item) => (
								<div key={item.img} onClick={() => handleMaterialClick(item)}>
									<img src={item.img} alt={item.title} className="material-img" />
									<h3 className="text">{item.title}</h3>
								</div>
							))}
						</section>
					</div>
				</div>
			</div>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleImageUpload}
				accept=".png,.jpg"
				style={{ display: "none" }}
			/>
			<Button
				className="text-center mt-h"
				text="Upload"
				onClick={triggerFileInput}
				variant="outlined"
			/>
		</main>
	);
}

export default CreateStickerPage;