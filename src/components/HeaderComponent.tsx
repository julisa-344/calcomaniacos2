import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, AppBar, Toolbar, Drawer, List, ListItem, ListItemText, Badge, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import './style/Header.scss';

import { useAuth } from '../AuthContext';
import { CartContext } from '../CartContext';

const Header: React.FC = () => {
  const { cart } = useContext(CartContext);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAccountClick = () => {
    if (loading) {
      console.log('Header - still loading');
      return;
    }
    if (user) {
      navigate('/account');
    } else {
      navigate('/login');
    }
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = () => (
    <List>
      <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
        <ListItemText primary="Home" />
      </ListItem>
      {/* <ListItem button component={Link} to="/shop" onClick={toggleDrawer(false)}>
        <ListItemText primary="Shop" />
      </ListItem> */}
      <ListItem button component={Link} to="/make-collection" onClick={toggleDrawer(false)}>
        <ListItemText primary="Crea tu colección" />
      </ListItem>
      {/* <ListItem button component={Link} to="/create-sticker" onClick={toggleDrawer(false)}>
        <ListItemText primary="Crea tu sticker" />
      </ListItem> */}
    </List>
  );

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'rgb(122, 17, 249)' }} className='header'>
      <Toolbar className='header-contend'>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            className="menu-button"
          >
            <MenuIcon />
          </IconButton>
        )}
        <img className='logo' src="/CALCOMANIACOS.png" alt="logo" />
        <div className="nav-links w-300">
          {!isMobile && (
            <div>
              <Link to="/" className="link-header">Home</Link>
              {/* <Link to="/shop" className="link-header">Shop</Link> */}
              <Link to="/make-collection" className="link-header">Crea tu colección</Link>
              {/* <Link to="/create-sticker" className="link-header">Crea tu sticker</Link> */}
            </div>
          )}
        </div>
        <div className="header-nav ">
          <IconButton component={Link} to="/cart" color="inherit" aria-label="Cart">
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" aria-label="Account" onClick={handleAccountClick}>
            <PersonIcon />
          </IconButton>
        </div>
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList()}
      </Drawer>
    </AppBar>
  );
}

export default Header;