import './style/AsideAccount.scss';
import { Link } from 'react-router-dom';

function AsideAccount (){
    return (
        <aside className="aside-account">
        <div className="mb-4">
            <img src="" alt="" />
            <h4>Julisa Leon Corrales</h4>
        </div>
        <p>Cuenta</p>

        <div className='flex direction-column'>
            <Link to='/miscompras'>Mis compras</Link>
            <Link to='#shade'>Lista de deseos</Link>
            <Link to='#blush'>Cerrar cesion</Link>
        </div>
    </aside>
    )
}
export default AsideAccount;
