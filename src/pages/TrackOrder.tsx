import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  color: string;
  image: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total_price: number;
  status: string; // Pending, Processing, Shipped, Delivered, Cancelled
  tracking_status: string; // Detail deskripsi status terkini
  shipping_courier?: string;
  shipping_receipt?: string;
  created_at: string;
}

export const TrackOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(id || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    } else {
      setOrder(null);
      setErrorMsg('');
    }
  }, [id]);

  const fetchOrder = async (orderId: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId.trim())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setOrder({
          id: data.id,
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          customer_address: data.customer_address,
          items: typeof data.items === 'string' ? JSON.parse(data.items) : data.items,
          total_price: parseFloat(data.total_price),
          status: data.status,
          tracking_status: data.tracking_status,
          shipping_courier: data.shipping_courier,
          shipping_receipt: data.shipping_receipt,
          created_at: data.created_at
        });
      } else {
        setOrder(null);
        setErrorMsg('Pesanan dengan kode pelacakan tersebut tidak ditemukan. Mohon periksa kembali.');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setErrorMsg('Gagal mencari pesanan. Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    navigate(`/track/${searchId.trim()}`);
  };

  // Helper to map status to timeline indexes
  const getStatusStep = (status: string): number => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <main className="max-w-screen-xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16 animate-fade-in">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <span className="font-label-caps text-xs text-primary uppercase tracking-widest mb-2 block font-bold">Lacak Pengiriman</span>
        <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface font-semibold mb-6">Lacak Pesanan Anda</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 p-1 border border-outline-variant/60 rounded-xl bg-surface-container-low shadow-sm">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Masukkan Kode Lacak (contoh: NYA-20260614-XYZ)"
            className="flex-grow px-4 py-3 text-sm bg-transparent border-none focus:outline-none"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white hover:bg-transparent hover:text-primary border border-primary font-label-caps text-xs uppercase tracking-widest font-bold rounded-lg transition-all cursor-pointer"
          >
            Cari
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 text-xs text-error bg-error-container/20 border border-error/30 p-3 rounded-lg">
            {errorMsg}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-2"></div>
          <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Mencari pesanan...</span>
        </div>
      )}

      {/* Tracking Results Area */}
      {!loading && order && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-12 animate-fade-slide-up">
          {/* Left Column: Visual Timeline & Status Updates */}
          <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 md:p-8 space-y-8">
            <div className="flex justify-between items-start border-b border-outline-variant/30 pb-4">
              <div>
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nomor Pelacakan</h3>
                <p className="text-xl font-bold text-primary font-price-display mt-1">{order.id}</p>
              </div>
              <div className="text-right">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tanggal Dibuat</h3>
                <p className="text-sm font-semibold text-on-surface mt-1">
                  {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Cancelled State banner */}
            {order.status === 'Cancelled' ? (
              <div className="bg-error-container/20 border border-error/30 text-error p-4 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined">cancel</span>
                <div>
                  <h4 className="font-bold text-sm">Pesanan Dibatalkan</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Pesanan ini telah dibatalkan oleh Admin Naya Florist. Silakan hubungi kami via WhatsApp untuk informasi lebih lanjut.</p>
                </div>
              </div>
            ) : (
              /* Timeline Progress UI */
              <div className="space-y-8">
                <div className="relative pl-8 border-l border-outline-variant/50 ml-4 py-1 space-y-10">
                  {/* Step 1: Order Received */}
                  <div className="relative">
                    <span className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${currentStep >= 1
                      ? 'bg-primary text-white border-primary shadow'
                      : 'bg-background border-outline-variant text-on-surface-variant'
                      }`}>
                      <span className="material-symbols-outlined text-[14px] font-black">check</span>
                    </span>
                    <h4 className={`text-sm font-bold ${currentStep >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
                      Pesanan Diterima (Order Received)
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">Pesanan Anda telah masuk dan terdaftar di sistem kami.</p>
                  </div>

                  {/* Step 2: Floral Arrangement */}
                  <div className="relative">
                    <span className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${currentStep >= 2
                      ? 'bg-primary text-white border-primary shadow'
                      : 'bg-background border-outline-variant text-on-surface-variant'
                      }`}>
                      <span className="material-symbols-outlined text-[14px] font-black">
                        {currentStep >= 2 ? 'check' : 'local_florist'}
                      </span>
                    </span>
                    <h4 className={`text-sm font-bold ${currentStep >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>
                      Bunga Sedang Dirangkai (In Progress)
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">Florist kami sedang merangkai buket pilihan Anda secara artisanal.</p>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="relative">
                    <span className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${currentStep >= 3
                      ? 'bg-primary text-white border-primary shadow'
                      : 'bg-background border-outline-variant text-on-surface-variant'
                      }`}>
                      <span className="material-symbols-outlined text-[14px] font-black">
                        {currentStep >= 3 ? 'check' : 'local_shipping'}
                      </span>
                    </span>
                    <h4 className={`text-sm font-bold ${currentStep >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
                      Dalam Pengiriman (Shipped)
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">Paket buket bunga Anda telah diserahkan ke kurir pengiriman.</p>
                    {order.shipping_courier && (
                      <div className="mt-2 p-3 bg-surface border border-outline-variant rounded-lg inline-flex flex-col gap-1">
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Informasi Kurir</span>
                        <span className="text-xs font-semibold text-primary">{order.shipping_courier}</span>
                        {order.shipping_receipt && (
                          <span className="text-xs text-on-surface-variant">Resi: <strong className="text-on-surface">{order.shipping_receipt}</strong></span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="relative">
                    <span className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${currentStep >= 4
                      ? 'bg-primary text-white border-primary shadow'
                      : 'bg-background border-outline-variant text-on-surface-variant'
                      }`}>
                      <span className="material-symbols-outlined text-[14px] font-black">
                        {currentStep >= 4 ? 'check' : 'done_all'}
                      </span>
                    </span>
                    <h4 className={`text-sm font-bold ${currentStep >= 4 ? 'text-primary' : 'text-on-surface-variant'}`}>
                      Diterima (Delivered)
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">Pesanan telah berhasil sampai di alamat tujuan Anda.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Current status description box */}
            <div className="bg-surface border border-outline-variant rounded-xl p-4 mt-6">
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Update Status Terakhir</h4>
              <p className="text-sm font-semibold text-on-surface leading-relaxed">{order.tracking_status}</p>
            </div>
          </div>

          {/* Right Column: Order Details & Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Customer metadata card */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 border-b border-outline-variant/30 pb-2">Informasi Pengiriman</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Penerima</span>
                  <span className="font-semibold text-on-surface">{order.customer_name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">No. WhatsApp</span>
                  <span className="font-semibold text-on-surface">{order.customer_phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Alamat</span>
                  <span className="text-on-surface-variant leading-relaxed block">{order.customer_address}</span>
                </div>
              </div>
            </div>

            {/* Items Summary card */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 border-b border-outline-variant/30 pb-2">Rincian Belanja</h3>

              <div className="divide-y divide-outline-variant/20">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded bg-surface-variant flex-shrink-0"
                    />
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface line-clamp-1">{item.name}</h4>
                        <span className="text-xs text-on-surface-variant">Warna: {item.color}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-on-surface-variant">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                        <span className="text-sm font-bold text-primary">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-outline-variant/30 pt-4 mt-4 flex justify-between items-center">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Pembayaran</span>
                <span className="text-lg font-bold text-primary font-price-display">Rp {order.total_price.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
export default TrackOrder;
