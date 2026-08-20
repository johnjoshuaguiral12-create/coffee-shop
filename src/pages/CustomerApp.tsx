import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import Cart from '../components/Cart';
import PaymentWidget from '../components/PaymentWidget';
import OrderStatus from '../components/OrderStatus';
import { subscribeToCategories, subscribeToProducts } from '../lib/api';
import { Category, Product } from '../types';
import { Loader2 } from 'lucide-react';

export default function CustomerApp() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let pLoaded = false;
    let cLoaded = false;
    let cats: Category[] = [];
    
    const checkDone = () => {
      if (pLoaded && cLoaded) {
        setCategories(cats);
        if (cats.length > 0 && !activeCategory) {
          setActiveCategory(cats[0].id);
        }
        setLoading(false);
      }
    };

    const unsubP = subscribeToProducts((data) => {
      setProducts(data);
      pLoaded = true;
      checkDone();
    });

    const unsubC = subscribeToCategories((data) => {
      cats = data;
      cLoaded = true;
      checkDone();
    });

    return () => {
      unsubP();
      unsubC();
    };
  }, [activeCategory]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D4A373] w-12 h-12" />
      </div>
    );
  }

  const activeProducts = products.filter(p => p.category_id === activeCategory);

  return (
    <div className="w-full min-h-screen bg-[#FDFCF8] text-[#3C2A21] font-sans p-4 md:p-6 flex flex-col gap-6 mx-auto max-w-[1400px]">
      <Header />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 grid-rows-none md:grid-rows-6 gap-6 h-auto md:h-[800px]">
        {/* Categories Sidebar */}
        <section className="col-span-1 md:col-span-3 row-span-1 md:row-span-6 bg-white rounded-3xl border border-[#E6CCB2] p-6 flex flex-col gap-4 overflow-hidden shadow-sm">
          <Categories 
            categories={categories} 
            activeCategory={activeCategory} 
            onSelectCategory={setActiveCategory} 
          />
        </section>

        {/* Product Grid Area */}
        <section className="col-span-1 md:col-span-6 row-span-1 md:row-span-4 bg-white rounded-3xl border border-[#E6CCB2] p-6 flex flex-col relative overflow-hidden shadow-sm">
          <ProductGrid products={activeProducts} />
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
