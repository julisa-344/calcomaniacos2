import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ShopPage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;