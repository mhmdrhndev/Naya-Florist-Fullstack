import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  color: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total_price: number;
  status: string;
  tracking_status: string;
  shipping_courier?: string;
  shipping_receipt?: string;
  created_at: string;
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Order update states (for edit modal)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [updateStatus, setUpdateStatus] = useState('Pending');
  const [updateTrackingStatus, setUpdateTrackingStatus] = useState('');
  const [updateCourier, setUpdateCourier] = useState('');
  const [updateReceipt, setUpdateReceipt] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mapped: Order[] = data.map((item) => ({
          id: item.id,
          customer_name: item.customer_name,
          customer_phone: item.customer_phone,
          customer_address: item.customer_address,
          items: typeof item.items === 'string' ? JSON.parse(item.items) : item.items,
          total_price: parseFloat(item.total_price),
          status: item.status,
          tracking_status: item.tracking_status,
          shipping_courier: item.shipping_courier || '',
          shipping_receipt: item.shipping_receipt || '',
          created_at: item.created_at
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Triggers the edit panel modal and sets initial update form values.
   */
  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setUpdateStatus(order.status);
    setUpdateTrackingStatus(order.tracking_status);
    setUpdateCourier(order.shipping_courier || '');
    setUpdateReceipt(order.shipping_receipt || '');
  };

  /**
   * Saves updated order status and logistics info to Supabase.
   */
  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: updateStatus,
          tracking_status: updateTrackingStatus,
          shipping_courier: updateCourier,
          shipping_receipt: updateReceipt
        })
        .eq('id', editingOrder.id);

      if (error) throw error;

      // Update local state instantly to avoid complete page reload
      setOrders(orders.map(o => o.id === editingOrder.id ? {
        ...o,
        status: updateStatus,
        tracking_status: updateTrackingStatus,
        shipping_courier: updateCourier,
        shipping_receipt: updateReceipt
      } : o));

      setEditingOrder(null);
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Gagal memperbarui status pesanan.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter pipelines (search term + status filter)
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display-lg text-3xl font-bold text-on-surface">Kelola Pesanan</h1>
          <p className="text-on-surface-variant text-sm mt-1">Lacak pembayaran, kelola kurir, dan perbarui status pengerjaan buket bunga.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari Nama / Kode Pelacakan..."
          className="px-4 py-2.5 text-sm bg-surface-container-low border border-outline-variant/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 text-sm bg-surface-container-low border border-outline-variant/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="ALL">Semua Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-2"></div>
        </div>
      ) : (
        /* Orders Table View */
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-6 py-4">Kode / Tanggal</th>
                  <th className="px-6 py-4">Penerima</th>
                  <th className="px-6 py-4">Item Bouquet</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-on-surface-variant font-bold">
                      Tidak ada pesanan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-primary block font-mono">{order.id}</span>
                        <span className="text-[10px] text-on-surface-variant font-semibold mt-0.5 block">
                          {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-on-surface block">{order.customer_name}</span>
                        <span className="text-xs text-on-surface-variant block mt-0.5">{order.customer_phone}</span>
                      </td>
                      <td className="px-6 py-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-on-surface-variant">
                            • <strong className="text-on-surface">{item.name}</strong> ({item.color}) x {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="font-bold text-primary">Rp {order.total_price.toLocaleString('id-ID')}</span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className={`inline-block text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${order.status === 'Delivered'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : order.status === 'Cancelled'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-primary-container text-on-primary-container'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(order)}
                          className="px-4 py-1.5 bg-surface text-primary border border-outline-variant hover:border-primary rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Kelola
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm">
          <div className="bg-background text-on-surface max-w-lg w-full rounded-xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col">
            <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 flex justify-between items-center">
              <h3 className="font-display-lg text-lg font-bold text-primary">Kelola Pesanan: {editingOrder.id}</h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateOrder} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Customer Detail review */}
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 text-xs space-y-2">
                <p><strong>Nama:</strong> {editingOrder.customer_name}</p>
                <p><strong>No. WhatsApp:</strong> {editingOrder.customer_phone}</p>
                <p><strong>Alamat:</strong> {editingOrder.customer_address}</p>
                <p><strong>Items:</strong> {editingOrder.items.map(i => `${i.name} (${i.color}) x${i.quantity}`).join(', ')}</p>
              </div>

              {/* Status Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Status Utama Pesanan</label>
                <select
                  value={updateStatus}
                  onChange={(e) => {
                    const nextStatus = e.target.value;
                    setUpdateStatus(nextStatus);
                    
                    // Auto update tracking description
                    if (nextStatus === 'Pending') {
                      setUpdateTrackingStatus("Pesanan Anda telah diterima dan sedang menunggu verifikasi oleh Admin Naya Florist.");
                    } else if (nextStatus === 'Processing') {
                      setUpdateTrackingStatus("Florist kami sedang merangkai buket pilihan Anda secara artisanal.");
                    } else if (nextStatus === 'Shipped') {
                      setUpdateTrackingStatus("Paket buket bunga Anda telah diserahkan ke kurir pengiriman.");
                    } else if (nextStatus === 'Delivered') {
                      setUpdateTrackingStatus("Pesanan telah berhasil sampai di alamat tujuan Anda.");
                    } else if (nextStatus === 'Cancelled') {
                      setUpdateTrackingStatus("Pesanan ini telah dibatalkan oleh Admin Naya Florist. Silakan hubungi kami via WhatsApp untuk informasi lebih lanjut.");
                    }
                    
                    // Clear courier & receipt if not Shipped
                    if (nextStatus !== 'Shipped') {
                      setUpdateCourier('');
                      setUpdateReceipt('');
                    }
                  }}
                  className="w-full px-4 py-2.5 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="Pending">Pending (Menunggu Pembayaran)</option>
                  <option value="Processing">Processing (Bunga Sedang Dirangkai)</option>
                  <option value="Shipped">Shipped (Dalam Pengiriman/Kurir)</option>
                  <option value="Delivered">Delivered (Telah Diterima)</option>
                  <option value="Cancelled">Cancelled (Batal)</option>
                </select>
              </div>

              {/* Tracking description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Deskripsi Detail Status Lacak</label>
                <select
                  value={updateTrackingStatus}
                  onChange={(e) => setUpdateTrackingStatus(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="Pesanan Anda telah diterima dan sedang menunggu verifikasi oleh Admin Naya Florist.">
                    Pesanan diterima & menunggu verifikasi (Pending)
                  </option>
                  <option value="Florist kami sedang merangkai buket pilihan Anda secara artisanal.">
                    Bunga sedang dirangkai (Processing)
                  </option>
                  <option value="Paket buket bunga Anda telah diserahkan ke kurir pengiriman.">
                    Dalam Pengiriman (Shipped)
                  </option>
                  <option value="Pesanan telah berhasil sampai di alamat tujuan Anda.">
                    Telah Diterima (Delivered)
                  </option>
                  <option value="Pesanan ini telah dibatalkan oleh Admin Naya Florist. Silakan hubungi kami via WhatsApp untuk informasi lebih lanjut.">
                    Pesanan Dibatalkan (Cancelled)
                  </option>
                  {updateTrackingStatus && ![
                    "Pesanan Anda telah diterima dan sedang menunggu verifikasi oleh Admin Naya Florist.",
                    "Florist kami sedang merangkai buket pilihan Anda secara artisanal.",
                    "Paket buket bunga Anda telah diserahkan ke kurir pengiriman.",
                    "Pesanan telah berhasil sampai di alamat tujuan Anda.",
                    "Pesanan ini telah dibatalkan oleh Admin Naya Florist. Silakan hubungi kami via WhatsApp untuk informasi lebih lanjut."
                  ].includes(updateTrackingStatus) && (
                    <option value={updateTrackingStatus}>{updateTrackingStatus}</option>
                  )}
                </select>
              </div>

              {/* Shipping info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Kurir Pengiriman</label>
                  <select
                    value={updateCourier}
                    onChange={(e) => setUpdateCourier(e.target.value)}
                    disabled={updateStatus !== 'Shipped'}
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary outline-none disabled:opacity-50 disabled:bg-surface-variant/20 disabled:cursor-not-allowed"
                  >
                    <option value="">Pilih Kurir</option>
                    <option value="GoSend">GoSend</option>
                    <option value="GrabExpress">GrabExpress</option>
                    <option value="Lalamove">Lalamove</option>
                    {updateCourier && !['GoSend', 'GrabExpress', 'Lalamove'].includes(updateCourier) && (
                      <option value={updateCourier}>{updateCourier}</option>
                    )}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Nomor Resi / Tautan Kurir</label>
                  <input
                    type="text"
                    value={updateReceipt}
                    onChange={(e) => setUpdateReceipt(e.target.value)}
                    disabled={updateStatus !== 'Shipped'}
                    placeholder={updateStatus === 'Shipped' ? "Contoh: Resi 1234567 / Tautan Lacak" : "Pilih status Shipped untuk mengisi"}
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:bg-surface-variant/20 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-4 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-5 py-2.5 bg-surface text-on-surface border border-outline-variant rounded-lg font-label-caps text-xs uppercase tracking-widest font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-primary text-white hover:bg-transparent hover:text-primary border border-primary font-label-caps text-xs uppercase tracking-widest font-bold rounded-lg transition-all focus:outline-none disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? 'Menyimpan...' : 'Simpan Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
