import { useRoutes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';

export default function Routes() {
  return useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/shop', element: <ShopPage /> },
  ]);
}
