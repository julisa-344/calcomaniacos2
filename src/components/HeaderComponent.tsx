import './style/Header.scss';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="header">
            <div className="flex align-center">
                <h2 className="header-title">Calcomaniacos</h2>
            </div>
            <nav className="header-nav">
                <ul>
                    <li><Link to='#'>Crear tu colección</Link></li>
                    <li><Link to='/shop'>Comprar stickers</Link></li>
                    <li><Link to='#'>Galeria</Link></li>
                    <li><Link to='#'>Contacto</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
