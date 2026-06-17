import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const Header: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/naya_florist.tangerang/');

  useEffect(() => {
    supabase
      .from('settings')
      .select('instagram_url')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data && data.instagram_url) {
          setInstagramUrl(data.instagram_url);
        }
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Header (Shared Navigation) */}
      <header
        className={`sticky top-0 w-full z-[45] transition-all duration-300 ${isSticky
          ? 'shadow-md bg-surface/95 backdrop-blur-md'
          : 'shadow-sm bg-surface/90 backdrop-blur-md'
          }`}
      >
        <nav
          className={`grid grid-cols-2 md:grid-cols-3 items-center px-margin-mobile md:px-margin-desktop max-w-screen-2xl mx-auto transition-all duration-300 ease-in-out ${isSticky ? 'py-2' : 'py-stack-md'
            }`}
        >
          {/* Left: Logo */}
          <div className="flex justify-start">
            <Link
              className="font-display-lg text-[28px] md:text-3xl font-bold text-primary tracking-tight"
              to="/"
            >
              Naya Florist
            </Link>
          </div>

          {/* Middle: Nav Links (Centered) */}
          <div className="hidden md:flex justify-center items-center gap-8 font-body-md text-body-md">
            <Link
              className={`nav-link text-on-surface-variant hover:text-primary transition-colors duration-300 ${pathname === '/collections' ? 'nav-link-active text-primary font-bold' : ''
                }`}
              to="/collections"
            >
              Collections
            </Link>
            <Link
              className={`nav-link text-on-surface-variant hover:text-primary transition-colors duration-300 ${pathname === '/about' ? 'nav-link-active text-primary font-bold' : ''
                }`}
              to="/about"
            >
              About Us
            </Link>
          </div>

          {/* Right: Icons (Hamburger for mobile, Track button for desktop) */}
          <div className="flex justify-end items-center gap-2 md:gap-4">
            <Link
              to="/track"
              className={`hidden md:inline-flex items-center gap-1.5 border px-4 py-1.5 rounded-full font-label-caps text-[11px] font-bold tracking-wider uppercase transition-all duration-300 ${pathname.startsWith('/track')
                ? 'border-primary bg-primary text-white'
                : 'border-primary/45 hover:border-primary text-primary hover:bg-primary/5'
                }`}
            >
              <span className="material-symbols-outlined text-[15px]">local_shipping</span>
              Lacak Pesanan
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-primary p-2 flex items-center justify-center cursor-pointer"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        onClick={toggleMobileMenu}
        className={`fixed inset-0 z-[45] bg-on-background/30 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none hidden'
          }`}
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-[280px] bg-background text-on-surface shadow-2xl z-50 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out border-r border-outline-variant/30 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div>
          <div className="flex justify-between items-center mb-10">
            <span className="font-display-lg text-2xl text-primary font-bold tracking-tight">Naya Florist</span>
            <button
              onClick={toggleMobileMenu}
              className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="flex flex-col gap-6 text-lg font-medium">
            <Link
              onClick={toggleMobileMenu}
              to="/"
              className={`hover:text-primary transition-colors py-2 border-b border-outline-variant/10 ${pathname === '/' ? 'text-primary font-bold' : ''}`}
            >
              Home
            </Link>
            <Link
              onClick={toggleMobileMenu}
              to="/collections"
              className={`hover:text-primary transition-colors py-2 border-b border-outline-variant/10 ${pathname === '/collections' ? 'text-primary font-bold' : ''}`}
            >
              Collections
            </Link>
            <Link
              onClick={toggleMobileMenu}
              to="/about"
              className={`hover:text-primary transition-colors py-2 border-b border-outline-variant/10 ${pathname === '/about' ? 'text-primary font-bold' : ''}`}
            >
              About Us
            </Link>
            <Link
              onClick={toggleMobileMenu}
              to="/track"
              className={`hover:text-primary transition-colors py-2 border-b border-outline-variant/10 flex items-center gap-2 ${pathname.startsWith('/track') ? 'text-primary font-bold' : ''}`}
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              Lacak Pesanan
            </Link>
          </nav>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:opacity-80 underline text-sm font-semibold"
            >
              Instagram
            </a>
          </div>
          <p className="text-xs text-on-surface-variant">© 2026 Naya Florist. Eternal Bloom.</p>
        </div>
      </aside>
    </>
  );
};

export default Header;
