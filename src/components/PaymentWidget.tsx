import React from 'react';
import { QrCode } from 'lucide-react';

export default function PaymentWidget() {
  return (
    <>
      <div className="relative z-10">
        <p className="text-xs uppercase font-bold tracking-widest opacity-80">Payment via</p>
        <h4 className="text-2xl font-serif font-bold italic mt-1">GCash QR</h4>
      </div>
      
      <div className="absolute top-2 right-2 w-24 h-24 bg-white p-2 rounded-xl border-4 border-[#3C2A21] rotate-6 shadow-md">
        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-gray-400 rounded-md">
          <QrCode size={40} />
        </div>
      </div>
      
      <p className="text-xs leading-tight opacity-90 z-10 max-w-[120px] mt-4">
        Fast, secure, and hassle-free payment.
      </p>
    </>
  );
}
