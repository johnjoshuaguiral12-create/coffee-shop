import React from 'react';
import { Category } from '../types';

interface CategoriesProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function Categories({ categories, activeCategory, onSelectCategory }: CategoriesProps) {
  return (
    <>
      <h2 className="font-serif text-xl italic mb-2">Categories</h2>
      <div className="space-y-2 overflow-y-auto pr-2">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <div 
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`p-4 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-[#3C2A21] text-white' 
                  : 'bg-[#F5F1EE] text-[#3C2A21] hover:bg-[#E6CCB2]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                isActive ? 'bg-[#D4A373]' : 'bg-white border border-[#E6CCB2]'
              }`}>
                {cat.icon || '☕'}
              </div>
              <span className="font-medium">{cat.name}</span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-auto p-4 bg-[#A9B388] bg-opacity-20 rounded-2xl border border-[#A9B388]">
        <p className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] mb-1">Special Offer</p>
        <p className="text-sm leading-snug">Get a free butter croissant with any Large Latte!</p>
      </div>
    </>
  );
}
