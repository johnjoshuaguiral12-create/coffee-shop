import React from 'react';
import { Coffee } from 'lucide-react';

export default function FeaturedProduct() {
  return (
    <>
      <div className="flex justify-between items-start z-10">
        <div>
          <p className="text-[#D4A373] font-bold uppercase tracking-tighter text-sm mb-1">Featured Choice</p>
          <h3 className="text-4xl font-serif font-bold mb-2">Vanilla Oatmilk Latte</h3>
          <p className="text-gray-500 max-w-xs text-sm leading-relaxed">Smooth espresso with velvety oat milk and a touch of organic vanilla bean syrup.</p>
        </div>
        <div className="text-3xl font-serif font-bold">₱185.00</div>
      </div>
      
      <div className="flex-1 flex items-center justify-center z-0 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#F5F1EE] to-transparent opacity-50 rounded-full scale-110"></div>
        <div className="w-64 h-64 bg-[#E6CCB2] rounded-full border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="text-8xl"><Coffee size={100} color="#3C2A21" /></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 z-10">
        <div className="bg-[#F5F1EE] p-4 rounded-2xl">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Select Size</p>
          <div className="flex justify-between bg-white p-1 rounded-xl border border-[#E6CCB2]">
            <button className="flex-1 py-1 text-xs font-bold hover:bg-gray-50 rounded-lg">S</button>
            <button className="flex-1 py-1 text-xs font-bold bg-[#3C2A21] text-white rounded-lg">M</button>
            <button className="flex-1 py-1 text-xs font-bold hover:bg-gray-50 rounded-lg">L</button>
          </div>
        </div>
        <div className="bg-[#F5F1EE] p-4 rounded-2xl">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Milk Option</p>
          <div className="flex justify-between bg-white p-1 rounded-xl border border-[#E6CCB2]">
            <button className="flex-1 py-1 text-[10px] font-bold hover:bg-gray-50 rounded-lg">Dairy</button>
            <button className="flex-1 py-1 text-[10px] font-bold bg-[#3C2A21] text-white rounded-lg">Oat</button>
            <button className="flex-1 py-1 text-[10px] font-bold hover:bg-gray-50 rounded-lg">Almond</button>
          </div>
        </div>
      </div>
    </>
  );
}
