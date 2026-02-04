import { Star, ArrowRight } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        // Light Mode: bg-white border-gray-100 hover:shadow-black/5
        <div className="group relative bg-[#121212] transition-all duration-500 hover:-translate-y-2">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-900">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 p-4 text-center">
                        <span className="text-4xl mb-2">💡</span>
                        <span className="text-xs uppercase tracking-widest">No Image</span>
                    </div>
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300"></div>

                {/* Priority Badge */}
                {product.is_priority && (
                    <div className="absolute top-4 left-4 bg-gold-500/90 backdrop-blur-sm text-black text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
                        Best Seller
                    </div>
                )}

                {/* Quick Add Button */}
                <button className="absolute bottom-0 right-0 bg-white text-black p-4 w-12 h-12 flex items-center justify-center transition-all duration-300 translate-y-full group-hover:translate-y-0 hover:bg-gold-500">
                    <ArrowRight size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-serif text-white group-hover:text-gold-400 transition-colors duration-300">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-1">
                        <Star size={12} className="fill-gold-500 text-gold-500" />
                        <span className="text-xs text-gray-400">4.9</span>
                    </div>
                </div>

                <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">
                    {product.category}
                </p>

                <div className="flex items-end justify-between border-t border-white/5 pt-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400 line-through mb-1 opacity-50">
                            ${(parseFloat(product.price) * 1.2).toFixed(2)}
                        </span>
                        <span className="text-xl font-medium text-white">
                            ${product.price}
                        </span>
                    </div>
                    <button className="text-xs text-gold-500 uppercase tracking-widest hover:text-white transition-colors">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
