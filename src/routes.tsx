import { useRoutes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import DetailProductPage from './pages/DetailProductPage';
import AccountPage from './pages/AccountPage';
import MisCompras from './pages/MisComprasPage';
import MakeCollection from './pages/MakeCollectionPage';
import CartPage from './pages/CartPage';
import Login from './components/Login';

export default function Routes() {
  return useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/login', element: <Login />},
    { path: '/shop', element: <ShopPage /> },
    { path: '/make-collection', element: <MakeCollection />},
    { path: '/detail-product', element: <DetailProductPage />},
    { path: '/account', element: <AccountPage />},
    { path: '/miscompras', element: <MisCompras />},
    { path: '/cart', element: <CartPage />}
  ]);
}
