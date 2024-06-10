import { useRoutes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import DetailProductPage from './pages/DetailProductPage';
export default function Routes() {
  return useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/shop', element: <ShopPage /> },
    { path: '/detail-product', element: <DetailProductPage />}
  ]);
}
