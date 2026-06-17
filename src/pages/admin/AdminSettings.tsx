import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const AdminSettings: React.FC = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  /**
   * Fetches active store settings from the Supabase database.
   */
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setWhatsappNumber(data.whatsapp_number);
        setInstagramUrl(data.instagram_url);
        setInstagramUsername(data.instagram_username);
        setShopAddress(data.shop_address);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setMessage({ type: 'error', text: 'Gagal memuat pengaturan toko dari database.' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validates and saves updated store configurations to Supabase.
   */
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // 1. Basic validation
    if (!whatsappNumber.trim() || !instagramUrl.trim() || !instagramUsername.trim() || !shopAddress.trim()) {
      setMessage({ type: 'error', text: 'Semua kolom pengaturan harus diisi.' });
      return;
    }

    // Clean phone number (remove +, spaces, hyphens)
    const cleanPhone = whatsappNumber.replace(/[+\s-]/g, '');
    if (!/^\d+$/.test(cleanPhone)) {
      setMessage({ type: 'error', text: 'Nomor WhatsApp hanya boleh berisi angka (tanpa spasi/simbol +).' });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .update({
          whatsapp_number: cleanPhone,
          instagram_url: instagramUrl.trim(),
          instagram_username: instagramUsername.trim(),
          shop_address: shopAddress.trim(),
        })
        .eq('id', 1);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Pengaturan toko berhasil diperbarui!' });
    } catch (err) {
      console.error('Error updating settings:', err);
      setMessage({ type: 'error', text: 'Gagal menyimpan pengaturan ke database.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display-lg text-3xl font-bold text-on-surface">Pengaturan Toko</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Kelola nomor WhatsApp tujuan, tautan Instagram sosial media, dan alamat fisik Naya Florist.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-2"></div>
        </div>
      ) : (
        <div className="max-w-2xl bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm">
          {message && (
            <div
              className={`p-4 rounded-xl mb-6 border text-xs font-semibold ${
                message.type === 'success'
                  ? 'bg-secondary-container/10 border-secondary text-secondary'
                  : 'bg-error-container/20 border-error/30 text-error'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* WhatsApp Phone Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                Nomor WhatsApp Penerima Pesanan
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Contoh: 6282113453467"
                  className="w-full px-4 py-2.5 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <p className="text-[10px] text-on-surface-variant italic">
                * Gunakan kode negara di awal (misal 62 untuk Indonesia) tanpa tanda "+" atau spasi (contoh: 6282113453467).
              </p>
            </div>

            {/* Instagram Link & Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Username Instagram
                </label>
                <input
                  type="text"
                  value={instagramUsername}
                  onChange={(e) => setInstagramUsername(e.target.value)}
                  placeholder="Contoh: naya_florist.tangerang"
                  className="w-full px-4 py-2.5 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Tautan Profil Instagram (URL)
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="Contoh: https://www.instagram.com/naya_florist.tangerang/"
                  className="w-full px-4 py-2.5 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Shop Address Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                Alamat Toko / Rujukan Pengiriman
              </label>
              <textarea
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                placeholder="Tulis alamat operasional florist..."
                rows={4}
                className="w-full px-4 py-2 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                required
              />
            </div>

            {/* Submit Action */}
            <div className="border-t border-outline-variant/30 pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-primary text-white hover:bg-transparent hover:text-primary border border-primary font-label-caps text-xs uppercase tracking-widest font-bold rounded-lg transition-all focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
