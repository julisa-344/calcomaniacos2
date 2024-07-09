import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartContext, CartContextType } from './CartContext';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import Routes from './routes';
import { AuthProvider } from './AuthContext';

function App() {
	const [cart, setCart] = useState<CartContextType['cart']>([]);

	return (
		<Router>
			<AuthProvider>
				<CartContext.Provider value={{ cart, setCart }}>
					<HeaderComponent />
					<Routes />
				</CartContext.Provider>
				<FooterComponent />
			</AuthProvider>
		</Router>
	);
}

export default App;