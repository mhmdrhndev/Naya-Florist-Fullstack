import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useShop } from '../context/ShopContext';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  material: string;
  image: string;
  is_featured: boolean;
  created_at: string;
}

export const Collections: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // States for filter & sort
  const [material, setMaterial] = useState('ALL');
  const [sortBy, setSortBy] = useState('FEATURED');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();
  const { settings } = useShop();

  // Load products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          console.error('Error fetching products:', error);
        } else if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and Sort pipeline
  useEffect(() => {
    let result = [...products];

    // 1. Filter by category (material)
    if (material !== 'ALL') {
      result = result.filter(
        (product) => product.category.toLowerCase() === material.toLowerCase()
      );
    }

    // 2. Sort
    if (sortBy === 'FEATURED') {
      result.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return a.id - b.id; // Secondary sorting by ID
      });
    } else if (sortBy === 'NEWEST') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredProducts(result);
  }, [products, material, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setMaterial('ALL');
    setCurrentPage(1);
  };

  const formatIDR = (price: number) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  const getWhatsAppLink = (product: Product) => {
    const message = `💐 Halo Admin Naya Florist!

Saya tertarik dengan buket berikut:

🌸 *${product.name}*
📦 Material: ${product.material}

Bisa dibantu info mengenai detail harga, ketersediaan, dan pengirimannya? Terima kasih! 🙏`;
    return `https://api.whatsapp.com/send?phone=${settings.whatsapp_number}&text=${encodeURIComponent(message)}`;
  };

  return (
    <main className="max-w-screen-2xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
      {/* Hero Header */}
      <header className="text-center mb-16" id="collections-header">
        <h1 className="font-display-lg text-4xl md:text-[56px] text-primary mb-stack-sm font-semibold">
          Koleksi Bunga Abadi
        </h1>
        <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Temukan rangkaian bunga buatan tangan kami yang dirancang untuk bertahan seumur hidup. Dari sutra artisan hingga botani yang diawetkan, temukan sentuhan abadi yang sempurna.
        </p>
      </header>

      {/* Filter Bar */}
      <section className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-outline-variant/30 pb-6">
        <div className="flex flex-wrap items-center gap-6 md:gap-8 w-full lg:w-auto">
          {/* Material Dropdown Select */}
          <div className="flex items-center gap-2 text-on-surface-variant font-label-caps text-xs">
            <span className="tracking-wider text-outline font-bold">BAHAN:</span>
            <select
              value={material}
              onChange={(e) => {
                setMaterial(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none focus:ring-0 font-label-caps text-xs text-primary font-bold cursor-pointer pr-8 uppercase tracking-widest outline-none py-1"
            >
              <option value="ALL">Semua Bahan</option>
              <option value="Silk">Seri Sutra (Silk)</option>
              <option value="Dried">Seri Bunga Kering (Dried)</option>
              <option value="Paper">Seri Kertas (Paper)</option>
              <option value="Preserved">Seri Bunga Preserved</option>
            </select>
          </div>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 text-on-surface-variant font-label-caps text-xs w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
          <span className="tracking-wider text-outline font-bold">URUTKAN:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent border-none focus:ring-0 font-label-caps text-xs text-primary font-bold cursor-pointer pr-8 uppercase tracking-widest outline-none py-1"
          >
            <option value="FEATURED">UNGGULAN</option>
            <option value="NEWEST">TERBARU</option>
          </select>
        </div>
      </section>

      {/* Active Filters Chips */}
      <div id="filter-chips-container" className="flex flex-wrap gap-2 mb-8 items-center min-h-[32px]">
        {material !== 'ALL' && (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-secondary text-secondary bg-secondary-container/10 rounded-full font-label-caps text-[9px] font-bold tracking-widest">
              SERI {material.toUpperCase()}
              <span
                onClick={() => {
                  setMaterial('ALL');
                  setCurrentPage(1);
                }}
                className="material-symbols-outlined text-[14px] cursor-pointer hover:text-primary transition-colors font-black"
              >
                close
              </span>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-on-surface-variant font-label-caps text-[10px] tracking-wider underline hover:text-primary transition-colors ml-2 uppercase font-bold cursor-pointer"
            >
              Hapus Filter
            </button>
          </>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center w-full">
          <span className="material-symbols-outlined text-outline-variant text-6xl mb-4">
            sentiment_dissatisfied
          </span>
          <h3 className="font-headline-sm text-xl text-primary font-semibold mb-2">
            Tidak ada koleksi yang cocok dengan filter.
          </h3>
          <p className="font-body-md text-on-surface-variant max-w-md">
            Coba hapus filter bahan untuk melihat koleksi bunga cantik kami.
          </p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter lg:gap-8 mb-16">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-transparent transition-all duration-500 soft-bloom-hover rounded overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-stack-md bg-surface-container-low shadow-sm shine-container soft-bloom-shadow rounded-sm">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={product.image}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Quick View Button overlay */}
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-surface/90 backdrop-blur-sm text-primary font-label-caps text-[10px] tracking-wider px-6 py-2.5 rounded border border-primary hover:bg-primary hover:text-white font-bold cursor-pointer"
                  >
                    LIHAT DETAIL
                  </button>
                </div>
                <div className="text-center px-2 pb-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block border border-secondary text-secondary font-label-caps text-[9px] font-bold px-2.5 py-0.5 rounded-full mb-2 uppercase tracking-widest bg-secondary-container/5">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="font-headline-sm text-[18px] text-on-surface font-semibold mb-1 cursor-pointer hover:text-primary transition-colors line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-primary font-price-display text-sm font-bold mt-1">
                      {formatIDR(product.price)}
                    </p>
                  </div>
                  <a
                    href={getWhatsAppLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 w-full py-2.5 border border-primary bg-primary text-white font-label-caps text-xs tracking-widest transition-all duration-300 hover:bg-transparent hover:text-primary font-bold uppercase rounded flex items-center justify-center gap-2"
                  >
                    <svg
                      viewBox="0 0 32 32"
                      width="14"
                      height="14"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16.004 2.667A13.29 13.29 0 0 0 2.72 15.893a13.18 13.18 0 0 0 1.792 6.627L2.667 29.333l7.027-1.827A13.3 13.3 0 0 0 16.004 29.333a13.29 13.29 0 0 0 13.329-13.333A13.29 13.29 0 0 0 16.004 2.667Zm0 24.32a10.96 10.96 0 0 1-5.56-1.52l-.4-.24-4.133 1.08 1.1-4.013-.26-.413a10.89 10.89 0 0 1-1.68-5.827A11 11 0 0 1 16.004 5.04 11 11 0 0 1 27.004 16a11 11 0 0 1-11 11.013v-.027Zm6.027-8.24c-.333-.167-1.96-.967-2.267-1.08-.307-.113-.527-.167-.747.167s-.86 1.08-1.053 1.3-.387.247-.72.08a9.13 9.13 0 0 1-2.68-1.653 10.05 10.05 0 0 1-1.853-2.307c-.193-.333-.02-.513.147-.68s.333-.387.5-.587a2.28 2.28 0 0 0 .333-.553.607.607 0 0 0-.027-.587c-.08-.167-.747-1.8-1.02-2.467-.267-.64-.54-.553-.747-.567h-.64a1.23 1.23 0 0 0-.887.413A3.72 3.72 0 0 0 9.16 14.5a6.47 6.47 0 0 0 1.353 3.427 14.8 14.8 0 0 0 5.66 5c.793.34 1.413.547 1.893.7.797.253 1.52.22 2.093.133.64-.093 1.96-.8 2.24-1.573s.28-1.44.193-1.573c-.08-.14-.3-.22-.633-.387Z" />
                    </svg>
                    Konsultasi WA
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex justify-center items-center gap-8 border-t border-outline-variant/30 pt-8 mt-12 mb-16">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="material-symbols-outlined text-primary hover:text-tertiary disabled:opacity-30 disabled:pointer-events-none p-1 cursor-pointer"
              >
                chevron_left
              </button>
              <div className="flex items-center gap-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <span
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`font-label-caps text-xs cursor-pointer pb-0.5 tracking-wider font-bold ${
                      page === currentPage
                        ? 'text-primary font-black border-b-2 border-primary'
                        : 'text-on-surface-variant hover:text-primary transition-colors'
                    }`}
                  >
                    {page}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="material-symbols-outlined text-primary hover:text-tertiary disabled:opacity-30 disabled:pointer-events-none p-1 cursor-pointer"
              >
                chevron_right
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
};
export default Collections;
