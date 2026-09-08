import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, ShoppingCart, Database, Layers, ArrowDownUp, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../../services/sound';

interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  sales: number;
}

export const InteractiveRealWorldCards: React.FC = () => {
  const [activeApp, setActiveApp] = useState<string>('ecommerce');

  // E-Commerce live sorter state
  const initialProducts: ProductItem[] = [
    { id: 1, name: 'Mechanical Keyboard RGB', category: 'Hardware', price: 119, rating: 4.8, sales: 1420 },
    { id: 2, name: 'Noise-Canceling Headphones', category: 'Audio', price: 249, rating: 4.9, sales: 3200 },
    { id: 3, name: 'Ergonomic Gaming Mouse', category: 'Hardware', price: 59, rating: 4.5, sales: 2150 },
    { id: 4, name: '4K Ultra-Wide Monitor', category: 'Display', price: 499, rating: 4.7, sales: 890 },
    { id: 5, name: 'USB-C Multiport Hub', category: 'Accessories', price: 39, rating: 4.3, sales: 4500 },
  ];

  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'sales'>('rating');

  const handleSortChange = (criteria: 'price-asc' | 'price-desc' | 'rating' | 'sales') => {
    soundEffects.playClick();
    setSortBy(criteria);
    const sorted = [...products].sort((a, b) => {
      if (criteria === 'price-asc') return a.price - b.price;
      if (criteria === 'price-desc') return b.price - a.price;
      if (criteria === 'rating') return b.rating - a.rating;
      return b.sales - a.sales;
    });
    setProducts(sorted);
  };

  const apps = [
    {
      id: 'ecommerce',
      icon: ShoppingCart,
      title: 'E-Commerce Product Catalogs',
      subtitle: 'Dynamic Multi-Key Filtering & Sorting',
      desc: 'Amazon and Shopify sort billions of catalog entries instantly by Price, Customer Rating, or Relevance using Timsort and index caches.',
    },
    {
      id: 'database',
      icon: Database,
      title: 'Database Engine & ORDER BY',
      subtitle: 'Sort-Merge Joins & External Merge Sort',
      desc: 'PostgreSQL and MySQL process ORDER BY queries and B-Tree index scans with external multi-way merge sort when datasets exceed buffer RAM.',
    },
    {
      id: 'search',
      icon: Globe,
      title: 'Search Engine Retrieval',
      subtitle: 'PageRank & BM25 Relevance Scoring',
      desc: 'Google ranks billions of indexed web documents by computing relevance weights and sorting candidate sets in top-k priority queues.',
    },
    {
      id: 'graphics',
      icon: Layers,
      title: '3D Graphics & Depth Buffering',
      subtitle: "Painter's Algorithm & Z-Sorting",
      desc: 'Game engines sort translucent 3D polygons back-to-front relative to the camera to properly blend alpha transparencies without visual artifacts.',
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ArrowDownUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Real-World Systems Powered by High-Performance Sorting</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          See how commercial operating systems, databases, and e-commerce platforms utilize sorting engines.
        </p>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {apps.map((app) => {
          const Icon = app.icon;
          const isSelected = activeApp === app.id;
          return (
            <button
              key={app.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveApp(app.id);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                <span className="text-xs font-bold truncate">{app.title}</span>
              </div>
              <p className={`text-[11px] leading-tight line-clamp-2 ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {app.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active System Interactive Showcase */}
      {activeApp === 'ecommerce' && (
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/70 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Interactive Catalog Sorter</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Live Stable Sort
                </span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Toggle sorting criteria to observe in-memory item reordering:
              </p>
            </div>

            {/* Criteria Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'rating', label: 'Top Rated' },
                { id: 'price-asc', label: 'Price: Low → High' },
                { id: 'price-desc', label: 'Price: High → Low' },
                { id: 'sales', label: 'Most Popular' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleSortChange(btn.id as any)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    sortBy === btn.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items List */}
          <div className="space-y-2">
            {products.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-bold flex items-center justify-center shrink-0">
                    #{index + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({item.category})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono">
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">
                    ⭐ {item.rating}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {item.sales.toLocaleString()} sold
                  </span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    ${item.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeApp !== 'ecommerce' && (
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {apps.find((a) => a.id === activeApp)?.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {apps.find((a) => a.id === activeApp)?.desc}
          </p>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
            <span>
              Engineers implement hybrid algorithms like Timsort or external K-way merges to process millions of items without stalling user response latency.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
