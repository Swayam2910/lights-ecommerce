import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1543242702-8a9018428524?q=80&w=2070&auto=format&fit=crop"
                    alt="Luxury Chandelier"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-primary"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h2 className="text-gold-400 tracking-[0.3em] text-xs md:text-sm font-semibold uppercase mb-6">
                        Premium Lighting Collection
                    </h2>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-white mb-8 leading-tight">
                        Illuminate Your <br />
                        <span className="italic text-gold-200">World</span>
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Experience the perfect blend of modern design and timeless elegance.
                        Our handcrafted lights define luxury living.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/shop" className="px-10 py-4 bg-gold-500 text-black font-semibold uppercase tracking-wider text-sm hover:bg-gold-400 transition-all transform hover:scale-105">
                            Shop Collections
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
