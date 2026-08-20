import React, { useState, useEffect } from 'react';
import { Setting } from '../../types';
import { subscribeToSettings, saveSettings, saveCategory, saveProduct } from '../../lib/api';
import { Loader2, Save, Database } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [form, setForm] = useState({
    webhookUrl: '',
    gcashQrUrl: '',
    gcashNumber: ''
  });

  useEffect(() => {
    const unsub = subscribeToSettings((data) => {
      setSettings(data);
      if (data) {
        setForm({
          webhookUrl: data.webhookUrl || '',
          gcashQrUrl: data.gcashQrUrl || '',
          gcashNumber: data.gcashNumber || ''
        });
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await saveSettings(form);
    setSaving(false);
    alert('Settings saved!');
  };

  const handleSeedMenu = async () => {
    if (!confirm('This will populate the database with the default menu items. Continue?')) return;
    
    setSeeding(true);
    try {
      // 1. Categories
      const categories = [
        { id: 'cat_hot', name: 'Hot Coffee', order: 1, isActive: true, icon: '☕' },
        { id: 'cat_iced', name: 'Iced Coffee', order: 2, isActive: true, icon: '🧊' },
        { id: 'cat_non', name: 'Non-Coffee', order: 3, isActive: true, icon: '🍵' },
        { id: 'cat_pastries', name: 'Pastries', order: 4, isActive: true, icon: '🥐' },
      ];
      
      for (const cat of categories) {
        await saveCategory(cat, cat.id);
      }

      // 2. Customizations
      const coffeeCustomizations = [
        {
          name: "Size",
          options: [
            { name: "Small", price_modifier: 0 },
            { name: "Medium", price_modifier: 20 },
            { name: "Large", price_modifier: 40 }
          ],
          required: true,
          multiple: false
        },
        {
          name: "Sugar Level",
          options: [
            { name: "0%", price_modifier: 0 },
            { name: "25%", price_modifier: 0 },
            { name: "50%", price_modifier: 0 },
            { name: "75%", price_modifier: 0 },
            { name: "100%", price_modifier: 0 }
          ],
          required: true,
          multiple: false
        },
        {
          name: "Milk Options",
          options: [
            { name: "Regular Milk", price_modifier: 0 },
            { name: "Oat Milk", price_modifier: 30 },
            { name: "Almond Milk", price_modifier: 30 }
          ],
          required: false,
          multiple: false
        },
        {
          name: "Add-ons",
          options: [
            { name: "Extra Espresso Shot", price_modifier: 40 },
            { name: "Whipped Cream", price_modifier: 20 },
            { name: "Caramel Syrup", price_modifier: 20 },
            { name: "Chocolate Syrup", price_modifier: 20 }
          ],
          required: false,
          multiple: true
        }
      ];

      // 3. Products
      const products = [
        // Hot Coffee
        { name: 'Americano', description: 'Espresso + hot water', price: 120, category_id: 'cat_hot', isActive: true, customizations: coffeeCustomizations },
        { name: 'Café Latte', description: 'Espresso + steamed milk', price: 140, category_id: 'cat_hot', isActive: true, customizations: coffeeCustomizations },
        { name: 'Cappuccino', description: 'Espresso + steamed milk + milk foam', price: 140, category_id: 'cat_hot', isActive: true, customizations: coffeeCustomizations },
        { name: 'Caramel Macchiato', description: 'Espresso + milk + caramel', price: 160, category_id: 'cat_hot', isActive: true, customizations: coffeeCustomizations },
        { name: 'Mocha', description: 'Espresso + chocolate + steamed milk', price: 160, category_id: 'cat_hot', isActive: true, customizations: coffeeCustomizations },
        // Iced Coffee
        { name: 'Iced Latte', description: 'Espresso + cold milk + ice', price: 150, category_id: 'cat_iced', isActive: true, customizations: coffeeCustomizations },
        { name: 'Iced Caramel Macchiato', description: 'Espresso + milk + caramel + ice', price: 170, category_id: 'cat_iced', isActive: true, customizations: coffeeCustomizations },
        // Non-Coffee
        { name: 'Chocolate', description: 'Rich chocolate + milk', price: 140, category_id: 'cat_non', isActive: true, customizations: coffeeCustomizations },
        { name: 'Matcha Latte', description: 'Matcha + milk', price: 160, category_id: 'cat_non', isActive: true, customizations: coffeeCustomizations },
        { name: 'Strawberry Milk', description: 'Strawberry + fresh milk', price: 150, category_id: 'cat_non', isActive: true, customizations: coffeeCustomizations },
        // Pastries
        { name: 'Butter Croissant', description: 'Flaky, buttery perfection.', price: 95, category_id: 'cat_pastries', isActive: true, customizations: [] },
        { name: 'Chocolate Croissant', description: 'Filled with rich dark chocolate.', price: 110, category_id: 'cat_pastries', isActive: true, customizations: [] },
        { name: 'Cinnamon Roll', description: 'Warm and sweet cinnamon roll.', price: 110, category_id: 'cat_pastries', isActive: true, customizations: [] },
        { name: 'Cheese Danish', description: 'Sweet cheese filled pastry.', price: 105, category_id: 'cat_pastries', isActive: true, customizations: [] },
        { name: 'Garlic Bread', description: 'Toasted garlic herb bread.', price: 90, category_id: 'cat_pastries', isActive: true, customizations: [] },
        // Muffins
        { name: 'Chocolate Chip Muffin', description: 'Classic chocolate chip muffin.', price: 100, category_id: 'cat_pastries', isActive: true, customizations: [] },
        { name: 'Blueberry Muffin', description: 'Bursting with fresh blueberries.', price: 100, category_id: 'cat_pastries', isActive: true, customizations: [] },
        { name: 'Banana Muffin', description: 'Moist banana nut muffin.', price: 95, category_id: 'cat_pastries', isActive: true, customizations: [] },
        { name: 'Double Chocolate Muffin', description: 'For the ultimate chocolate lover.', price: 110, category_id: 'cat_pastries', isActive: true, customizations: [] },
        { name: 'Strawberry Muffin', description: 'Fresh strawberry bits.', price: 105, category_id: 'cat_pastries', isActive: true, customizations: [] },
      ];

      for (const p of products) {
        await saveProduct(p as any);
      }

      alert('Menu seeded successfully!');
    } catch (error) {
      console.error(error);
      alert('Error seeding data. Check console.');
    }
    setSeeding(false);
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#D4A373]" /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3C2A21] mb-2">Settings</h1>
        <p className="text-gray-500 text-sm">Configure your shop settings and integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-[#E6CCB2] p-8 shadow-sm">
          <h2 className="font-serif font-bold text-xl mb-6">Payment & Integrations</h2>
          <form onSubmit={handleSave} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">GCash Number</label>
              <input 
                type="text" 
                value={form.gcashNumber} 
                onChange={(e) => setForm({...form, gcashNumber: e.target.value})}
                placeholder="09956545697"
                className="w-full bg-[#FDFCF8] border border-[#E6CCB2] p-3 rounded-xl outline-none focus:border-[#D4A373] transition-colors" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">GCash QR Image URL</label>
              <input 
                type="text" 
                value={form.gcashQrUrl} 
                onChange={(e) => setForm({...form, gcashQrUrl: e.target.value})}
                placeholder="https://..."
                className="w-full bg-[#FDFCF8] border border-[#E6CCB2] p-3 rounded-xl outline-none focus:border-[#D4A373] transition-colors" 
              />
            </div>

            <div className="pt-4 border-t border-[#E6CCB2]">
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Webhook URL (n8n / Make)</label>
              <p className="text-[10px] text-gray-400 mb-2">Called on every new order.</p>
              <input 
                type="text" 
                value={form.webhookUrl} 
                onChange={(e) => setForm({...form, webhookUrl: e.target.value})}
                placeholder="https://hook.us1.make.com/..."
                className="w-full bg-[#FDFCF8] border border-[#E6CCB2] p-3 rounded-xl outline-none focus:border-[#D4A373] transition-colors" 
              />
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="w-full bg-[#3C2A21] text-[#D4A373] py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save Settings
            </button>
          </form>
        </div>

        <div className="bg-[#F5F1EE] rounded-3xl border border-[#E6CCB2] p-8 shadow-sm h-fit">
          <h2 className="font-serif font-bold text-xl mb-4">Database Tools</h2>
          <p className="text-sm text-gray-600 mb-6">
            If your database is empty, use this tool to quickly populate it with the default categories, customizations, and products.
          </p>
          <button 
            onClick={handleSeedMenu}
            disabled={seeding}
            className="w-full bg-[#A9B388] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            {seeding ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />}
            Seed Initial Menu Data
          </button>
        </div>
      </div>
    </div>
  );
}
