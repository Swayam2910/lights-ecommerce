import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ProductSidebar from '../components/ProductSidebar';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';
import { categories } from '../utils/constants';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const ProductListingPage = () => {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Filter State
    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('min_price') || '',
        max: searchParams.get('max_price') || ''
    });

    // Determine current category name
    const currentCategory = categories.find(c => c.slug === slug);
    const pageTitle = currentCategory ? currentCategory.name : 'All Collections';

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (slug) params.append('category', currentCategory?.name || slug);
                if (priceRange.min) params.append('min_price', priceRange.min);
                if (priceRange.max) params.append('max_price', priceRange.max);

                const response = await fetch(`${API_BASE_URL}/products/?${params.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch products');

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce price filter
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [slug, priceRange]);

    // Handlers
    const handleCategoryChange = (newSlug) => {
        if (newSlug) {
            navigate(`/category/${newSlug}`);
        } else {
            navigate('/shop');
        }
        setIsMobileFilterOpen(false);
    };

    const handlePriceChange = (type, value) => {
        const newRange = { ...priceRange, [type]: value };
        setPriceRange(newRange);

        // Update URL query params
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(`${type}_price`, value);
        } else {
            params.delete(`${type}_price`);
        }
        setSearchParams(params, { replace: true });
    };

    return (
        <div className="pt-32 px-6 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* Sidebar - Desktop */}
                    <div className="hidden md:block w-64 flex-shrink-0">
                        <ProductSidebar
                            selectedCategory={slug}
                            onCategoryChange={handleCategoryChange}
                            priceRange={priceRange}
                            onPriceChange={handlePriceChange}
                        />
                    </div>

                    {/* Mobile Filter Toggle */}
                    <div className="md:hidden mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-serif text-white">{pageTitle}</h1>
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="flex items-center gap-2 text-gold-500 text-sm uppercase tracking-wider border border-gold-500/30 px-4 py-2 rounded"
                        >
                            <Filter size={16} /> Filters
                        </button>
                    </div>

                    {/* Mobile Filter Sheet */}
                    {isMobileFilterOpen && (
                        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-6 overflow-y-auto">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-serif text-white">Filters</h2>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    Close
                                </button>
                            </div>
                            <ProductSidebar
                                selectedCategory={slug}
                                onCategoryChange={handleCategoryChange}
                                priceRange={priceRange}
                                onPriceChange={handlePriceChange}
                            />
                        </div>
                    )}

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="hidden md:block mb-8">
                            <h1 className="text-4xl font-serif text-white mb-2">{pageTitle}</h1>
                            <p className="text-gray-400">
                                {loading ? 'Loading products...' : `Showing ${products.length} products`}
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} className="aspect-[4/5] bg-white/5 animate-pulse rounded-sm"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center border border-white/5 rounded-lg bg-white/5">
                                <p className="text-gray-400 text-lg">No products found within this category/price range.</p>
                                <button
                                    onClick={() => {
                                        setPriceRange({ min: '', max: '' });
                                        navigate('/shop');
                                    }}
                                    className="mt-4 text-gold-500 hover:text-gold-400 underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListingPage;
