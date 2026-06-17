import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useShop } from '../context/ShopContext';

interface Color {
  name: string;
  hex: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  material: string;
  colors: Color[];
  description: string;
  image: string;
  gallery: string[];
  is_featured: boolean;
}

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useShop();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [mainImage, setMainImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Checkout and Order Placement States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Fetch product detail and related creations
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setLoading(true);

      try {
        // Query current product
        const { data: current, error: currentError } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id))
          .single();

        if (currentError) {
          console.error('Error fetching product details:', currentError);
          setProduct(null);
        } else if (current) {
          // Parse colors and gallery if needed (Supabase-js does it automatically for JSONB fields)
          const parsedProduct: Product = {
            ...current,
            colors: Array.isArray(current.colors) ? current.colors : [],
            gallery: Array.isArray(current.gallery) ? current.gallery : [],
          };

          setProduct(parsedProduct);
          setMainImage(parsedProduct.image);
          if (parsedProduct.colors.length > 0) {
            setSelectedColor(parsedProduct.colors[0].name);
          } else {
            setSelectedColor('Standar');
          }

          // Query related creations from same category
          const { data: related, error: relatedError } = await supabase
            .from('products')
            .select('*')
            .neq('id', parsedProduct.id)
            .eq('category', parsedProduct.category)
            .limit(3);

          if (relatedError) {
            console.error('Error fetching related products:', relatedError);
          } else if (related && related.length > 0) {
            setRelatedProducts(related);
          } else {
            // Fallback: fetch any other 3 products
            const { data: fallbackRelated } = await supabase
              .from('products')
              .select('*')
              .neq('id', parsedProduct.id)
              .limit(3);
            if (fallbackRelated) {
              setRelatedProducts(fallbackRelated);
            }
          }
        }
      } catch (err) {
        console.error('Unexpected error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-screen-2xl mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center">
        <span className="material-symbols-outlined text-outline-variant text-6xl mb-4">
          sentiment_dissatisfied
        </span>
        <h3 className="font-headline-sm text-xl text-primary font-semibold mb-2">Produk Tidak Ditemukan</h3>
        <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-6">
          Kreasi buket bunga yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <button
          onClick={() => navigate('/collections')}
          className="px-8 py-3.5 bg-primary text-on-primary font-bold font-label-caps text-xs tracking-widest uppercase rounded border border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const formatIDR = (price: number) => {
    return 'Rp ' + price.toLocaleString('id-ID');
  };

  const getWhatsAppConsultLink = () => {
    const colorInfo = selectedColor && selectedColor !== 'Standar' ? ` (Warna: ${selectedColor})` : '';
    const message = `💐 Halo Admin Naya Florist!

Saya tertarik dengan buket berikut:

🌸 *${product.name}*${colorInfo}
📦 Material: ${product.material}

Bisa dibantu info mengenai detail harga, ketersediaan, dan pengirimannya? Terima kasih! 🙏`;

    return `https://api.whatsapp.com/send?phone=${settings.whatsapp_number}&text=${encodeURIComponent(message)}`;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Mohon isi semua data pengiriman.');
      return;
    }

    setOrderSubmitting(true);
    try {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
      const generatedId = `NYA-${dateStr}-${randomStr}`;

      const orderItem = {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: 1,
        color: selectedColor,
        image: product.image,
      };

      const { error } = await supabase.from('orders').insert({
        id: generatedId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        items: [orderItem],
        total_price: product.price,
        status: 'Pending',
        tracking_status: 'Pesanan Anda telah diterima dan sedang menunggu verifikasi oleh Admin Naya Florist.',
        shipping_courier: '',
        shipping_receipt: '',
      });

      if (error) throw error;

      setPlacedOrderId(generatedId);
      setIsCheckoutOpen(false);
      setShowSuccessOverlay(true);

      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    } catch (err: any) {
      alert('Gagal membuat pesanan: ' + err.message);
    } finally {
      setOrderSubmitting(false);
    }
  };

  const galleryList = product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <>
      <main className="max-w-screen-2xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-16 items-start">
          {/* Left: Large Image Gallery */}
          <div className="lg:col-span-7 grid grid-cols-1 gap-4">
            {/* Large Display Image */}
            <div className="aspect-[4/5] overflow-hidden bg-surface-container-low rounded-lg transition-transform duration-700 hover:scale-[1.01] soft-bloom-shadow shine-container">
              <img alt={product.name} className="w-full h-full object-cover" src={mainImage} />
            </div>
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-4">
              {galleryList.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImage(imgUrl)}
                  className={`aspect-square bg-surface-container-low rounded overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:opacity-90 ${mainImage === imgUrl
                      ? 'border-primary shadow-sm scale-[0.98]'
                      : 'border-transparent opacity-60'
                    }`}
                >
                  <img alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" src={imgUrl} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="border-b border-outline-variant/30 pb-6">
              <span className="font-label-caps text-xs text-secondary uppercase tracking-widest mb-2 block font-bold">
                Koleksi Seri {product.category}
              </span>
              <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface mb-2 font-semibold leading-tight">
                {product.name}
              </h1>
              <p className="text-primary font-price-display text-xl font-bold mb-3">
                {formatIDR(product.price)}
              </p>
              <p className="font-body-lg text-sm text-on-surface-variant italic mb-4">
                Bahan: {product.material}
              </p>
            </div>

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="space-y-3">
                <span className="font-label-caps text-xs text-on-surface uppercase tracking-wider block font-bold">
                  Warna Pilihan:{' '}
                  <span className="text-primary font-normal normal-case ml-1">
                    {selectedColor}
                  </span>
                </span>
                <div className="flex gap-4">
                  {product.colors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(col.name)}
                      className={`w-10 h-10 rounded-full border border-outline-variant/60 shadow-sm transition-transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer ${selectedColor === col.name
                          ? 'ring-2 ring-offset-2 ring-primary border-primary scale-[1.02]'
                          : ''
                        }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action CTAs (2 buttons: Tanya / Chat WA and Pesan Sekarang) */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={getWhatsAppConsultLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-14 border border-primary text-primary hover:bg-primary/5 transition-all duration-300 rounded-xl font-label-caps text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg
                  viewBox="0 0 32 32"
                  width="18"
                  height="18"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.004 2.667A13.29 13.29 0 0 0 2.72 15.893a13.18 13.18 0 0 0 1.792 6.627L2.667 29.333l7.027-1.827A13.3 13.3 0 0 0 16.004 29.333a13.29 13.29 0 0 0 13.329-13.333A13.29 13.29 0 0 0 16.004 2.667Zm0 24.32a10.96 10.96 0 0 1-5.56-1.52l-.4-.24-4.133 1.08 1.1-4.013-.26-.413a10.89 10.89 0 0 1-1.68-5.827A11 11 0 0 1 16.004 5.04 11 11 0 0 1 27.004 16a11 11 0 0 1-11 11.013v-.027Zm6.027-8.24c-.333-.167-1.96-.967-2.267-1.08-.307-.113-.527-.167-.747.167s-.86 1.08-1.053 1.3-.387.247-.72.08a9.13 9.13 0 0 1-2.68-1.653 10.05 10.05 0 0 1-1.853-2.307c-.193-.333-.02-.513.147-.68s.333-.387.5-.587a2.28 2.28 0 0 0 .333-.553.607.607 0 0 0-.027-.587c-.08-.167-.747-1.8-1.02-2.467-.267-.64-.54-.553-.747-.567h-.64a1.23 1.23 0 0 0-.887.413A3.72 3.72 0 0 0 9.16 14.5a6.47 6.47 0 0 0 1.353 3.427 14.8 14.8 0 0 0 5.66 5c.793.34 1.413.547 1.893.7.797.253 1.52.22 2.093.133.64-.093 1.96-.8 2.24-1.573s.28-1.44.193-1.573c-.08-.14-.3-.22-.633-.387Z" />
                </svg>
                Tanya / Chat WA
              </a>
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="flex-1 h-14 bg-primary text-on-primary border border-primary hover:bg-transparent hover:text-primary transition-all duration-300 rounded-xl font-label-caps text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer focus:outline-none active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                Pesan Sekarang
              </button>
            </div>

            {/* Description */}
            <div className="mt-4">
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products section */}
        <section className="mt-24 pt-16 border-t border-outline-variant/30">
          <h2 className="font-headline-md text-2xl md:text-3xl text-center text-on-surface font-semibold mb-12">
            Kreasi Bunga Terkait
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter lg:gap-8">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="group cursor-pointer bg-transparent transition-all duration-500 soft-bloom-hover rounded overflow-hidden pb-4"
              >
                <div className="aspect-[4/5] overflow-hidden bg-surface-container mb-4 relative soft-bloom-shadow rounded-sm shine-container">
                  <img
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={p.image}
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="text-center px-2">
                  <span className="font-label-caps text-[9px] text-secondary tracking-widest uppercase mb-1 block font-bold">
                    {p.category}
                  </span>
                  <h4 className="font-display-lg text-[20px] text-on-surface mb-1 hover:text-primary transition-colors line-clamp-1">
                    {p.name}
                  </h4>
                  <p className="text-primary font-price-display text-xs font-bold mt-1">
                    {formatIDR(p.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefit Section: Why Artificial? */}
        <section className="mt-24 pt-16 border-t border-outline-variant/30">
          <h2 className="font-headline-md text-2xl md:text-3xl text-center text-on-surface font-semibold mb-12">
            Filosofi Bunga Abadi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 hover:bg-surface-container-low transition-colors duration-500 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-primary-fixed/30 flex items-center justify-center mb-6 text-primary shadow-sm">
                <span className="material-symbols-outlined text-3xl">all_inclusive</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold mb-2">Tahan Lama</h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Investasi abadi yang tetap mekar sempurna dari tahun ke tahun tanpa memerlukan perawatan.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 hover:bg-surface-container-low transition-colors duration-500 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-primary-fixed/30 flex items-center justify-center mb-6 text-primary shadow-sm">
                <span className="material-symbols-outlined text-3xl">block</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold mb-2">Bebas Alergi</h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Bernapas lega dengan bahan hipoalergenik yang menyajikan keindahan tanpa iritasi serbuk sari.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 hover:bg-surface-container-low transition-colors duration-500 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-primary-fixed/30 flex items-center justify-center mb-6 text-primary shadow-sm">
                <span className="material-symbols-outlined text-3xl">eco</span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold mb-2">Ramah Lingkungan</h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Bahan berkelanjutan yang tahan lama membantu mengurangi limbah sampah bunga segar secara berkala.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Checkout Form Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-background text-on-surface max-w-md w-full rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden p-6 space-y-6 transform scale-100 transition-all">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h3 className="font-display-lg text-lg font-bold text-primary">Detail Pengiriman</h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-on-surface uppercase tracking-wider font-bold block">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder=""
                  className="w-full h-11 px-4 border border-outline-variant/60 bg-transparent rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-on-surface uppercase tracking-wider font-bold block">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder=""
                  className="w-full h-11 px-4 border border-outline-variant/60 bg-transparent rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-on-surface uppercase tracking-wider font-bold block">
                  Alamat Lengkap Pengiriman
                </label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Tulis alamat pengiriman secara detail..."
                  className="w-full min-h-[80px] p-3 border border-outline-variant/60 bg-transparent rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-y"
                  required
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  disabled={orderSubmitting}
                  className="px-4 py-2.5 border border-outline text-on-surface-variant font-bold font-label-caps text-[10px] tracking-widest uppercase hover:bg-surface-container rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={orderSubmitting}
                  className="px-6 py-2.5 bg-primary text-on-primary border border-primary font-bold font-label-caps text-[10px] tracking-widest uppercase hover:bg-transparent hover:text-primary transition-all duration-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {orderSubmitting ? (
                    <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                  ) : (
                    <span>Konfirmasi Pesanan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Success Overlay */}
      {showSuccessOverlay && (
        <div className="checkout-success-overlay active">
          {/* Confetti canvas */}
          <div className="petal-confetti-container">
            {Array.from({ length: 15 }).map((_, i) => {
              const size = Math.random() * 14 + 8;
              const delay = Math.random() * 3;
              const duration = Math.random() * 4 + 3;
              return (
                <div
                  key={i}
                  className="petal"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                    backgroundColor: i % 2 === 0 ? '#fdb2de' : '#fce8ee',
                    animationName: 'petalFall',
                    animationTimingFunction: 'linear',
                    animationFillMode: 'forwards',
                  }}
                />
              );
            })}
          </div>

          <div className="checkout-ring-pulse" />
          <div className="checkout-ring-pulse" />

          <div className="checkout-check-circle">
            <svg className="checkout-checkmark-svg" viewBox="0 0 52 52">
              <path className="checkmark-path" fill="none" d="M14 27 l10 10 l20 -20" />
            </svg>
          </div>

          <h2 className="checkout-success-title">Pesanan Berhasil Dibuat!</h2>
          <p className="checkout-success-subtitle">
            Terima kasih telah berbelanja di Naya Florist. Buket bunga Anda akan segera dirangkai oleh Florist kami.
          </p>

          <div className="checkout-order-badge">
            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            <span>TRACKING ID: {placedOrderId}</span>
          </div>

          <button
            onClick={() => {
              setShowSuccessOverlay(false);
              navigate(`/track/${placedOrderId}`);
            }}
            className="checkout-close-btn cursor-pointer"
          >
            Lacak Pesanan Sekarang
          </button>
        </div>
      )}
    </>
  );
};
export default ProductDetail;
