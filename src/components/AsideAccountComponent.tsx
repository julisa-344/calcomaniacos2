import React from 'react';
import './style/AsideAccount.scss';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase-config';

function AsideAccount() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <aside className="aside-account bg-color">
            <div className="mb-4">
                <img src={user?.photoURL || 'path/to/default/image.jpg'} alt="User" />
                <h4 className='text-center'>{user ? user.displayName : 'Usuario'}</h4>
            </div>
            <Link className='sub-title-sideaccount' to='/account'>Cuenta</Link>
            <div className='flex direction-column'>
                <Link className='text-sideaccount' to='/miscompras'>Mis compras</Link>
                <Link className='text-sideaccount' to='#wishlist'>Lista de deseos</Link>
                <Link className='text-sideaccount' to='#logout' onClick={handleSignOut}>Cerrar sesión</Link>
            </div>
        </aside>
    );
}

export default AsideAccount;