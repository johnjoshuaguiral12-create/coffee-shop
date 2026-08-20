import React, { useState } from 'react';
import { Coffee, Trash2, Plus, Minus } from 'lucide-react';
import { useStore } from '../store/useStore';
import CheckoutModal from './CheckoutModal';

export default function Cart() {
  const { cart, getCartSubtotal, updateQuantity, removeFromCart } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = getCartSubtotal();
  const deliveryFee = 0; // Fixed delivery fee if Delivery is chosen, calculated in checkout
  const total = subtotal + deliveryFee;

  return (
    <>
      <h2 className="font-serif text-xl italic mb-4">Cart</h2>
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <span className="text-3xl mb-2">🛍️</span>
            <p className="text-sm">Your cart is empty.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex gap-3 items-center pb-4 border-b border-gray-100 group">
              <div className="w-12 h-12 bg-[#F5F1EE] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.product.image_url ? (
                  <img src={item.product.image_url} alt={item.product.name} className="h-full object-contain" />
                ) : (
                  <Coffee size={24} color="#3C2A21" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{item.product.name}</p>
                <div className="text-[10px] text-gray-400 uppercase tracking-tighter line-clamp-1">
                  {item.customizations.map(c => c.selectedOption.name).join(' • ')}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center bg-[#F5F1EE] rounded border border-[#E6CCB2]">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-6 h-6 flex items-center justify-center hover:bg-white transition-colors"><Minus size={12} /></button>
                    <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white transition-colors"><Plus size={12} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm font-bold whitespace-nowrap">₱{item.itemTotal * item.quantity}</p>
            </div>
          ))
        )}
      </div>
      
      {cart.length > 0 && (
        <div className="pt-6 border-t border-[#E6CCB2] space-y-2 mt-auto flex-shrink-0">
          <div className="flex justify-between text-xs opacity-60">
            <span>Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs opacity-60">
            <span>Delivery Fee</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between text-lg font-serif font-bold pt-2 border-t border-dashed border-[#E6CCB2]">
            <span>Total</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full mt-4 bg-[#3C2A21] text-[#D4A373] py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:brightness-110 shadow-lg shadow-[#3c2a2144] transition-all"
          >
            Checkout Now
          </button>
        </div>
      )}

      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />
      )}
    </>
  );
}
