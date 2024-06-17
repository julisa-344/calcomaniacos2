import './style/Header.scss';
import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartContext } from '../CartContext';

function Header() {
	const { cart } = useContext(CartContext);

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
				<Link to='/account' aria-label='Login'>
					<IconButton style={{ color: 'white' }}>
						<PersonIcon />
					</IconButton>
				</Link>
			</nav>
		</header>
	);
}

export default Header;
