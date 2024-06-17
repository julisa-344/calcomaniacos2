import './style/AsideAccount.scss';
import { Link } from 'react-router-dom';

function AsideAccount (){
    return (
        <aside className="aside-account bg-color">
        <div className="mb-4">
            <img src="" alt="" />
            <h4 className='text-center'>Julisa Leon Corrales</h4>
        </div>
            <Link  className='sub-title-sideaccount'to='/account'>Cuenta</Link>
        <div className='flex direction-column'>
            <Link className='text-sideaccount' to='/miscompras'>Mis compras</Link>
            <Link className='text-sideaccount' to='#shade'>Lista de deseos</Link>
            <Link className='text-sideaccount' to='#blush'>Cerrar cesion</Link>
        </div>
    </aside>
    )
}
export default AsideAccount;
