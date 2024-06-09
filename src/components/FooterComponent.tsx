import './style/Footer.scss';
import { Link } from 'react-router-dom';

function FooterComponent() {
  return (
    <footer>
      <div className='generalFooter'>
        <div className='socialMediaFooter'>
          <div className='linksToSocial'>
            <h2>Redes Sociales</h2>
            <div className='iconsSocialFooter'>
              <Link to='#facebook'><img src='/social-media/icons8-facebook.svg' alt='Facebook' /></Link>
              <Link to='#instagram'><img src='/social-media/icons8-instagram-48.svg' alt='Instagram' /></Link>
              <Link to='#whatsapp'><img src='/social-media/icons8-whatsapp.svg' alt='WhatsApp' /></Link>
            </div>
          </div>
          <div className='adressFooter'>
            <h2>Dirección:</h2>
            <p>Lorem Ipsum, 993, etc etc </p>
            <p>Lima - Perú</p>
          </div>
        </div>
        <div className='categoriesFooter'>
          <h2>Categorías</h2>
          <ul>
            <li><Link to='#skin'>Music</Link></li>
            <li><Link to='#shade'>Memes</Link></li>
            <li><Link to='#cilios'>Deporte</Link></li>
            <li><Link to='#blush'>TEcnologia</Link></li>
          </ul>
        </div>
        <div className='paymentFooter'>
          <h2>Formas de Pago</h2>
          <div className='paymentIcons'>
            <img src='/payments/icons8-visa.svg' alt='Visa' />
            <img src='/payments/icons8-mastercard.svg' alt='Mastercard' />
            <img src='/payments/icons8-american-express.svg' alt='American Express' />
            <img src='/payments/icons8-paypal.svg' alt='PayPal' />
          </div>
        </div>
      </div>
      <p>Copyright © Calcomaniacos. 2024. Todos los derechos reservados</p>
    </footer>
  );
}

export default FooterComponent;