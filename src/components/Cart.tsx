import React from 'react';
import { Coffee, Croissant } from 'lucide-react';

export default function Cart() {
  return (
    <>
      <h2 className="font-serif text-xl italic mb-4">Cart</h2>
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
        <div className="flex gap-3 items-center pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-[#F5F1EE] rounded-xl flex items-center justify-center text-lg">
            <Coffee size={24} color="#3C2A21" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Vanilla Latte</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Medium • Oat • Extra Shot</p>
          </div>
          <p className="text-sm font-bold">₱185</p>
        </div>
        
        <div className="flex gap-3 items-center pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-[#F5F1EE] rounded-xl flex items-center justify-center text-lg">
            <Croissant size={24} color="#3C2A21" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Butter Croissant</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Warm • Salted</p>
          </div>
          <p className="text-sm font-bold">₱95</p>
        </div>
      </div>
      
      <div className="pt-6 border-t border-[#E6CCB2] space-y-2 mt-auto">
        <div className="flex justify-between text-xs opacity-60">
          <span>Subtotal</span>
          <span>₱280.00</span>
        </div>
        <div className="flex justify-between text-xs opacity-60">
          <span>Delivery Fee</span>
          <span>₱45.00</span>
        </div>
        <div className="flex justify-between text-lg font-serif font-bold pt-2 border-t border-dashed border-[#E6CCB2]">
          <span>Total</span>
          <span>₱325.00</span>
        </div>
        <button className="w-full mt-4 bg-[#3C2A21] text-[#D4A373] py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:brightness-110 shadow-lg shadow-[#3c2a2144] transition-all">
          Checkout Now
        </button>
      </div>
    </>
  );
}
