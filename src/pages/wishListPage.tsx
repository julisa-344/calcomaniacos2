// WishListPage.tsx
import React, { useState, useEffect } from 'react';
import Card from '../components/CardComponent';
import { getFavorites, getProductDetails } from '../firebaseFunctions';
import { Product } from '../types';

const WishListPage: React.FC = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const favorites = await getFavorites();
      const products: Product[] = [];

      for (const fav of favorites) {
        const productDetails = await getProductDetails(fav.productId);
        if (productDetails) {
          products.push({
            id: fav.productId,
            name: productDetails.name,
            price: productDetails.price,
            img: productDetails.img,
            description: productDetails.description,
            acabado: productDetails.acabado
          });
        } else {
          console.error(`Product details not found for ID: ${fav.productId}`);
        }
      }

      setFavoriteProducts(products);
    };

    fetchFavorites();
  }, []);

  return (
    <main className='main bg-color'>
      <h1 className='title text-center'>Lista de deseos</h1>
      <div className="content-card">
        {favoriteProducts.map((product: Product) => (
          <Card
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </main>

  );
};

export default WishListPage;
