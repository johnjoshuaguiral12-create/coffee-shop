import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import { subscribeToProducts, subscribeToCategories, deleteProduct } from '../../lib/api';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let prods: Product[] = [];
    let cats: Category[] = [];
    let pLoaded = false;
    let cLoaded = false;

    const checkDone = () => {
      if (pLoaded && cLoaded) {
        setProducts(prods);
        setCategories(cats);
        setLoading(false);
      }
    };

    const unsubP = subscribeToProducts((data) => {
      prods = data;
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
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#D4A373]" /></div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#3C2A21] mb-2">Menu Management</h1>
          <p className="text-gray-500 text-sm">Manage categories and products.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E6CCB2] shadow-sm mb-8 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Want to quickly load the default menu items? Go to the <strong>Settings</strong> page and click <strong>"Seed Initial Menu Data"</strong>.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border border-[#E6CCB2]">
          No categories found. Seed the menu in settings to get started!
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map(category => {
            const catProducts = products.filter(p => p.category_id === category.id);
            
            return (
              <div key={category.id}>
                <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                  <span>{category.icon}</span> {category.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {catProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-3xl border border-[#E6CCB2] overflow-hidden flex flex-col hover:shadow-md transition-all">
                      <div className="h-32 bg-[#F5F1EE] flex items-center justify-center p-4">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="h-full object-contain" />
                        ) : (
                          <div className="w-16 h-16 bg-[#E6CCB2] rounded-full flex items-center justify-center opacity-50">
                            <span className="text-2xl">☕</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-[#3C2A21]">{product.name}</h3>
                          <span className="font-bold text-[#D4A373]">₱{product.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">{product.description}</p>
                        
                        <div className="flex gap-2 mt-auto border-t border-[#E6CCB2] pt-4">
                          <button onClick={() => handleDelete(product.id)} className="flex-1 py-2 text-red-500 text-xs font-bold uppercase hover:bg-red-50 rounded-xl transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
