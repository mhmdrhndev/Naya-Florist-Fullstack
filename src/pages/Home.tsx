import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FallingPetals } from '../components/FallingPetals';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  is_featured: boolean;
}

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, category, price, image, is_featured')
          .eq('is_featured', true)
          .limit(3);

        if (error) {
          console.error('Error fetching featured products:', error);
        } else if (data) {
          setFeaturedProducts(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-center overflow-hidden bg-surface-bright" id="hero-section">
        {/* Falling Petals Confetti Component */}
        <FallingPetals />

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-25 mix-blend-multiply scale-105 animate-kenburns"
            alt="Floral background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdu37URkCYQWeimzlxv41ludm22pzD2NmF4b6F_DJxMIhyoASo91x5ZGty5XvdHJAGENr-yrUx7fqMeQ6gPjrXLPYEdGjqGwYGiMOJyOnNmq3tAUb6OgKrafbqsGWsg3zWBWBdKBqzIuCq8pfuu5p32-YfbCuGOxgL2Sp8F924VWF7mi9gXUkkU2tOjV_dk6bpyFlL_hckdMNb1YnfdY38ETxMS8lj7Hl44307M3zQsrBdFKIGhToIKzKPLlMxlHuDNp40fpM-UJ0"
          />
          <div className="absolute inset-0 line-art-overlay"></div>
          {/* Abstract Geometric Shapes for Depth */}
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-fixed/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary-container/20 rounded-full blur-[100px]"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-stack-md transition-all duration-1000 transform opacity-100 translate-y-0">
              <span className="w-8 h-[1px] bg-primary"></span>
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest text-[10px] md:text-xs font-bold">
                Buket Sutra Artisan Buatan Tangan
              </span>
            </div>
            <h1 className="font-display-lg text-[42px] md:text-[56px] text-on-surface mb-stack-lg leading-tight font-semibold transition-all duration-1000 transform opacity-100 translate-y-0">
              Bunga yang <br className="hidden md:block" /> Tidak Pernah Layu
            </h1>
            <p className="font-body-lg text-lg text-on-surface-variant mb-stack-lg max-w-xl leading-relaxed transition-all duration-1000 transform opacity-100 translate-y-0">
              Temukan seni keindahan abadi. Dibuat dengan cermat menggunakan sutra premium, kertas, dan bahan yang diawetkan. Tanpa penyiraman, tanpa layu, hanya keindahan abadi.
            </p>
            <div className="flex flex-col sm:flex-row gap-gutter transition-all duration-1000 transform opacity-100 translate-y-0">
              <Link
                to="/collections"
                className="bg-primary text-on-primary px-10 py-4 font-label-caps text-xs border border-primary hover:bg-transparent hover:text-primary transition-all duration-500 group flex items-center justify-center gap-2 tracking-widest uppercase font-bold"
              >
                Belanja Koleksi
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  east
                </span>
              </Link>
              <Link
                to="/about"
                className="bg-transparent text-on-surface px-10 py-4 font-label-caps text-xs border border-outline-variant hover:border-primary transition-all duration-500 flex items-center justify-center tracking-widest uppercase font-bold"
              >
                Proses Kami
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Line Art Element */}
        <div className="absolute bottom-10 right-margin-desktop hidden lg:block animate-float">
          <div className="w-40 h-40 border border-primary/20 rounded-full flex items-center justify-center p-8 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[56px] text-primary/30">local_florist</span>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="bg-surface py-12 border-t border-b border-outline-variant/20">
        <div className="max-w-screen-2xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-4">
            <div className="flex flex-col items-center gap-stack-sm">
              <span className="material-symbols-outlined text-primary text-3xl mb-1">architecture</span>
              <h3 className="font-label-caps text-xs text-on-surface uppercase tracking-wider font-bold">
                Buatan Tangan
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant max-w-xs">
                Dirancang dengan teliti oleh florist ahli
              </p>
            </div>
            <div className="flex flex-col items-center gap-stack-sm border-y md:border-y-0 md:border-x border-outline-variant/30 py-6 md:py-0">
              <span className="material-symbols-outlined text-primary text-3xl mb-1">local_shipping</span>
              <h3 className="font-label-caps text-xs text-on-surface uppercase tracking-wider font-bold">
                Pengiriman Lokal
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant max-w-xs">
                Berbasis di Tangerang, melayani Jabodetabek
              </p>
            </div>
            <div className="flex flex-col items-center gap-stack-sm">
              <span className="material-symbols-outlined text-primary text-3xl mb-1">eco</span>
              <h3 className="font-label-caps text-xs text-on-surface uppercase tracking-wider font-bold">
                Ramah Lingkungan
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant max-w-xs">
                Bahan berkelanjutan untuk rumah yang lebih asri
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-background">
        <div className="max-w-screen-2xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-3xl md:text-4xl text-on-surface mb-2 font-semibold">
              Galeri Pilihan
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Pilihan rangkaian bunga abadi kami yang paling disukai
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter lg:gap-12">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className={`group cursor-pointer ${
                    index === 1 ? 'md:mt-16 lg:mt-12' : ''
                  } transition-all duration-500`}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-surface-container mb-stack-md relative soft-bloom-shadow rounded-sm shine-container">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      alt={product.name}
                      src={product.image}
                    />
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="text-center">
                    <span className="font-label-caps text-[10px] text-secondary tracking-widest uppercase mb-1 block font-bold">
                      Seri {product.category}
                    </span>
                    <h4 className="font-display-lg text-[22px] text-on-surface mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-20">
            <Link
              to="/collections"
              className="inline-block border border-primary text-primary hover:bg-primary hover:text-white px-12 py-4 font-label-caps text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded shadow-sm"
            >
              Lihat Seluruh Katalog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
export default Home;
