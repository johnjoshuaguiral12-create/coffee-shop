import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { LayoutDashboard, Coffee, Settings, LogOut, Loader2 } from 'lucide-react';

import OrdersPage from './admin/OrdersPage';
import MenuPage from './admin/MenuPage';
import SettingsPage from './admin/SettingsPage';

export default function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/admin'
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A373]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] p-4">
        <div className="bg-white p-8 rounded-3xl border border-[#E6CCB2] shadow-sm text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-[#3C2A21] rounded-full flex items-center justify-center text-[#D4A373] mx-auto mb-4">
            <span className="font-serif italic font-bold text-3xl">B</span>
          </div>
          <h1 className="text-2xl font-serif font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 mb-8 text-sm">Sign in with your Google account to manage the coffee shop.</p>
          <button onClick={login} className="w-full bg-[#3C2A21] text-[#D4A373] py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:brightness-110 shadow-lg shadow-[#3c2a2144] transition-all">
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Orders', path: '/admin', icon: LayoutDashboard },
    { name: 'Menu', path: '/admin/menu', icon: Coffee },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#FDFCF8] font-sans text-[#3C2A21]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E6CCB2] flex flex-col z-10 hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-[#E6CCB2]">
          <div className="w-8 h-8 bg-[#3C2A21] rounded-full flex items-center justify-center text-[#D4A373]">
            <span className="font-serif italic font-bold text-lg">B</span>
          </div>
          <h1 className="font-serif text-xl font-bold tracking-tight">Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
            
            return (
              <Link 
                key={link.path}
                to={link.path} 
                className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                  isActive 
                    ? 'bg-[#3C2A21] text-[#D4A373] font-bold shadow-md' 
                    : 'text-gray-500 hover:bg-[#F5F1EE] hover:text-[#3C2A21]'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-[#D4A373]' : 'text-gray-400'} />
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#E6CCB2]">
          <div className="flex items-center gap-3 p-3 mb-2 bg-[#F5F1EE] rounded-2xl overflow-hidden">
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user.user_metadata?.full_name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="flex items-center justify-center gap-2 p-3 rounded-2xl hover:bg-red-50 text-red-600 w-full transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-[#FDFCF8]">
        <Routes>
          <Route path="/" element={<OrdersPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
