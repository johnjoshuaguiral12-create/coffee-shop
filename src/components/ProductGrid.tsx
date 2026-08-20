import React, { useState } from 'react';
import { Product } from '../types';
import ProductModal from './ProductModal';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center h-full">
        <span className="text-4xl mb-4">☕</span>
        <p>No products available in this category yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#3C2A21]">Menu</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map(product => (
          <div 
            key={product.id} 
            onClick={() => setSelectedProduct(product)}
            className="group bg-white rounded-3xl border border-[#E6CCB2] overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-all hover:border-[#D4A373] flex-shrink-0"
          >
            <div className="h-32 bg-[#F5F1EE] flex items-center justify-center p-4 overflow-hidden relative">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full object-contain group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <div className="w-16 h-16 bg-[#E6CCB2] rounded-full flex items-center justify-center opacity-50 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">☕</span>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-[#3C2A21]">{product.name}</h3>
                <span className="font-bold text-[#D4A373] whitespace-nowrap ml-2">₱{product.price}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">{product.description}</p>
              
              <button className="w-full bg-[#F5F1EE] text-[#3C2A21] py-2 rounded-xl text-xs font-bold uppercase group-hover:bg-[#3C2A21] group-hover:text-[#D4A373] transition-colors">
                Select Options
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}
