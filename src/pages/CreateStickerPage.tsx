import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '../components/Button';

function createDataShape(
	shape: string,
) {
	return { shape };
}

const rowsShape = [
	createDataShape('Cuadrado'),
	createDataShape('Circular'),
	createDataShape('Redondeado'),
];

function createDataSize(
	size: string,
) {
	return { size };
}

const rowsSize = [
	createDataSize('Cuadrado'),
	createDataSize('Circular'),
	createDataSize('Redondeado'),
];

function createDataQuantity(
	quantity: string,
) {
	return { quantity };
}

const rowsQuantity = [
	createDataQuantity('Cuadrado'),
	createDataQuantity('Circular'),
	createDataQuantity('Redondeado'),
];


const itemData = [
	{
	  img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
	  title: 'Breakfast',
	  author: '@bkristastucchio',
	},
	{
	  img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
	  title: 'Burger',
	  author: '@rollelflex_graphy726',
	},
	{
	  img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
	  title: 'Camera',
	  author: '@helloimnik',
	},
	{
	  img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
	  title: 'Coffee',
	  author: '@nolanissac',
	}
  ];

function CreateStickerPage() {
	return (
		<main className="main bg-color">
			<h1 className="title text-center">Crea tu propio sticker</h1>
			<div className='flex justify-between'>
				<TableContainer sx={{ width: '130px', height: 'fit-content' }} component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Forma</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rowsShape.map((row) => (
								<TableRow
									key={row.shape}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell component="th" scope="row">
										{row.shape}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<TableContainer sx={{ width: '130px', height: 'fit-content' }} component={Paper}>
					<Table sx={{ minWidth: 100 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Tamano</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rowsSize.map((row) => (
								<TableRow
									key={row.size}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell component="th" scope="row">
										{row.size}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<TableContainer sx={{ maxWidth: 300, height: 'fit-content'  }} component={Paper}>
					<Table  aria-label="caption table">
						<caption>A basic table example with a caption</caption>
						<TableHead>
							<TableRow>
								<TableCell>Cantidad</TableCell>
								<TableCell align="right">Precio</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rowsQuantity.map((row) => (
								<TableRow key={row.quantity}>
									<TableCell component="th" scope="row">
										{row.quantity}
									</TableCell>
									<TableCell align="right">{row.quantity}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<ImageList sx={{ width: 500, height: 450 }}>
					{itemData.map((item) => (
						<ImageListItem key={item.img}>
							<img
								srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
								src={`${item.img}?w=248&fit=crop&auto=format`}
								alt={item.title}
								loading="lazy"
							/>
							<ImageListItemBar
								title={item.title}
								subtitle={<span>by: {item.author}</span>}
								position="below"
							/>
						</ImageListItem>
					))}
				</ImageList>
			</div>
			<Button text='Upload' onClick={() => { }} variant='outlined' />

		</main>
	);
}

export default CreateStickerPage;