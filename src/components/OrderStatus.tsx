import React from 'react';
import { Loader2 } from 'lucide-react';

export default function OrderStatus() {
  return (
    <>
      <div className="flex-1 text-white">
        <p className="text-[#D4A373] text-xs font-bold uppercase tracking-widest mb-2">Status: Preparing</p>
        <h4 className="text-2xl font-serif italic mb-1">Order ORD-2026-001</h4>
        <p className="text-xs opacity-60">Estimated pickup time: 10-15 mins</p>
      </div>
      
      <div className="hidden md:flex gap-2">
        <div className="w-12 h-1 text-[#D4A373] bg-[#D4A373] rounded-full shadow-[0_0_8px_#D4A373]"></div>
        <div className="w-12 h-1 bg-[#D4A373] rounded-full opacity-30"></div>
        <div className="w-12 h-1 bg-[#D4A373] rounded-full opacity-30"></div>
      </div>
      
      <div className="w-16 h-16 md:w-20 md:h-20 bg-[#D4A373] rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(212,163,115,0.5)]">
        <Loader2 size={32} className="animate-spin-slow" />
      </div>
    </>
  );
}
