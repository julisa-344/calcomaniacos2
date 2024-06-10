import "./style/shopPage.scss";
import "../theme.scss";
import Card from "../components/CardComponent";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";

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

  return (
    <>
          <section className="p-4 contend-header">
        <section className="gallery-content">
          <aside>
            <h2 className="title">Filtros</h2>
            <p className="sub-title">Por categoría</p>
            <div className="content-category"> 
            {/* Search for categoruy */}
              {categories.map((category) => (
                <label key={category}>
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={(e) =>
                      handleCategoryChange(category, e.target.checked)
                    } />
                  {category}
                </label>
              ))}
            </div>
            <p className="sub-title">Por marca</p>
            <div className="content-category">
              {/* Search for brand */}
                {brands.map((brand) => (
                    <label key={brand}>
                    <Checkbox
                        touch-target="wrapper"
                        onChange={(e) => handleBrandChange(brand, e.target.checked)}
                    />
                    {brand}
                    </label>
                ))}
              
            </div>
          </aside>
          <section className="contet-products">
            <div className="flex justify-between align-center mb-4">
              {/* <md-outlined-text-field placeholder="Search for messages">
                <md-icon slot="leading-icon">search</md-icon>
              </md-outlined-text-field> */}
              <div className="input-search">
              <input
                className="input-transparent"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon />
              </div>
              <div className="flex align-center">
                <span className="sub-title p-4">Ordenar por:</span>
                <select className="p-2">
                  <option>Menor precio</option>
                  <option>Mayor precio</option>
                </select>
                </div>
            </div>
            <div className="content-card">
              {filteredProducts.map((product: Product) => (
                <Card
                  key={product.id}
                  title={product.name}
                  price={product.price.toString()}
                  img={product.img}
                  // falta hacer el fix de la imagen
                />
              ))}
            </div>
          </section>
        </section>
      </section>
    </>
  );
}
export default ShopPage;