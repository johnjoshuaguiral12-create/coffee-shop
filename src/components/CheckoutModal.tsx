import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { createOrder, subscribeToSettings } from '../lib/api';
import { Setting } from '../types';
import { X, MapPin, Store, CreditCard, Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface CheckoutModalProps {
  onClose: () => void;
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { cart, getCartSubtotal, clearCart } = useStore();
  const [settings, setSettings] = useState<Setting | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: 'Pickup' as 'Pickup' | 'Delivery',
    address: '',
    notes: '',
    paymentMethod: 'GCash' as 'GCash' | 'Card',
    paymentReference: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setForm(prev => ({
          ...prev,
          name: session.user.user_metadata?.full_name || prev.name,
          email: session.user.email || prev.email
        }));
      }
    });
  }, []);

  useEffect(() => {
    const unsub = subscribeToSettings(setSettings);
    return () => unsub();
  }, []);

  const subtotal = getCartSubtotal();
  const deliveryFee = form.orderType === 'Delivery' ? 50 : 0;
  const total = subtotal + deliveryFee;

  const handleNext = () => {
    if (step === 1) {
      if (!form.name || !form.phone || !form.email) return alert('Please fill in all required details.');
      if (form.orderType === 'Delivery' && !form.address) return alert('Delivery address is required.');
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (form.paymentMethod === 'GCash' && !form.paymentReference) {
      return alert('Please enter your GCash reference number to proceed.');
    }

    setLoading(true);

    const orderIdStr = `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const orderData = {
      orderId: orderIdStr,
      userId: user?.id || 'guest',
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      items: cart,
      totalAmount: total,
      paymentMethod: form.paymentMethod,
      paymentStatus: form.paymentMethod === 'GCash' ? 'For Verification' : 'Paid',
      orderStatus: 'Pending',
      orderType: form.orderType,
      address: form.address,
      notes: form.notes,
      paymentReference: form.paymentReference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docId = await createOrder(orderData as any);
    
    if (docId) {
      setSuccessOrderId(orderIdStr);
      clearCart();
    } else {
      alert('Failed to submit order. Please try again.');
    }
    setLoading(false);
  };

  const login = async () => {
    try {
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    } catch (e) {
      console.error(e);
    }
  };

  if (successOrderId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-[2rem] w-full max-w-md p-8 text-center shadow-2xl animate-in zoom-in-95">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#3C2A21] mb-2">Order Received!</h2>
          <p className="text-gray-500 mb-6">Thank you for your order. We are preparing it with care.</p>
          
          <div className="bg-[#F5F1EE] p-4 rounded-2xl mb-8 border border-[#E6CCB2] text-left">
            <p className="text-[10px] uppercase font-bold text-gray-500">Order Number</p>
            <p className="text-xl font-mono font-bold text-[#3C2A21] mb-4">{successOrderId}</p>
            
            <p className="text-[10px] uppercase font-bold text-gray-500">Total Paid</p>
            <p className="text-xl font-serif font-bold text-[#3C2A21]">₱{total.toFixed(2)}</p>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-[#3C2A21] text-[#D4A373] py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E6CCB2] flex justify-between items-center bg-[#FDFCF8] rounded-t-[2rem]">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#3C2A21]">Checkout</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
              Step {step} of 2: {step === 1 ? 'Details' : 'Payment'}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white border border-[#E6CCB2] rounded-full flex items-center justify-center hover:bg-[#F5F1EE] transition-colors">
            <X size={20} className="text-[#3C2A21]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-6">
              
              {!user && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-blue-900">Have an account?</p>
                    <p className="text-xs text-blue-700">Sign in for faster checkout.</p>
                  </div>
                  <button onClick={login} className="text-xs font-bold uppercase bg-white px-4 py-2 rounded-lg text-blue-700 shadow-sm">
                    Sign In
                  </button>
                </div>
              )}

              {/* Order Type */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Order Type</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setForm({...form, orderType: 'Pickup'})}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      form.orderType === 'Pickup' ? 'border-[#3C2A21] bg-[#F5F1EE]' : 'border-gray-200 hover:border-[#E6CCB2]'
                    }`}
                  >
                    <Store size={24} className={form.orderType === 'Pickup' ? 'text-[#3C2A21]' : 'text-gray-400'} />
                    <span className={`text-sm font-bold ${form.orderType === 'Pickup' ? 'text-[#3C2A21]' : 'text-gray-500'}`}>Store Pickup</span>
                  </button>
                  <button 
                    onClick={() => setForm({...form, orderType: 'Delivery'})}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      form.orderType === 'Delivery' ? 'border-[#3C2A21] bg-[#F5F1EE]' : 'border-gray-200 hover:border-[#E6CCB2]'
                    }`}
                  >
                    <MapPin size={24} className={form.orderType === 'Delivery' ? 'text-[#3C2A21]' : 'text-gray-400'} />
                    <span className={`text-sm font-bold ${form.orderType === 'Delivery' ? 'text-[#3C2A21]' : 'text-gray-500'}`}>Delivery</span>
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Your Details</p>
                <div className="space-y-3">
                  <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-[#FDFCF8] border border-[#E6CCB2] p-4 rounded-xl outline-none focus:border-[#D4A373] transition-colors" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full bg-[#FDFCF8] border border-[#E6CCB2] p-4 rounded-xl outline-none focus:border-[#D4A373] transition-colors" />
                    <input type="tel" placeholder="Mobile Number" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full bg-[#FDFCF8] border border-[#E6CCB2] p-4 rounded-xl outline-none focus:border-[#D4A373] transition-colors" />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {form.orderType === 'Delivery' && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Delivery Address</p>
                  <textarea 
                    placeholder="Complete address (House number, Street, Barangay, City)" 
                    value={form.address} 
                    onChange={(e) => setForm({...form, address: e.target.value})} 
                    className="w-full bg-[#FDFCF8] border border-[#E6CCB2] p-4 rounded-xl outline-none focus:border-[#D4A373] transition-colors resize-none h-24" 
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Special Instructions</p>
                <input type="text" placeholder="e.g. Less ice please" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="w-full bg-[#FDFCF8] border border-[#E6CCB2] p-4 rounded-xl outline-none focus:border-[#D4A373] transition-colors" />
              </div>

            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Payment Method */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Payment Method</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button 
                    onClick={() => setForm({...form, paymentMethod: 'GCash'})}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      form.paymentMethod === 'GCash' ? 'border-[#3C2A21] bg-[#F5F1EE]' : 'border-gray-200 hover:border-[#E6CCB2]'
                    }`}
                  >
                    <Wallet size={24} className={form.paymentMethod === 'GCash' ? 'text-[#3C2A21]' : 'text-gray-400'} />
                    <span className={`text-sm font-bold ${form.paymentMethod === 'GCash' ? 'text-[#3C2A21]' : 'text-gray-500'}`}>GCash</span>
                  </button>
                  <button 
                    onClick={() => setForm({...form, paymentMethod: 'Card'})}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      form.paymentMethod === 'Card' ? 'border-[#3C2A21] bg-[#F5F1EE]' : 'border-gray-200 hover:border-[#E6CCB2]'
                    }`}
                  >
                    <CreditCard size={24} className={form.paymentMethod === 'Card' ? 'text-[#3C2A21]' : 'text-gray-400'} />
                    <span className={`text-sm font-bold ${form.paymentMethod === 'Card' ? 'text-[#3C2A21]' : 'text-gray-500'}`}>Credit Card</span>
                  </button>
                </div>

                {form.paymentMethod === 'GCash' ? (
                  <div className="bg-[#F5F1EE] rounded-2xl border border-[#E6CCB2] p-6 text-center">
                    <h3 className="font-bold text-lg text-[#3C2A21] mb-4">Pay using GCash</h3>
                    
                    {settings?.gcashQrUrl ? (
                      <img src={settings.gcashQrUrl} alt="GCash QR" className="w-48 h-48 mx-auto mb-4 rounded-xl shadow-md bg-white p-2 object-contain" />
                    ) : (
                      <div className="w-48 h-48 mx-auto mb-4 rounded-xl border-2 border-dashed border-[#D4A373] flex items-center justify-center text-gray-400 bg-white p-4 text-sm">
                        QR Code not configured in Admin Settings
                      </div>
                    )}

                    <div className="text-sm text-gray-600 mb-6">
                      <p>Account Name: <strong>Brew & Bean Coffee</strong></p>
                      <p>Number: <strong>{settings?.gcashNumber || '09XXXXXXXXX'}</strong></p>
                      <p className="mt-2 text-xl font-bold text-[#3C2A21]">Amount: ₱{total.toFixed(2)}</p>
                    </div>

                    <div className="text-left">
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Reference Number *</label>
                      <input 
                        type="text" 
                        placeholder="Enter the 13-digit reference number" 
                        value={form.paymentReference} 
                        onChange={(e) => setForm({...form, paymentReference: e.target.value})} 
                        className="w-full bg-white border border-[#E6CCB2] p-4 rounded-xl outline-none focus:border-[#D4A373]" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
                    <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-bold">Card Payments Mocked</p>
                    <p className="text-sm">In a real app, this would integrate with Stripe or PayMongo.</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-[#E6CCB2] flex items-center gap-4 rounded-b-[2rem]">
          {step === 2 && (
            <button 
              onClick={() => setStep(1)}
              className="py-4 px-6 text-[#3C2A21] font-bold uppercase tracking-widest text-xs hover:bg-[#F5F1EE] rounded-xl transition-colors"
            >
              Back
            </button>
          )}
          
          <button 
            onClick={step === 1 ? handleNext : handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#3C2A21] text-[#D4A373] py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : null}
            {step === 1 ? 'Proceed to Payment' : 'Complete Order'}
          </button>
        </div>

      </div>
    </div>
  );
}
