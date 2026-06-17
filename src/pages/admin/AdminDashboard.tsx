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
  items: OrderItem[];
  total_price: number;
  status: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Statistics
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [chartData, setChartData] = useState<{ date: string; amount: number }[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedOrders: Order[] = data.map((order) => ({
          id: order.id,
          customer_name: order.customer_name,
          items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
          total_price: parseFloat(order.total_price),
          status: order.status,
          created_at: order.created_at
        }));

        setOrders(mappedOrders);
        calculateStats(mappedOrders);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orderList: Order[]) => {
    let sales = 0;
    let pending = 0;
    let completed = 0;

    orderList.forEach((order) => {
      if (order.status !== 'Cancelled') {
        sales += order.total_price;
      }
      if (order.status === 'Pending') {
        pending++;
      } else if (order.status === 'Delivered') {
        completed++;
      }
    });

    setTotalSales(sales);
    setTotalOrders(orderList.length);
    setPendingCount(pending);
    setCompletedCount(completed);

    // Generate daily sales values for the last 7 days
    const dailyValues: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      dailyValues[dateStr] = 0;
    }

    orderList.forEach((order) => {
      if (order.status !== 'Cancelled') {
        const dateStr = new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        if (dailyValues[dateStr] !== undefined) {
          dailyValues[dateStr] += order.total_price;
        }
      }
    });

    const chartPayload = Object.keys(dailyValues).map(key => ({
      date: key,
      amount: dailyValues[key]
    }));

    setChartData(chartPayload);
  };

  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display-lg text-3xl font-bold text-on-surface">Dashboard Ringkasan</h1>
        <p className="text-on-surface-variant text-sm mt-1">Status rekapitulasi penjualan, pesanan masuk, dan perkembangan operasional.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-2"></div>
        </div>
      ) : (
        <>
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KPI: Total Sales */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Total Penjualan</span>
                <span className="text-base font-bold text-on-surface block mt-1">Rp {totalSales.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* KPI: Total Orders */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl">receipt_long</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Total Pesanan</span>
                <span className="text-lg font-bold text-on-surface block mt-1">{totalOrders}</span>
              </div>
            </div>

            {/* KPI: Pending Orders */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-2xl">pending_actions</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Pesanan Pending</span>
                <span className="text-lg font-bold text-on-surface block mt-1">{pendingCount}</span>
              </div>
            </div>

            {/* KPI: Completed Orders */}
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl">task_alt</span>
              </div>
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Pesanan Selesai</span>
                <span className="text-lg font-bold text-on-surface block mt-1">{completedCount}</span>
              </div>
            </div>
          </div>

          {/* Chart & Recent Orders Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sales Chart block */}
            <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-outline-variant/30 pb-2 mb-6">Grafik Penjualan 7 Hari Terakhir</h3>
              </div>

              {/* Graphical Visual Bars */}
              <div className="h-64 flex items-end justify-between gap-2 pt-8 border-b border-outline-variant/30 px-2 pb-1">
                {chartData.map((d, idx) => {
                  const heightPct = (d.amount / maxAmount) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative">
                      {/* Hover Popover showing amount */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-[10px] font-bold py-1.5 px-2.5 rounded-lg shadow-md whitespace-nowrap z-20 font-sans">
                        Rp {d.amount.toLocaleString('id-ID')}
                      </div>
                      {/* Vertical Chart Bar */}
                      <div
                        style={{ height: `${Math.max(heightPct, 3)}%` }}
                        className={`w-full rounded-t-lg transition-all duration-700 ease-out cursor-pointer ${d.amount > 0 ? 'bg-primary hover:bg-primary/80' : 'bg-surface-container-high'
                          }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Chart Dates Axis */}
              <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-3 px-2">
                {chartData.map((d, idx) => (
                  <span key={idx} className="flex-1 text-center">{d.date}</span>
                ))}
              </div>
            </div>

            {/* Recent Orders block */}
            <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-outline-variant/30 pb-2 mb-4">Pesanan Terbaru</h3>

              <div className="divide-y divide-outline-variant/20">
                {orders.slice(0, 5).length === 0 ? (
                  <div className="py-8 text-center text-xs text-on-surface-variant font-bold">
                    Belum ada pesanan masuk.
                  </div>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                      <div>
                        <h4 className="text-sm font-bold text-on-surface">{order.customer_name}</h4>
                        <span className="text-[10px] text-on-surface-variant font-semibold block mt-0.5 font-mono">{order.id}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary block">Rp {order.total_price.toLocaleString('id-ID')}</span>
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest mt-1 ${order.status === 'Delivered'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : order.status === 'Cancelled'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-primary-container text-on-primary-container'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
