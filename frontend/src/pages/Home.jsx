import { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { API_BASE_URL } from "../config";

const api = axios.create({
    baseURL: API_BASE_URL,
});

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('products/');
                setProducts(response.data);
            } catch (err) {
                setError("Unable to connect to the server.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <Hero />
            <main className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                    <div>
                        <h3 className="text-gold-500 text-sm font-bold uppercase tracking-[0.2em] mb-3">Our Collections</h3>
                        <h2 className="text-4xl font-serif text-white">Featured Products</h2>
                    </div>
                    <div className="h-px bg-white/10 flex-grow mx-8 hidden md:block"></div>
                    <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                        Hand-picked lighting fixtures that blend function with artistic expression.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/10 border border-red-900/30 text-red-500 p-8 text-center rounded">
                        <p>{error}</p>
                        <p className="text-sm mt-2 text-gray-500">Please make sure the Django backend is running.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
};

export default Home;
