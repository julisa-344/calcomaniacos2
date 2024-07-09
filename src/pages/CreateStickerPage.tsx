import { useState, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '../components/Button';
import "./style/createSticker.scss";
import { useNavigate } from 'react-router-dom';


function createDataShape(
	shape: string,
) {
	return { shape };
}

const rowsShape = [
	createDataShape('Contorno'),
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
	createDataSize('2 x 2 cm'),
	createDataSize('3 x 2 cm'),
	createDataSize('3 x 3 cm'),
	createDataSize('4 x 3 cm'),
	createDataSize('4 x 4 cm'),
	createDataSize('5 x 4 cm'),
	createDataSize('personaliza el tamano'),

];

function createDataQuantity(
	quantity: number | string,
) {
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
		title: 'Vinil',
	},
	{
		img: '../img/ORO.png',
		title: 'Vinil Matte',
	},
	{
		img: '../img/PLATA.png',
		title: 'Transparente',
	}
];

function CreateStickerPage() {
	const navigate = useNavigate();
	
	const [selectedRow, setSelectedRow] = useState<string | null>(null);

	// Estado para almacenar la imagen cargada
	const [image, setImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	
	// Función para manejar la carga de la imagen
	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files ? event.target.files[0] : null;
		if (file && file.type.match('image.*')) {
		  const reader = new FileReader();
		  reader.onload = () => {
			const imageUrl = reader.result as string;
			console.log('imageUrl', imageUrl? 'si hay imagen': 'no hay imagen');
			setImage(imageUrl);
			console.log("image", image);
			navigate('/edit-sticker', { state: { imageUrl } });
		  };
		  reader.readAsDataURL(file);
		}
	  };

	const triggerFileInput = () => {
		console.log('clickTrigger');
		fileInputRef.current?.click();
	};


	return (
    <main className="main bg-color">
      <h1 className="title text-center mb-4">Crea tu propio sticker</h1>
      <div className="flex justify-center gap-2">
        <div className="flex direction-column">
          <h2 className="sub-title">Forma</h2>
          <TableContainer
            sx={{ width: "160px", height: "fit-content" }}
            component={Paper}
          >
            <Table aria-label="simple table">
              <TableBody>
                {rowsShape.map((row) => (
                  <TableRow
                    key={row.shape}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      backgroundColor:
                        selectedRow === row.shape ? "#E8E8E8" : "inherit",
                    }}
                    onClick={() => setSelectedRow(row.shape)}
                  >
                    <TableCell component="th" scope="row">
                      {row.shape}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="flex direction-column">
          <h2 className="sub-title">Tamano</h2>
          <TableContainer
            sx={{ width: "160px", height: "fit-content" }}
            component={Paper}
          >
            <Table sx={{ minWidth: 100 }} aria-label="simple table">
              <TableBody>
                {rowsSize.map((row) => (
                  <TableRow
                    key={row.size}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      backgroundColor:
                        selectedRow === row.size ? "#E8E8E8" : "inherit",
                    }}
                    onClick={() => setSelectedRow(row.size)}
                  >
                    <TableCell component="th" scope="row">
                      {row.size}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="flex direction-column">
          <h2 className="sub-title">Cantidad</h2>
          <TableContainer
            sx={{ width: "160px", height: "fit-content" }}
            component={Paper}
          >
            <Table aria-label="simple table">
              <TableBody>
                {rowsQuantity.map((row) => (
                  <TableRow
                    key={row.quantity}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div>
          <h2 className="sub-title">Material</h2>
          <div className="flex justify-center gap-2">
            <section
              style={{ width: "290px", flexWrap: "wrap" }}
              className="flex"
            >
              {itemData.map((item) => (
                <div key={item.img}>
                  <img
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    alt={item.title}
                    className="material-img"
                  />
                  <h3 className="text">{item.title}</h3>
                </div>
              ))}
            </section>
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
          className="text-end"
          text="Upload"
          onClick={triggerFileInput}
          variant="outlined"
        />
      </div>
    </main>
  );
}

export default CreateStickerPage;