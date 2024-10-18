import './style/Footer.scss';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, WhatsApp } from '@mui/icons-material';

function FooterComponent() {
  return (
    <footer>
      <div className='generalFooter'>
        <div className='socialMediaFooter'>
          <div className='linksToSocial'>
            <h2>Redes Sociales</h2>
            <div className='iconsSocialFooter'>
              <Link to='#facebook'><Facebook /></Link>
              <Link to='#instagram'><Instagram /></Link>
              <Link to='#whatsapp'><WhatsApp /></Link>
            </div>
          </div>
          <div className='adressFooter'>
            <h2>Dirección:</h2>
            <p>Miraflores </p>
            <p>Lima - Perú</p>
          </div>
        </div>
        <div className='categoriesFooter'>
          <h2>Categorías</h2>
          <ul>
            <li><Link to='#skin' className='li-category'>Music</Link></li>
            <li><Link to='#shade' className='li-category'>Memes</Link></li>
            <li><Link to='#cilios' className='li-category'>Deporte</Link></li>
            <li><Link to='#blush'className='li-category'>Tecnologia</Link></li>
          </ul>
        </div>
        <div className='paymentFooter'>
          <h2>Formas de Pago</h2>
          <div className='paymentIcons'>
            <img src='/payments/visa-svgrepo-com.svg' alt='Visa' />
            <img src='/payments/master-card-svgrepo-com.svg' alt='Mastercard' />
            <img src='/payments/american-express-logo-svgrepo-com.svg' alt='American Express' />
            <img src='/payments/paypal-svgrepo-com.svg' alt='PayPal' />
          </div>
        </div>
      </div>
      <p>Copyright © Calcomaniacos. 2024. Todos los derechos reservados</p>
    </footer>
  );
}

export default FooterComponent;
