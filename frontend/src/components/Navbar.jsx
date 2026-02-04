import { ShoppingBag, Menu, Search } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <img
                        src="/logo.jpg"
                        alt="OM LIGHTS"
                        className="h-12 w-auto object-contain rounded-full border-2 border-gold-500/20"
                    />
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    {/* Light Mode: text-gray-600 */}
                    {['Collections', 'Chandeliers', 'Wall Lights', 'About Us'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(' ', '-')}`}
                            className="hover:text-gold-400 transition-colors uppercase tracking-widest text-xs"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Icons */}
                <div className="flex items-center gap-6">
                    {/* Light Mode: text-dark hover:text-gold-500 */}
                    <button className="text-white hover:text-gold-400 transition-colors">
                        <Search size={20} />
                    </button>
                    <button className="text-white hover:text-gold-400 transition-colors relative">
                        <ShoppingBag size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-500 rounded-full"></span>
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
                // Light Mode: bg-white border-black/5
                <div className="md:hidden absolute top-full left-0 w-full bg-secondary border-b border-white/5 py-4 px-6 flex flex-col gap-4">
                    {['Collections', 'Chandeliers', 'Wall Lights', 'About Us'].map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="text-gray-300 hover:text-gold-400 py-2 border-b border-white/5"
                        >
                            {item}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
