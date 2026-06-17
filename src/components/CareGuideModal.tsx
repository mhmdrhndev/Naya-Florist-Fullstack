import React, { useState, useEffect } from 'react';

export const CareGuideModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    };

    window.addEventListener('open-care-guide', handleOpen);
    return () => {
      window.removeEventListener('open-care-guide', handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm transition-all duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-background text-on-surface max-w-lg w-full rounded-lg shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-surface-container-low border-b border-outline-variant/30 flex justify-between items-center">
          <h3 className="font-display-lg text-xl font-bold text-primary">Panduan Perawatan Bunga</h3>
          <button
            onClick={handleClose}
            className="text-on-surface-variant hover:text-primary transition-colors p-1 focus:outline-none cursor-pointer"
            aria-label="Tutup Panduan"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] text-sm leading-relaxed font-body-md text-on-surface-variant">
          {/* Tip 1 */}
          <div className="flex gap-4 items-start">
            <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">cloud_off</span>
            <div>
              <h4 className="font-headline-sm text-sm font-bold text-on-surface mb-1">Hindari Air & Kelembapan</h4>
              <p>Jauhkan rangkaian bunga abadi Anda dari air dan ruangan yang lembap. Bunga kering sangat sensitif terhadap kelembapan yang dapat memicu jamur.</p>
            </div>
          </div>
          {/* Tip 2 */}
          <div className="flex gap-4 items-start">
            <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">wb_sunny</span>
            <div>
              <h4 className="font-headline-sm text-sm font-bold text-on-surface mb-1">Hindari Sinar Matahari Langsung</h4>
              <p>Letakkan bunga Anda di tempat yang teduh. Paparan sinar matahari langsung yang terlalu lama dapat memudarkan warna kelopak sutra dan daun kering.</p>
            </div>
          </div>
          {/* Tip 3 */}
          <div className="flex gap-4 items-start">
            <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">cleaning_services</span>
            <div>
              <h4 className="font-headline-sm text-sm font-bold text-on-surface mb-1">Pembersihan Berkala</h4>
              <p>Gunakan kemoceng lembut, kuas cat, atau pengering rambut (hairdryer) dengan pengaturan dingin/rendah untuk membersihkan debu pada bunga sutra dan bunga kering setiap beberapa bulan.</p>
            </div>
          </div>
          {/* Tip 4 */}
          <div className="flex gap-4 items-start">
            <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">settings_backup_restore</span>
            <div>
              <h4 className="font-headline-sm text-sm font-bold text-on-surface mb-1">Merapikan Kelopak</h4>
              <p>Jika bentuk kelopak bunga sutra agak berubah setelah pengiriman atau saat dipajang, Anda dapat merapikan kelopak bunga dengan tangan secara perlahan atau menggunakan setrika uap dari jarak yang aman.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
          <button
            onClick={handleClose}
            className="bg-primary text-on-primary hover:bg-transparent hover:text-primary border border-primary px-5 py-2 font-label-caps text-xs uppercase tracking-widest font-bold rounded transition-all focus:outline-none cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
export default CareGuideModal;
