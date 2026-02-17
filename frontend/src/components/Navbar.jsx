import { ShoppingBag, Menu, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const { toggleCart, cartCount } = useCart();

    const categories = [
        { name: 'Ceiling Chandelier', slug: 'ceiling-chandelier' },
        { name: 'Hanging Lights', slug: 'hanging-lights' },
        { name: 'Fancy Wall Lights', slug: 'fancy-wall-lights' },
        { name: 'Mirror Lights', slug: 'mirror-lights' },
        { name: 'Magnetic Track', slug: 'magnetic-track' },
        { name: 'Outdoor Foot Lights', slug: 'outdoor-foot-lights' },
        { name: 'Wall Lamps', slug: 'wall-lamps' },
        { name: 'Double Height Duplex Chandelier', slug: 'double-height-duplex-chandelier' },
        { name: 'Wall Fitting Watches', slug: 'wall-fitting-watches' },
        { name: 'LED Lights', slug: 'led-lights' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <img
                        src="/logo.jpg"
                        alt="OM LIGHTS"
                        className="h-12 w-auto object-contain rounded-full border-2 border-gold-500/20"
                    />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <Link to="/" className="hover:text-gold-400 transition-colors uppercase tracking-widest text-xs">
                        Home
                    </Link>

                    <Link to="/shop" className="hover:text-gold-400 transition-colors uppercase tracking-widest text-xs">
                        Shop
                    </Link>

                    {/* Categories Dropdown */}
                    <div className="relative group">
                        <button
                            className="flex items-center gap-1 hover:text-gold-400 transition-colors uppercase tracking-widest text-xs py-4"
                        >
                            Categories
                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                        </button>

                        {/* Dropdown Content */}
                        <div className="absolute top-full left-0 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                            <div className="py-2 flex flex-col">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        to={`/category/${cat.slug}`}
                                        className="px-6 py-3 text-sm text-gray-400 hover:text-gold-400 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link to="/about" className="hover:text-gold-400 transition-colors uppercase tracking-widest text-xs">
                        About Us
                    </Link>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-6">
                    <button className="text-white hover:text-gold-400 transition-colors">
                        <Search size={20} />
                    </button>
                    <button
                        onClick={toggleCart}
                        className="text-white hover:text-gold-400 transition-colors relative"
                    >
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-[10px] text-black font-bold flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                    <Link
                        to="/"
                        className="text-gray-300 hover:text-gold-400 py-2 border-b border-white/5"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>

                    <Link
                        to="/shop"
                        className="text-gray-300 hover:text-gold-400 py-2 border-b border-white/5"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Shop
                    </Link>

                    <div className="border-b border-white/5 pb-2">
                        <button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="flex items-center justify-between w-full text-gray-300 hover:text-gold-400 py-2"
                        >
                            <span>Categories</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCategoryOpen && (
                            <div className="pl-4 flex flex-col gap-2 mt-2 border-l border-white/10 ml-2">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        to={`/category/${cat.slug}`}
                                        className="text-gray-400 hover:text-gold-400 py-2 text-sm"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/about"
                        className="text-gray-300 hover:text-gold-400 py-2 border-b border-white/5"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About Us
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
