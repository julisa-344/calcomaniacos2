import "./../theme.scss";
import * as React from "react";
import { useState, useCallback } from "react";
import "./style/MakeCollection.scss";
import Canvas from "../components/Canvas";
import ImageCatalog from "../components/ImgCatalog";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import Button from "../components/Button";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import CropPortraitIcon from "@mui/icons-material/CropPortrait";
import ImageIcon from "@mui/icons-material/Image";
import AIStickerModal from "../components/AIStickerModal";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

function createData(detalle: React.ReactNode, valor: React.ReactNode) {
  return { detalle, valor };
}

function MakeCollection() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const [selectedView, setSelectedView] = useState("canvas");
  const [value, setValue] = React.useState(0);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [selectedType, setSelectedType] = useState("trasferible");
  const [addTextToCanvas, setAddTextToCanvas] = useState<((fn: () => void) => void) | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  console.log(selectedView)

  const handleDownloadComplete = useCallback(() => {
    setTriggerDownload(false);
  }, []);

  const handleSelectImage = (src: string, name: string) => {
    setSelectedImages((prevImages) => [...prevImages, src]);
  };

  const handleImageResize = useCallback((width: number, height: number) => {
    setImageDimensions({ width, height });
  }, []);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType((event.target as HTMLInputElement).value);
  };

  const handleAIImageGenerated = (imageUrl: string) => {
    setSelectedImages((prevImages) => [...prevImages, imageUrl]);
  };

  const rows = [
    createData(
      <Box sx={{ fontSize: "16px", textAlign: "start", marginBottom: "-23px" }}>Elige el tipo de material</Box>,
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="tipo"
          name="tipo"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <FormControlLabel
            value="trasferible"
            control={
              <Radio
                sx={{ color: "#150C3E", "&.Mui-checked": { color: "#150C3E" } }}
              />
            }
            label="Trasferible"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                textAlign: "start",
              },
            }}
          />{" "}
          <FormControlLabel
            value="vinil"
            control={
              <Radio
                sx={{ color: "#150C3E", "&.Mui-checked": { color: "#150C3E" } }}
              />
            }
            label="Vinil"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                textAlign: "start",
              },
            }}
          />
          <FormControlLabel
            value="vinil hologràfico"
            control={
              <Radio
                sx={{ color: "#150C3E", "&.Mui-checked": { color: "#150C3E" } }}
              />
            }
            label="Vinil Hologràfico"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                textAlign: "start",
              },
            }}
          />
          <FormControlLabel
            value="tatto"
            control={
              <Radio
                sx={{ color: "#150C3E", "&.Mui-checked": { color: "#150C3E" } }}
              />
            }
            label="Tatto"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                textAlign: "start",
              },
            }}
          />
          <FormControlLabel
            value="tatto fotoluminiscente"
            control={
              <Radio
                sx={{ color: "#150C3E", "&.Mui-checked": { color: "#150C3E" } }}
              />
            }
            label="Tatto Fotoluminiscente"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
                textAlign: "start",
              },
            }}
          />
        </RadioGroup>
      </FormControl>
    ),
    createData(
      <Box sx={{ fontSize: "16px", textAlign: "start", marginBottom: "-23px" }}>Tamaño</Box>,
      <Box sx={{ fontSize: "14px", textAlign: "start" }}>
        Ancho: {imageDimensions.width.toFixed(1)} cm <br />
        Alto: {imageDimensions.height.toFixed(1)} cm
      </Box>
    ),
  ];

  return (
    <main className="main bg-color">
      <h2 className="title mb-4 text-center">Crea tu canvas</h2>
      <section className="container">
        <div
        // className={`content-canvas ${
        //   selectedView === "canvas" ? "show" : "hide"
        // }`}
        >
          <Canvas
            imageSrcs={selectedImages}
            width={1681}
            height={2362}
            triggerDownload={triggerDownload}
            onResize={handleImageResize}
            onDownloadComplete={handleDownloadComplete}
            onAddText={(fn) => setAddTextToCanvas(() => fn)} // Ahora es type-safe
            acabado={selectedType}
          />
          <div className="flex justify-between m-t">
            <Button
              className="btn"
              text="Remover fondo"
              onClick={() =>
                window.open("https://app.photoroom.com/create", "_blank")
              }
            />
            <Button
              className="btn"
              text="Generar con IA"
              onClick={() => setAiModalOpen(true)}
            />
            <Button
              className="btn"
              text="Agregar texto" 
              onClick={() => addTextToCanvas && addTextToCanvas(() => {})}
            />
          </div>

        </div>
        
        {/* AI Sticker Generator Modal */}
        <AIStickerModal
          open={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          onImageGenerated={handleAIImageGenerated}
        />
        
        <div className="containier_imageCatalog">
          <ImageCatalog onSelectImage={handleSelectImage} />
        </div>
        <div className="aside-detail_sticker">
          <div>
            <h2 className="">Detalles</h2>
            <TableContainer
              sx={{ Width: "fit-content", overflowX: "hidden" }}
              component={Paper}
            >
              <Table aria-label="simple table">
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        th: { border: 0 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ width: "100%" }}
                      >
                        {row.detalle}
                      </TableCell>
                      <TableCell align="left" sx={{ width: "100%" }}>
                        {row.valor}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Button
            className="text-center"
            text="Agregar al carrito"
            onClick={() => setTriggerDownload(true)}
          />
        </div>
      </section>
      <Button
        className="text-center btn-mobile"
        text="Agregar al carrito"
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
            onClick={() => setSelectedView("canvas")}
          />
          <BottomNavigationAction
            label="Catalogo"
            icon={<ImageIcon />}
            onClick={() => setSelectedView("catalog")}
          />
          <BottomNavigationAction
            label="AI Sticker"
            icon={<AutoFixHighIcon />}
            onClick={() => setAiModalOpen(true)}
          />
        </BottomNavigation>
      </Box>
    </main>
  );
}

export default MakeCollection;
