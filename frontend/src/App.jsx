import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import ProductListingPage from './pages/ProductListingPage';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="bg-primary min-h-screen relative flex flex-col">
          <Navbar />
          <CartSidebar />

          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/shop" element={<ProductListingPage />} />
              <Route path="/category/:slug" element={<ProductListingPage />} />
            </Routes>
          </div>

          <footer className="bg-black py-20 border-t border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <span className="text-2xl font-serif font-bold text-white mb-6 block">OM LIGHTS</span>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Illuminating spaces with handcrafted luxury since 2026.
                </p>
              </div>

              {['Shop', 'Company', 'Support'].map((col) => (
                <div key={col}>
                  <h4 className="text-white font-medium mb-6">{col}</h4>
                  <ul className="space-y-4 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-gold-500 transition-colors">Link One</a></li>
                    <li><a href="#" className="hover:text-gold-500 transition-colors">Link Two</a></li>
                    <li><a href="#" className="hover:text-gold-500 transition-colors">Link Three</a></li>
                  </ul>
                </div>
              ))}
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex justify-between text-xs text-gray-600 uppercase tracking-wider">
              <span>© 2026 Om Lights</span>
              <span>Made with Light</span>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
