import { supabase } from './supabase';
import { Product, Order, Setting, Category } from '../types';

// ==========================================
// PRODUCTS
// ==========================================
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const fetch = async () => {
    const { data } = await supabase.from('products').select('*').order('name');
    if (data) callback(data as Product[]);
  };
  fetch();
  const channel = supabase.channel('products_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetch)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};

export const saveProduct = async (product: Omit<Product, 'id'>, id?: string) => {
  const payload = {
    name: product.name,
    price: product.price,
    category_id: product.category_id,
    isActive: product.isActive,
    description: product.description || '',
    image_url: product.image_url || '',
    customizations: product.customizations || []
  };

  if (id) {
    await supabase.from('products').update({ ...payload, updatedAt: new Date().toISOString() }).eq('id', id);
  } else {
    await supabase.from('products').insert([{ ...payload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
  }
};

export const deleteProduct = async (id: string) => {
  await supabase.from('products').delete().eq('id', id);
};

// ==========================================
// CATEGORIES
// ==========================================
export const subscribeToCategories = (callback: (cats: Category[]) => void) => {
  const fetch = async () => {
    const { data } = await supabase.from('categories').select('*').order('order');
    if (data) callback(data as Category[]);
  };
  fetch();
  const channel = supabase.channel('categories_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetch)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};

export const saveCategory = async (cat: Omit<Category, 'id'>, id: string) => {
  // Assuming id could be "cat_hot" etc.
  await supabase.from('categories').upsert([{ id, ...cat }]);
};

// ==========================================
// SETTINGS
// ==========================================
export const subscribeToSettings = (callback: (setting: Setting | null) => void) => {
  const fetch = async () => {
    const { data } = await supabase.from('settings').select('*').eq('id', 'global').single();
    callback((data as Setting) || null);
  };
  fetch();
  const channel = supabase.channel('settings_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetch)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};

export const saveSettings = async (settings: Partial<Setting>) => {
  await supabase.from('settings').upsert([{ id: 'global', ...settings }]);
};

// ==========================================
// ORDERS
// ==========================================
export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  const fetch = async () => {
    const { data } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
    if (data) callback(data as Order[]);
  };
  fetch();
  const channel = supabase.channel('orders_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetch)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};

export const createOrder = async (order: Omit<Order, 'id'>) => {
  const { data, error } = await supabase.from('orders').insert([order]).select('id').single();
  
  if (!error && data) {
    // Trigger webhook if available
    const { data: settings } = await supabase.from('settings').select('*').eq('id', 'global').single();
    if (settings?.webhookUrl) {
      try {
        await fetch(settings.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
      } catch (webhookErr) {
        console.error("Failed to trigger webhook", webhookErr);
      }
    }
    return data.id;
  }
  return null;
};

export const updateOrderStatus = async (id: string, updates: Partial<Order>) => {
  await supabase.from('orders').update({ ...updates, updatedAt: new Date().toISOString() }).eq('id', id);
};
