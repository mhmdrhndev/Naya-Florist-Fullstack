import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Product, Color } from '../../types';

const PREDEFINED_COLORS: Color[] = [
  { name: 'Standard', hex: '#F2EAEF' },
  { name: 'Blush Pink', hex: '#FCE4EC' },
  { name: 'Rose Red', hex: '#E91E63' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Soft Cream', hex: '#FFFDD0' },
  { name: 'Peach', hex: '#FFD1A9' },
  { name: 'Lavender', hex: '#E0B0FF' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Soft Yellow', hex: '#FFF9A6' },
  { name: 'Vintage Plum', hex: '#9B1E63' },
  { name: 'Sage Green', hex: '#8FBC8F' },
  { name: 'Crimson Red', hex: '#990000' },
  { name: 'Champagne Gold', hex: '#F7E7CE' },
];

const PREDEFINED_MATERIALS: string[] = [
  'Premium Silk Roses & Peonies',
  'Preserved Hydrangeas & Austin Roses',
  'Dried Peonies & Wild Wheat',
  'Handcrafted Crepe Paper Peonies',
  'Satin Ribbon Roses & Lily of the Valley',
  'Soap Roses & Preserved Baby\'s Breath',
  'Preserved Austin Roses & Dried Eucalyptus',
  'Premium Silk Hydrangeas & Tulips',
];

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States (for Add/Edit modal)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);

  // Form fields
  const [productId, setProductId] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Silk');
  const [price, setPrice] = useState('');
  const [materialSelect, setMaterialSelect] = useState('Premium Silk Roses & Peonies');
  const [customMaterial, setCustomMaterial] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [customColors, setCustomColors] = useState<Color[]>([]);
  const [galleryInput, setGalleryInput] = useState(''); // Textarea: "URL\nURL"
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Custom Color Form fields
  const [showAddCustomColor, setShowAddCustomColor] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#FF0000');

  // Image Upload States
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data) {
        const mapped = data.map((item) => ({
          id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id,
          name: item.name,
          category: item.category,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          material: item.material,
          colors: typeof item.colors === 'string' ? JSON.parse(item.colors) : item.colors,
          description: item.description,
          image: item.image,
          gallery: typeof item.gallery === 'string' ? JSON.parse(item.gallery) : item.gallery,
          featured: item.is_featured
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Uploads a file to Supabase Storage 'product-images' bucket.
   * Generates a unique timestamped file path to prevent override collisions.
   */
  const uploadFileToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload the binary payload
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get the public asset link
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  /**
   * Handles cover image file selection.
   */
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadFileToStorage(file);
      setImage(publicUrl);
    } catch (err) {
      console.error('Error uploading main image:', err);
      alert('Gagal mengunggah gambar utama.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  /**
   * Handles multi-file uploads for detail gallery images.
   */
  const handleGalleryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFileToStorage(files[i]);
        uploadedUrls.push(url);
      }

      // Append the newly uploaded public links to the text input
      const currentGallery = galleryInput.trim();
      const newUrlsStr = uploadedUrls.join('\n');
      setGalleryInput(currentGallery ? `${currentGallery}\n${newUrlsStr}` : newUrlsStr);
    } catch (err) {
      console.error('Error uploading gallery images:', err);
      alert('Gagal mengunggah beberapa gambar galeri.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  /**
   * Handles color selections toggling.
   */
  const handleColorToggle = (color: Color): void => {
    const exists = selectedColors.some(c => c.name.toLowerCase() === color.name.toLowerCase());
    if (exists) {
      setSelectedColors(selectedColors.filter(c => c.name.toLowerCase() !== color.name.toLowerCase()));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  /**
   * Helper to check if color is currently selected.
   */
  const isColorSelected = (color: Color): boolean => {
    return selectedColors.some(c => c.name.toLowerCase() === color.name.toLowerCase());
  };

  /**
   * Adds custom color to the selectable custom color list.
   */
  const handleAddCustomColor = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newColorName.trim()) {
      alert('Nama warna kustom tidak boleh kosong.');
      return;
    }
    const colorObj: Color = {
      name: newColorName.trim(),
      hex: newColorHex
    };

    const isPredefined = PREDEFINED_COLORS.some(c => c.name.toLowerCase() === colorObj.name.toLowerCase());
    const isCustom = customColors.some(c => c.name.toLowerCase() === colorObj.name.toLowerCase());

    if (isPredefined || isCustom) {
      if (!selectedColors.some(c => c.name.toLowerCase() === colorObj.name.toLowerCase())) {
        setSelectedColors([...selectedColors, colorObj]);
      }
    } else {
      setCustomColors([...customColors, colorObj]);
      setSelectedColors([...selectedColors, colorObj]);
    }

    setNewColorName('');
    setNewColorHex('#FF0000');
    setShowAddCustomColor(false);
  };

  /**
   * Opens the form in "Add Product" mode with empty inputs.
   */
  const openAddModal = (): void => {
    setEditMode(false);
    setTargetId(null);
    setProductId('');
    setName('');
    setCategory('Silk');
    setPrice('');
    setMaterialSelect(PREDEFINED_MATERIALS[0]);
    setCustomMaterial('');
    setDescription('');
    setImage('');
    setSelectedColors([{ name: 'Standard', hex: '#F2EAEF' }]);
    setCustomColors([]);
    setGalleryInput('');
    setIsFeatured(false);
    setIsFormOpen(true);
    setShowAddCustomColor(false);
    setNewColorName('');
    setNewColorHex('#FF0000');
  };

  /**
   * Opens the form in "Edit Product" mode pre-loaded with product details.
   */
  const openEditModal = (product: Product): void => {
    setEditMode(true);
    setTargetId(product.id);
    setProductId(String(product.id));
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price));

    // Handle material selection vs custom input
    if (PREDEFINED_MATERIALS.includes(product.material)) {
      setMaterialSelect(product.material);
      setCustomMaterial('');
    } else {
      setMaterialSelect('CUSTOM');
      setCustomMaterial(product.material);
    }

    setDescription(product.description);
    setImage(product.image);

    // Filter out custom colors
    const loadedColors = product.colors || [];
    setSelectedColors(loadedColors);
    const loadedCustomColors = loadedColors.filter(c =>
      !PREDEFINED_COLORS.some(pc => pc.name.toLowerCase() === c.name.toLowerCase() || pc.hex.toLowerCase() === c.hex.toLowerCase())
    );
    setCustomColors(loadedCustomColors);

    setGalleryInput(product.gallery ? product.gallery.join('\n') : '');
    setIsFeatured(product.featured);
    setIsFormOpen(true);
    setShowAddCustomColor(false);
    setNewColorName('');
    setNewColorHex('#FF0000');
  };

  /**
   * Adds or edits the product database record on Supabase.
   */
  const handleSaveProductSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const finalMaterial = materialSelect === 'CUSTOM' ? customMaterial.trim() : materialSelect;
    if (!name || !price || !finalMaterial || !image) {
      alert('Harap isi semua kolom wajib (termasuk gambar sampul dan bahan).');
      return;
    }

    setIsSaving(true);
    const finalColors = selectedColors.length > 0 ? selectedColors : [{ name: 'Standard', hex: '#F2EAEF' }];
    const parsedGallery = galleryInput.split('\n').map(url => url.trim()).filter(url => url.length > 0);

    // Gallery must at least contain the main cover image
    if (parsedGallery.length === 0) {
      parsedGallery.push(image);
    }

    const payload: any = {
      name,
      category,
      price: parseFloat(price),
      material: finalMaterial,
      description,
      image,
      colors: finalColors,
      gallery: parsedGallery,
      is_featured: isFeatured
    };

    try {
      if (editMode && targetId !== null) {
        // Update database row
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', targetId);

        if (error) throw error;
      } else {
        // Insert new database row (let Supabase auto-generate ID)
        const { error } = await supabase
          .from('products')
          .insert(payload);

        if (error) throw error;
      }

      await fetchProducts(); // Reload lists from Supabase
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Terjadi kesalahan saat menyimpan produk.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Deletes the product from Supabase (asks user for confirmation first).
   */
  const handleDeleteProduct = async (id: number) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus produk ID: ${id}? Tindakan ini permanen.`);
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Gagal menghapus produk dari database.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display-lg text-3xl font-bold text-on-surface">Kelola Produk</h1>
          <p className="text-on-surface-variant text-sm mt-1">Tambah produk buket bunga baru, edit material, warna, atau hapus dari etalase.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary text-white hover:bg-transparent hover:text-primary border border-primary px-6 py-2.5 font-label-caps text-xs uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah Produk
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-2"></div>
        </div>
      ) : (
        /* Products Data Table */
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant uppercase text-[10px] font-bold tracking-wider">
                  <th className="px-6 py-4">Foto</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nama Produk</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4 text-right">Harga</th>
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4 text-center">Pilihan</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-on-surface-variant font-bold">
                      Etalase kosong. Tambah produk pertama Anda dengan tombol di atas!
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="px-6 py-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded bg-surface-variant animate-fade-in"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-on-surface-variant">#{p.id}</td>
                      <td className="px-6 py-4 font-bold text-on-surface">{p.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block border border-secondary text-secondary font-label-caps text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest bg-secondary-container/5">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-primary">Rp {p.price.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-on-surface-variant italic text-xs">{p.material}</td>
                      <td className="px-6 py-4 text-center">
                        {p.featured && (
                          <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest bg-primary-container text-on-primary-container">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="text-primary hover:underline text-xs font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                        <span className="text-outline-variant">|</span>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-error hover:underline text-xs font-bold cursor-pointer"
                        >
                          Hapus
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

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm">
          <div className="bg-background text-on-surface max-w-xl w-full rounded-xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col">
            <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 flex justify-between items-center">
              <h3 className="font-display-lg text-lg font-bold text-primary">
                {editMode ? `Edit Produk #${targetId}` : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">ID Produk</label>
                  <input
                    type="text"
                    value={editMode ? `#${productId}` : 'Otomatis (Auto-generated)'}
                    placeholder="Otomatis"
                    className="w-full px-4 py-2.5 text-sm bg-surface-variant/30 border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-on-surface-variant/70 font-semibold"
                    disabled
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Nama Produk</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Golden Autumn"
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Kategori Material</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="Silk">Silk (Silk Series)</option>
                    <option value="Dried">Dried (Dried Series)</option>
                    <option value="Paper">Paper (Paper Couture)</option>
                    <option value="Preserved">Preserved (Preserved Collection)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Harga Buket (Rp)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Contoh: 850000"
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Bahan / Material Utama</label>
                  <select
                    value={materialSelect}
                    onChange={(e) => setMaterialSelect(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary outline-none"
                  >
                    {PREDEFINED_MATERIALS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                    <option value="CUSTOM">Kustom (Masukkan manual...)</option>
                  </select>
                </div>

                {materialSelect === 'CUSTOM' && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">Masukkan Bahan Kustom</label>
                    <input
                      type="text"
                      value={customMaterial}
                      onChange={(e) => setCustomMaterial(e.target.value)}
                      placeholder="Contoh: Premium Silk Roses, Preserved Hydrangeas"
                      className="w-full px-4 py-2 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                      required={materialSelect === 'CUSTOM'}
                    />
                  </div>
                )}
              </div>

              {/* Main cover image selector (Upload file + manual URL input fallback) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Gambar Sampul (Cover Image)</label>
                <div className="flex gap-4 items-center border border-outline-variant/40 rounded-xl p-4 bg-surface-container-lowest">
                  {image ? (
                    <img src={image} alt="Preview" className="w-16 h-20 object-cover rounded border border-outline-variant shadow-sm bg-surface-container" />
                  ) : (
                    <div className="w-16 h-20 rounded border border-dashed border-outline-variant flex items-center justify-center text-outline-variant">
                      <span className="material-symbols-outlined text-[20px]">image</span>
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="w-full text-xs text-on-surface-variant file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary-fixed/20 file:text-primary file:cursor-pointer hover:file:opacity-85"
                    />
                    {isUploadingImage && <span className="text-xs text-primary font-bold animate-pulse block">Mengunggah...</span>}
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Atau masukkan link HTTPS gambar utama"
                      className="w-full px-3 py-1.5 text-xs bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Pilihan Warna Produk</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4">
                  {[...PREDEFINED_COLORS, ...customColors].map((color) => {
                    const selected = isColorSelected(color);
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleColorToggle(color)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all duration-200 cursor-pointer group ${
                          selected
                            ? 'border-primary bg-primary/5 text-primary shadow-sm font-semibold'
                            : 'border-outline-variant hover:border-outline hover:bg-surface-variant/20 text-on-surface'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-outline-variant/60 shadow-inner flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                          style={{ backgroundColor: color.hex }}
                        >
                          {selected && (
                            <span className="material-symbols-outlined text-[12px] text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                              check
                            </span>
                          )}
                        </span>
                        <span className="text-xs truncate">{color.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Button & Form */}
                <div className="pt-1">
                  {!showAddCustomColor ? (
                    <button
                      type="button"
                      onClick={() => setShowAddCustomColor(true)}
                      className="text-xs text-primary hover:text-primary-dim font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      Tambah Warna Kustom
                    </button>
                  ) : (
                    <div className="bg-surface-container border border-outline-variant/50 rounded-xl p-4 mt-2 space-y-3 animate-fade-in">
                      <div className="text-xs font-bold text-primary">Tambah Warna Kustom Baru</div>
                      <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold block">Nama Warna</label>
                          <input
                            type="text"
                            value={newColorName}
                            onChange={(e) => setNewColorName(e.target.value)}
                            placeholder="Contoh: Crimson Red"
                            className="w-full px-3 py-1.5 text-xs bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="w-full sm:w-32 space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold block">Warna (Hex)</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={newColorHex}
                              onChange={(e) => setNewColorHex(e.target.value)}
                              className="w-8 h-8 rounded border border-outline-variant cursor-pointer p-0 shrink-0"
                            />
                            <input
                              type="text"
                              value={newColorHex}
                              onChange={(e) => setNewColorHex(e.target.value)}
                              className="w-full px-2 py-1.5 text-xs font-mono bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                          <button
                            type="button"
                            onClick={() => setShowAddCustomColor(false)}
                            className="px-3 py-1.5 border border-outline-variant text-xs font-bold rounded-lg cursor-pointer hover:bg-surface-variant/20"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleAddCustomColor}
                            className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg cursor-pointer hover:opacity-90"
                          >
                            Tambah
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery images selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Galeri Foto Detail</label>
                <div className="space-y-2 border border-outline-variant/40 rounded-xl p-4 bg-surface-container-lowest">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="w-full text-xs text-on-surface-variant file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary-fixed/20 file:text-primary file:cursor-pointer hover:file:opacity-85"
                  />
                  {isUploadingGallery && <span className="text-xs text-primary font-bold animate-pulse block">Mengunggah galeri...</span>}
                  <textarea
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    placeholder="Masukkan link gambar galeri (satu link per baris) atau gunakan pemilih file di atas"
                    rows={3}
                    className="w-full px-3 py-1.5 text-xs bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary font-mono resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Deskripsi Bouquet</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tulis deskripsi detail estetika dan filosofi buket..."
                  rows={4}
                  className="w-full px-4 py-2 text-sm bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chk-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant rounded"
                />
                <label htmlFor="chk-featured" className="text-xs font-bold text-on-surface select-none cursor-pointer uppercase tracking-wider">Tampilkan di Galeri Utama (Featured Product)</label>
              </div>

              <div className="border-t border-outline-variant/30 pt-4 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-surface text-on-surface border border-outline-variant rounded-lg font-label-caps text-xs uppercase tracking-widest font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-primary text-white hover:bg-transparent hover:text-primary border border-primary font-label-caps text-xs uppercase tracking-widest font-bold rounded-lg transition-all focus:outline-none disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
