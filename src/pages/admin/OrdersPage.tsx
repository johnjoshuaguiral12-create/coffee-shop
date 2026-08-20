import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { subscribeToOrders, updateOrderStatus } from '../../lib/api';
import { Loader2, RefreshCcw, Check, Clock, X } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, status: Order['orderStatus']) => {
    await updateOrderStatus(id, { orderStatus: status });
  };

  const handlePaymentConfirm = async (id: string) => {
    await updateOrderStatus(id, { paymentStatus: 'Paid' });
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#D4A373]" /></div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#3C2A21] mb-2">Orders</h1>
          <p className="text-gray-500 text-sm">Manage incoming coffee shop orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-[#E6CCB2] text-center text-gray-500">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-[#E6CCB2] p-6 shadow-sm overflow-hidden flex flex-col md:flex-row gap-6">
              
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 bg-[#F5F1EE] rounded-full text-xs font-bold uppercase tracking-widest text-[#3C2A21] border border-[#E6CCB2]">
                    {order.orderId}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</span>
                  <div className="px-3 py-1 bg-[#D4A373] text-white rounded-full text-xs font-bold uppercase tracking-widest ml-auto">
                    {order.orderType}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-lg">{order.customerName}</h3>
                  <p className="text-sm text-gray-500">{order.customerPhone} • {order.customerEmail}</p>
                  {order.address && <p className="text-sm text-gray-500 mt-1">Address: {order.address}</p>}
                </div>

                <div className="space-y-3 bg-[#FDFCF8] p-4 rounded-2xl border border-gray-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold">{item.quantity}x {item.product.name}</p>
                        {item.customizations.map((c, i) => (
                          <p key={i} className="text-[10px] text-gray-500 uppercase">{c.name}: {c.selectedOption.name}</p>
                        ))}
                      </div>
                      <span className="text-sm font-bold">₱{item.itemTotal * item.quantity}</span>
                    </div>
                  ))}
                  
                  {order.notes && (
                    <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                      <p className="text-xs font-bold text-[#D4A373]">Notes:</p>
                      <p className="text-sm italic">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="w-full md:w-64 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-[#E6CCB2] pt-4 md:pt-0 md:pl-6">
                
                <div className="bg-[#F5F1EE] p-4 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Total Amount</p>
                  <p className="text-2xl font-serif font-bold text-[#3C2A21]">₱{order.totalAmount}</p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">Payment ({order.paymentMethod})</p>
                  <div className="flex gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'For Verification' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                    {order.paymentReference && (
                      <span className="px-2 py-1 rounded text-[10px] bg-gray-100 text-gray-600 font-mono">
                        Ref: {order.paymentReference}
                      </span>
                    )}
                  </div>
                  {order.paymentStatus === 'For Verification' && (
                    <button 
                      onClick={() => handlePaymentConfirm(order.id)}
                      className="w-full py-2 bg-[#A9B388] text-white text-xs font-bold uppercase rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-1"
                    >
                      <Check size={14} /> Confirm Payment
                    </button>
                  )}
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">Order Status: {order.orderStatus}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleStatusChange(order.id, 'Preparing')}
                      disabled={order.orderStatus === 'Preparing'}
                      className="py-2 text-[10px] font-bold uppercase rounded-xl border border-[#3C2A21] text-[#3C2A21] disabled:opacity-30 disabled:bg-gray-100"
                    >
                      Prep
                    </button>
                    <button 
                      onClick={() => handleStatusChange(order.id, 'Ready')}
                      disabled={order.orderStatus === 'Ready'}
                      className="py-2 text-[10px] font-bold uppercase rounded-xl bg-[#3C2A21] text-[#D4A373] disabled:opacity-30"
                    >
                      Ready
                    </button>
                    <button 
                      onClick={() => handleStatusChange(order.id, 'Completed')}
                      disabled={order.orderStatus === 'Completed'}
                      className="py-2 text-[10px] font-bold uppercase rounded-xl bg-green-600 text-white disabled:opacity-30 col-span-2"
                    >
                      Completed
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
