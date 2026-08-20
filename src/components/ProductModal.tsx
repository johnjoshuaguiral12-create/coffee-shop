import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const addToCart = useStore(state => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  
  // Track selected options: { [groupName]: selectedOptionName | selectedOptionName[] }
  const [selections, setSelections] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    product.customizations?.forEach(group => {
      if (group.multiple) {
        initial[group.name] = [];
      } else if (group.required && group.options.length > 0) {
        initial[group.name] = group.options[0].name; // Default to first
      } else {
        initial[group.name] = null;
      }
    });
    return initial;
  });

  const handleSingleSelect = (groupName: string, optionName: string) => {
    setSelections(prev => ({ ...prev, [groupName]: optionName }));
  };

  const handleMultiSelect = (groupName: string, optionName: string) => {
    setSelections(prev => {
      const current = prev[groupName] as string[];
      if (current.includes(optionName)) {
        return { ...prev, [groupName]: current.filter(n => n !== optionName) };
      } else {
        return { ...prev, [groupName]: [...current, optionName] };
      }
    });
  };

  const calculateTotal = () => {
    let total = product.price;
    product.customizations?.forEach(group => {
      const selection = selections[group.name];
      if (!selection) return;

      if (group.multiple && Array.isArray(selection)) {
        selection.forEach(optName => {
          const opt = group.options.find(o => o.name === optName);
          if (opt) total += opt.price_modifier;
        });
      } else {
        const opt = group.options.find(o => o.name === selection);
        if (opt) total += opt.price_modifier;
      }
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    // Format selections into CartItem customizations
    const formattedCustomizations: any[] = [];
    
    product.customizations?.forEach(group => {
      const selection = selections[group.name];
      if (!selection) return;

      if (group.multiple && Array.isArray(selection)) {
        selection.forEach(optName => {
          const opt = group.options.find(o => o.name === optName);
          if (opt) {
            formattedCustomizations.push({ name: group.name, selectedOption: opt });
          }
        });
      } else {
        const opt = group.options.find(o => o.name === selection);
        if (opt) {
          formattedCustomizations.push({ name: group.name, selectedOption: opt });
        }
      }
    });

    addToCart(product, quantity, formattedCustomizations);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header/Image */}
        <div className="h-48 bg-[#F5F1EE] relative flex items-center justify-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <X size={20} className="text-[#3C2A21]" />
          </button>
          
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-32 object-contain" />
          ) : (
            <div className="text-6xl">☕</div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-2xl font-serif font-bold text-[#3C2A21] mb-2">{product.name}</h2>
          <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-[#E6CCB2]">{product.description}</p>

          {/* Customizations */}
          <div className="space-y-6 mb-6">
            {product.customizations?.map((group, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="font-bold text-[#3C2A21]">{group.name}</h3>
                  {group.required && <span className="text-[10px] uppercase font-bold text-[#D4A373] bg-[#F5F1EE] px-2 py-1 rounded">Required</span>}
                </div>
                
                <div className="space-y-2">
                  {group.options.map((opt, oIdx) => {
                    const isSelected = group.multiple 
                      ? (selections[group.name] as string[])?.includes(opt.name)
                      : selections[group.name] === opt.name;

                    return (
                      <div 
                        key={oIdx}
                        onClick={() => group.multiple ? handleMultiSelect(group.name, opt.name) : handleSingleSelect(group.name, opt.name)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-[#3C2A21] bg-[#F5F1EE]' 
                            : 'border-gray-200 hover:border-[#E6CCB2]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 flex items-center justify-center ${group.multiple ? 'rounded' : 'rounded-full'} border ${
                            isSelected ? 'bg-[#3C2A21] border-[#3C2A21]' : 'border-gray-300'
                          }`}>
                            {isSelected && <div className={`bg-[#D4A373] ${group.multiple ? 'w-2 h-2 rounded-sm' : 'w-2 h-2 rounded-full'}`} />}
                          </div>
                          <span className={`text-sm ${isSelected ? 'font-bold text-[#3C2A21]' : 'text-gray-600'}`}>{opt.name}</span>
                        </div>
                        {opt.price_modifier > 0 && (
                          <span className="text-sm font-bold text-[#D4A373]">+₱{opt.price_modifier}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E6CCB2] flex items-center gap-4">
          <div className="flex items-center bg-[#F5F1EE] rounded-xl p-1 border border-[#E6CCB2]">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-bold">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-[#3C2A21] text-[#D4A373] py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <ShoppingBag size={16} />
            Add to Cart - ₱{calculateTotal()}
          </button>
        </div>

      </div>
    </div>
  );
}
