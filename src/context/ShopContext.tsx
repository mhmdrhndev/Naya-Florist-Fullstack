import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface ShopSettings {
  id?: number;
  whatsapp_number: string;
  instagram_url: string;
  instagram_username: string;
  shop_address: string;
}

interface ShopContextType {
  settings: ShopSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: ShopSettings = {
  whatsapp_number: '6282113453467',
  instagram_url: 'https://www.instagram.com/naya_florist.tangerang/',
  instagram_username: 'naya_florist.tangerang',
  shop_address: 'Tangerang, Banten'
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ShopSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching settings:', error);
      } else if (data) {
        setSettings(data);
      }
    } catch (e) {
      console.error('Unexpected error fetching settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <ShopContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
