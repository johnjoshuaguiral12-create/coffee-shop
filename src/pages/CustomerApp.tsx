import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Categories from '../components/Categories';
import FeaturedProduct from '../components/FeaturedProduct';
import Cart from '../components/Cart';
import PaymentWidget from '../components/PaymentWidget';
import OrderStatus from '../components/OrderStatus';

// Temporary mock data to test the layout
const MOCK_CATEGORIES = [
  { id: '1', name: 'Hot Coffee', order: 1, isActive: true, icon: '☕' },
  { id: '2', name: 'Iced Coffee', order: 2, isActive: true, icon: '🧊' },
  { id: '3', name: 'Non-Coffee', order: 3, isActive: true, icon: '🍵' },
  { id: '4', name: 'Pastries', order: 4, isActive: true, icon: '🥐' },
];

export default function CustomerApp() {
  const [activeCategory, setActiveCategory] = useState<string>('1');

  return (
    <div className="w-full min-h-screen bg-[#FDFCF8] text-[#3C2A21] font-sans p-4 md:p-6 flex flex-col gap-6 mx-auto max-w-[1400px]">
      <Header />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 grid-rows-none md:grid-rows-6 gap-6 h-auto md:h-[800px]">
        {/* Categories Sidebar */}
        <section className="col-span-1 md:col-span-3 row-span-1 md:row-span-6 bg-white rounded-3xl border border-[#E6CCB2] p-6 flex flex-col gap-4 overflow-hidden shadow-sm">
          <Categories 
            categories={MOCK_CATEGORIES} 
            activeCategory={activeCategory} 
            onSelectCategory={setActiveCategory} 
          />
        </section>

        {/* Featured / Product Area */}
        <section className="col-span-1 md:col-span-6 row-span-1 md:row-span-4 bg-white rounded-3xl border border-[#E6CCB2] p-8 flex flex-col relative overflow-hidden shadow-sm">
          <FeaturedProduct />
        </section>

        {/* Cart */}
        <section className="col-span-1 md:col-span-3 row-span-1 md:row-span-4 bg-white rounded-3xl border border-[#E6CCB2] p-6 flex flex-col shadow-sm">
          <Cart />
        </section>

        {/* Payment / Info Widget */}
        <section className="col-span-1 md:col-span-3 row-span-1 md:row-span-2 bg-[#D4A373] rounded-3xl p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-sm">
          <PaymentWidget />
        </section>

        {/* Order Status */}
        <section className="col-span-1 md:col-span-6 row-span-1 md:row-span-2 bg-[#3C2A21] rounded-3xl p-6 flex items-center gap-8 shadow-sm">
          <OrderStatus />
        </section>
      </main>
    </div>
  );
}
