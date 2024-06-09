import { BrowserRouter as Router } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import Routes from './routes';

function App() {
  return (
    <Router>
      <HeaderComponent />
      <Routes />
      <FooterComponent />
    </Router>
  );
}

export default App;