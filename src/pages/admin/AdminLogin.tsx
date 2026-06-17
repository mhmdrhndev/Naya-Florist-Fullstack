import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect straight to products dashboard
  if (user) {
    return <Navigate to="/admin/products" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid email or password.');
      } else {
        navigate('/admin/products');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
      {/* Background blobs for premium aesthetic */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-fixed/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[420px] bg-surface p-8 md:p-10 rounded-2xl border border-outline-variant/30 soft-bloom-shadow z-10 flex flex-col gap-6">
        <div className="text-center space-y-2">
          <h1 className="font-display-lg text-3xl font-bold text-primary tracking-tight">Naya Florist</h1>
          <p className="text-on-surface-variant font-body-md text-xs tracking-wider uppercase font-bold text-outline">
            Admin Console Login
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-error-container/40 border border-error/20 text-error text-xs font-semibold rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <label className="font-label-caps text-[10px] text-on-surface uppercase tracking-wider font-bold block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              className="w-full h-11 px-4 border border-outline-variant/60 bg-transparent rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-label-caps text-[10px] text-on-surface uppercase tracking-wider font-bold block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              className="w-full h-11 px-4 border border-outline-variant/60 bg-transparent rounded-lg text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-on-primary font-bold font-label-caps text-xs tracking-widest uppercase border border-primary hover:bg-transparent hover:text-primary transition-all duration-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            ) : (
              <>
                <span>Secure Log In</span>
                <span className="material-symbols-outlined text-[16px]">lock</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs text-on-surface-variant/80 hover:text-primary transition-colors underline font-medium"
          >
            Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;
