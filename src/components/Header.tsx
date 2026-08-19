import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white p-4 rounded-2xl border border-[#E6CCB2] shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#3C2A21] rounded-full flex items-center justify-center text-[#D4A373]">
          <span className="font-serif italic font-bold text-xl">B</span>
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight">Brew & Bean</h1>
      </div>
      
      <nav className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest opacity-70">
        <a href="#" className="hover:opacity-100 text-[#D4A373] transition-opacity">Menu</a>
        <a href="#" className="hover:opacity-100 transition-opacity">Orders</a>
        <a href="#" className="hover:opacity-100 transition-opacity">Locations</a>
        <a href="#" className="hover:opacity-100 transition-opacity">About</a>
      </nav>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative px-4 py-2 bg-[#F5F1EE] rounded-full border border-[#E6CCB2] text-xs font-bold uppercase">
          <span className="mr-2 opacity-50 font-normal">Order:</span> 
          <span>---</span>
        </div>
        <div className="w-10 h-10 bg-[#D4A373] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#c29262] transition-colors">
          <ShoppingBag size={20} />
        </div>
      </div>
    </header>
  );
}
