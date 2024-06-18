import './style/Header.scss';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartContext } from '../CartContext';
import { useAuth } from '../AuthContext';

function Header() {
  const { cart } = useContext(CartContext);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('Header - user:', user, 'loading:', loading);

  const handleAccountClick = () => {
    if (loading) {
      console.log('Header - still loading');
      return;
    }
    if (user) {
      console.log('Header - navigating to /account');
      navigate('/account');
    } else {
      console.log('Header - navigating to /login');
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="flex align-center">
        <h2 className="header-title">Calcomaniacos</h2>
      </div>
      <div>
        <Link to='/' className='link-header'>Home</Link>
        <Link to='/shop' className='link-header'>Shop</Link>
        <Link to='/make-collection' className='link-header'>Crea tu coleccion</Link>
      </div>
      <nav className="header-nav">
        <Link to='/cart' aria-label='Cart'>
          <IconButton style={{ color: 'white' }} className='cart'>
            <ShoppingCartIcon />
            {cart.length > 0 && <p className="count">{cart.length}</p>}
          </IconButton>
        </Link>
        <IconButton
          style={{ color: 'white' }}
          aria-label='Account'
          onClick={handleAccountClick}
        >
          <PersonIcon />
        </IconButton>
      </nav>
    </header>
  );
}

export default Header;