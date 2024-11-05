/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { SelectChangeEvent } from "@mui/material";
import { Checkbox, ListItemText } from "@mui/material"; // Importamos Checkbox y ListItemText

import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { firestore, auth } from "../firebase-config";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ImageData {
  id: string;
  name: string;
  src: string;
  visualizeUrl?: string;
  imageSrc?: string;
  category: string;
  subcategory: string;
  subCategory?: string;
  tags: string[];
}

interface ImageCatalogProps {
  onSelectImage: (src: string, name: string) => void;
}

const ImageCatalog: React.FC<ImageCatalogProps> = ({ onSelectImage }) => {
  const [images, setImages] = useState<ImageData[]>([]);

  const [categorias, setCategorias] = useState<string[]>([]);
  const [subcategorias, setSubcategorias] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedSubcategorias, setSelectedSubcategorias] = useState<{
    [key: string]: string[];
  }>({});

  const handleChangeSubcategoria =
    (category: string) => (event: SelectChangeEvent<string[]>) => {
      const { value } = event.target;

      // Aseguramos que se actualice correctamente el estado con las subcategorías seleccionadas
      const newSelected = typeof value === "string" ? value.split(",") : value;

      setSelectedSubcategorias((prev) => ({
        ...prev,
        [category]: newSelected,
      }));
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "stickers"));
        const data: ImageData[] = querySnapshot.docs.map(
          (doc: QueryDocumentSnapshot): ImageData => ({
            id: doc.id,
            name: doc.data().name,
            src: doc.data().visualizeUrl || doc.data().imageSrc,
            category: doc.data().category,
            subcategory: doc.data().subcategory,
            subCategory: doc.data().subCategory,
            tags: doc.data().tags,
          })
        );

        const categoriasSet = new Set<string>();
        const subcategoriasMap: { [key: string]: string[] } = {};

        data.forEach((image: ImageData) => {
          categoriasSet.add(image.category);
          if (!subcategoriasMap[image.category]) {
            subcategoriasMap[image.category] = [];
          }
          if (!subcategoriasMap[image.category].includes(image.subcategory)) {
            subcategoriasMap[image.category].push(image.subcategory);
          }
        });

        setCategorias(Array.from(categoriasSet));
        setSubcategorias(subcategoriasMap);
        setImages(data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const filteredImages = images.filter((image) => {
    const selectedForCategory = selectedSubcategorias[image.category] || [];

    // Mostrar todas las imágenes si no hay ninguna subcategoría seleccionada para esta categoría
    // if (selectedForCategory.length === 0) return true;

    // Filtrar solo las imágenes que coincidan con alguna subcategoría seleccionada
    return selectedForCategory.includes(image.subcategory);
  });

  const handleImageClick = (image: ImageData) => {
    onSelectImage(image.imageSrc ? image.imageSrc : image.src, image.name);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    draggable: true,
    nextArrow: <div className="custom-next">→</div>,  // Icono personalizado para el botón "next"
    prevArrow: <div className="custom-prev">←</div>,  // Icono personalizado para el botón "prev"
  };

  return (
    <>
      <div className="slider-container">
        <Slider {...settings} className="contend-slider">
          {categorias.map((category) => (
            <div key={category}>
              <FormControl
                sx={{
                  m: 1,
                  width: "180px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "gray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "gray",
                    },
                  },
                }}
              >
                <InputLabel id={`${category}-label`} sx={{ color: "white" }}>
                  {category}
                </InputLabel>
                <Select
                  labelId={`${category}-label`}
                  multiple
                  value={selectedSubcategorias[category] || []}
                  onChange={handleChangeSubcategoria(category)}
                  input={
                    <OutlinedInput
                      id={`${category}-select`}
                      label="Subcategoría"
                    />
                  }
                  renderValue={(selected) => selected.join(", ")}
                >
                  {subcategorias[category].map((subcategoria) => (
                    <MenuItem key={subcategoria} value={subcategoria}>
                      <Checkbox
                        checked={(
                          selectedSubcategorias[category] || []
                        ).includes(subcategoria)}
                      />
                      <ListItemText primary={subcategoria} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ))}
        </Slider>
        <div className="fade-effect"></div>
      </div>
      <div id="catalog" className="container_catalog-img">
        {filteredImages.map((image) => (
          <img
            key={image.id}
            src={image.src || image.imageSrc || ""}
            alt={`Imagen de ${image.category}`}
            className="catalog-img"
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
    </>
  );
};
export default ImageCatalog;
