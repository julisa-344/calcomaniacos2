import './style/Header.scss';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function Header() {
    return (
        <header className="header">
            <div className="flex align-center">
                <h2 className="header-title">Calcomaniacos</h2>
            </div>
            <nav className="header-nav">
                <Link to='/' aria-label='Home'>
                <IconButton style={{ color: 'white' }}>
                        <HomeIcon />
                    </IconButton>
                </Link>
                <Link to='/shop' aria-label='Cart'>
                <IconButton style={{ color: 'white' }}>
                        <ShoppingCartIcon />
                    </IconButton>
                </Link>
                <Link to='/LoginSignup' aria-label='Login'>
                <IconButton style={{ color: 'white' }}>
                        <PersonIcon />
                    </IconButton>
                </Link>
            </nav>
        </header>
    );
}

export default Header;
