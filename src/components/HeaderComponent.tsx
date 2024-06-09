import './style/Header.scss';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="header">
            <div className="flex align-center">
                <h2 className="header-title">Calcomaniacos</h2>
            </div>
            <nav className="header-nav">
                <Link className='link-title' to="/">Crear tu colección</Link>
                <Link className='link-title' to="/shop">Shop</Link>
                <Link className='link-title' to="/about">Mi cuenta</Link>
            </nav>
        </header>
    );
}

export default Header;
