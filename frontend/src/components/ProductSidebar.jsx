import { ChevronRight } from 'lucide-react';
import { categories } from '../utils/constants';

const ProductSidebar = ({
    selectedCategory,
    onCategoryChange,
    priceRange,
    onPriceChange
}) => {
    return (
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
            {/* Categories */}
            <div>
                <h3 className="text-lg font-serif font-medium text-white mb-4 pb-2 border-b border-white/10">
                    Categories
                </h3>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => onCategoryChange(null)}
                            className={`w-full text-left text-sm py-1 transition-colors flex items-center justify-between group ${!selectedCategory ? 'text-gold-500 font-medium' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            All Products
                            {!selectedCategory && <ChevronRight size={14} />}
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.slug}>
                            <button
                                onClick={() => onCategoryChange(cat.slug)}
                                className={`w-full text-left text-sm py-1 transition-colors flex items-center justify-between group ${selectedCategory === cat.slug ? 'text-gold-500 font-medium' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {cat.name}
                                {selectedCategory === cat.slug && <ChevronRight size={14} />}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Filter */}
            <div>
                <h3 className="text-lg font-serif font-medium text-white mb-4 pb-2 border-b border-white/10">
                    Price Range
                </h3>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => onPriceChange('min', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 pl-6 text-sm text-white focus:outline-none focus:border-gold-500/50"
                        />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => onPriceChange('max', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 pl-6 text-sm text-white focus:outline-none focus:border-gold-500/50"
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ProductSidebar;
