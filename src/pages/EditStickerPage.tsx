import { useLocation } from 'react-router-dom';
import { useState, useRef } from "react";

import "./style/EditSticker.scss";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '../components/Button';
import { IconButton } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import GestureIcon from '@mui/icons-material/Gesture';
import CropOutlinedIcon from '@mui/icons-material/CropOutlined';
import Canvas from "../components/Canvas";

import "./style/EditSticker.scss";

function EditStickerPage() {
  const location = useLocation();
  const initialImageUrl = location.state?.imageUrl;
  const size = location.state?.size;
  const quantity = location.state?.quantity;
  const acabado = location.state?.material;
  const forma = location.state?.shape;
  const [color] = useState<string>("#FFF");
  const [gradientColor1] = useState<string>("#FF0000");
  const [gradientColor2] = useState<string>("#0000FF");
  const [useGradient] = useState<boolean>(false);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(initialImageUrl);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  function createData(
    detalle: string,
    valor: string
  ) {
    return { detalle, valor };
  }

  const rows = [
    createData('Acabado', acabado),
    createData('Tamano', size),
    createData('Cantidad', quantity),
    createData('Forma', forma),
    createData('Precio Final', '20 soles')
  ];

  return (
    <main className="main bg-color">
      <h1 className="title text-center">Edita tu Sticker</h1>
      <section className="flex justify-between container">
        <section className="flex">
          <Canvas
            color={color}
            gradientColor1={gradientColor1}
            gradientColor2={gradientColor2}
            useGradient={useGradient}
            imageSrcs={image ? [image] : []}
            width={1000}
            height={700}
            maxImageWidth={300}
            triggerDownload={triggerDownload}
          />
          <div className="action-canvas ml-4">
            <div className="color-picker-container">
              <IconButton>
                <ColorLensIcon />
              </IconButton>
              <IconButton>
                <GestureIcon />
              </IconButton>
              <IconButton>
                <CropOutlinedIcon />
              </IconButton>
            </div>
          </div>
        </section>
        <section className="aside-detail_sticker">
          <div className="subir-img">
            <FileUploadOutlinedIcon />
            <p>.png .jpg</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept=".png,.jpg"
              style={{ display: "none" }}
            />
            <Button className="text-end" text="Subir" onClick={triggerFileInput} />
          </div>
          <div className="">
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
            <Button
              className="text-center m-t"
              text="Comprar"
              onClick={() => setTriggerDownload((prev) => !prev)}
            />
          </div>
        </section>
      </section>
    </main>
  );
}

export default EditStickerPage;