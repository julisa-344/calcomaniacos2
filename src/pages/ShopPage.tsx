import * as React from 'react';
import "./style/shopPage.scss";
import "../theme.scss";
import Card from "../components/CardComponent";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import { IconButton } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Product {
  id: string;
  name: string;
  price: number;
  img: string;
  category: string;
  brand: string;
}

function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  /*
  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const data = await db.collection("beautyProducts").get();
      setProducts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []); */

  //   as we currently do not have the firebase database, we will use a mock data (data.json) to simulate the data

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch("productsdata.json");
      const products = await data.json();
      setProducts(products);
    };
    // The data.json file is located in the public folder
    fetchData();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.length === 0 ||
        selectedCategories.includes(product.category)) &&
      (selectedBrands.length === 0 || selectedBrands.includes(product.brand))
  );

  const handleCategoryChange = (category: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  const handleBrandChange = (brand: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedBrands((prev) => [...prev, brand]);
    } else {
      setSelectedBrands((prev) => prev.filter((b) => b !== brand));
    }
  };

  const categories = products
    .map((product) => product.category)
    .filter((value, index, self) => self.indexOf(value) === index);

  const brands = products
    .map((product) => product.brand)
    .filter((value, index, self) => self.indexOf(value) === index);

    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
      setAge(event.target.value);
    };

  return (
    <>
      <main className="bg-color">
        <section>
          <h2>          Descubre los mejores stickers para tu laptop, celular, tablet y más.
          </h2>
          <img src="" alt="" />
        </section>
        <section className="p-4">
          <section className="gallery-content">
            <aside>
              <h2 className="title">Filtros</h2>
              <p className="sub-title">Por categoría</p>
              <div className="content-category">
                {/* Search for categoruy */}
                {categories.map((category) => (
                  <label className="text" key={category}>
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      color="default"
                      onChange={(e) =>
                        handleCategoryChange(category, e.target.checked)
                      } />
                      
                    {category}
                  </label>
                ))}
              </div>
            </aside>
            <section className="contet-products">
              <div className="flex justify-between align-center mb-4">
                <Box sx={{ width: '100%',maxWidth: '100%',}} >
                  <FormControl variant="outlined">
                  <OutlinedInput
                      style={{ borderColor: 'white', color: 'white' }}
                      id="outlined-adornment-password"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            style={{ color: 'white' }}
                            edge="end"
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Buscar"
                    />
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Ordenar por:</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={age}
                      label="Age"
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Relevancia</MenuItem>
                      <MenuItem value={20}>Menor precio</MenuItem>
                      <MenuItem value={30}>Mayor precio</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div className="content-card">
                {filteredProducts.map((product: Product) => (
                  <Card
                    key={product.id}
                    name={product.name}
                    price={product.price.toString()}
                    img={product.img}
                  />
                ))}
              </div>
            </section>
          </section>
        </section>
      </main>
    </>
  );
}
export default ShopPage;