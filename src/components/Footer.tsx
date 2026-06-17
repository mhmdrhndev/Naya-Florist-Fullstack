import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { settings } = useShop();

  const handleCareGuideClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Dispatch a custom event to open the Care Guide modal
    window.dispatchEvent(new CustomEvent('open-care-guide'));
  };

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/30 w-full mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-margin-mobile md:px-margin-desktop py-16 max-w-screen-2xl mx-auto">
        <div className="space-y-4">
          <span className="font-display-lg text-2xl font-bold text-primary block">Naya Florist</span>
          <p className="text-on-surface-variant font-body-md text-sm leading-relaxed max-w-sm">
            Eternal arrangements for the modern home. Bringing timeless beauty to your space with zero maintenance.
          </p>
        </div>
        <div className="space-y-4 md:pl-12">
          <h4 className="font-label-caps text-xs text-primary uppercase font-bold tracking-widest">Quick Links</h4>
          <ul className="space-y-2 text-sm text-on-surface-variant font-body-md">
            <li>
              <Link className="hover:text-primary transition-colors" to="/collections">
                Collections
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary transition-colors" to="/about">
                About Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary transition-colors" to="/track">
                Lacak Pesanan
              </Link>
            </li>
            <li>
              <a onClick={handleCareGuideClick} className="hover:text-primary transition-colors cursor-pointer" href="#care-guide">
                Care Guide
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-label-caps text-xs text-primary uppercase font-bold tracking-widest">Instagram</h4>
          <p className="text-on-surface-variant font-body-md text-sm leading-relaxed max-w-sm">
            Follow our daily journey and everlasting creations.
          </p>
          <a
            href={settings.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-tertiary transition-all duration-300 font-label-caps text-xs uppercase tracking-widest font-bold border-b border-primary/20 pb-1 hover:border-primary"
          >
            <span>@{settings.instagram_username}</span>
            <span className="material-symbols-outlined text-[16px]">east</span>
          </a>
        </div>
      </div>
      <div className="border-t border-outline-variant/20 py-6 px-margin-mobile md:px-margin-desktop text-center text-xs text-on-surface-variant/70">
        <p>© 2026 Naya Florist. Eternal Bloom.</p>
      </div>
    </footer>
  );
};
export default Footer;
