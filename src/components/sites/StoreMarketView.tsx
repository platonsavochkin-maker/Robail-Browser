import React, { useState } from 'react';
import { ShoppingBag, Star, Plus, Check, ShoppingCart, Trash2, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Neural Studio Pro M4',
    category: 'Computers',
    price: 1999,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop',
    description: 'Next-gen silicon workstation designed for local LLM inference and creative development.',
  },
  {
    id: 'p2',
    name: 'Acoustic SoundMaster Wireless',
    category: 'Audio',
    price: 349,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
    description: 'Active noise cancellation headphones with lossless spatial audio streaming.',
  },
  {
    id: 'p3',
    name: 'Cyberpunk CyberDeck Keyboard',
    category: 'Accessories',
    price: 189,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=400&fit=crop',
    description: 'Custom mechanical keyboard with hot-swappable switches and per-key RGB backlighting.',
  },
  {
    id: 'p4',
    name: 'UltraVision 34" Curved OLED',
    category: 'Monitors',
    price: 899,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=400&fit=crop',
    description: '240Hz refresh rate, 0.03ms response time, deep infinite blacks for developers and gamers.',
  },
];

export const StoreMarketView: React.FC = () => {
  const [cart, setCart] = useState<Array<{ product: Product; qty: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Computers', 'Audio', 'Accessories', 'Monitors'];

  const filtered = PRODUCTS.filter(
    (p) => selectedCat === 'All' || p.category === selectedCat
  );

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950 text-white select-none font-sans">
      {/* Store Header */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm text-white">Robail Market</span>
        </div>

        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCat === cat
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold shadow-md hover:bg-amber-400 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Cart ({cart.reduce((a, b) => a + b.qty, 0)})</span>
        </button>
      </header>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-all flex flex-col justify-between"
            >
              <div className="w-full aspect-[4/3] bg-slate-950 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-amber-400 font-semibold">{item.category}</span>
                    <div className="flex items-center text-xs text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-base font-black text-white font-mono">${item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-black text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div className="w-80 bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <h2 className="text-sm font-bold text-white">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                {cart.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-850"
                    >
                      <div className="truncate flex-1 pr-2">
                        <div className="text-xs font-semibold text-white truncate">{item.product.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          ${item.product.price} × {item.qty}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-sm font-bold text-white mb-3">
                <span>Total:</span>
                <span className="font-mono text-amber-400">${total}</span>
              </div>
              <button
                onClick={() => {
                  alert('Thank you for shopping on Robail Market!');
                  setCart([]);
                  setIsCartOpen(false);
                }}
                disabled={cart.length === 0}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold disabled:opacity-40 transition-colors"
              >
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
