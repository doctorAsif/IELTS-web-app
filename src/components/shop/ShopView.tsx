import React, { useState } from 'react';
import { Gem, Heart, Flame, Zap, Shield, Sparkles, Check } from 'lucide-react';
import { SHOP_ITEMS } from '../../data/questsData';
import { useApp } from '../../lib/store';
import { sound } from '../../lib/audio';

export const ShopView: React.FC = () => {
  const { stats, buyShopItem, addGems } = useApp();
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const handleBuy = (id: string, cost: number) => {
    const success = buyShopItem(id, cost);
    if (success) {
      setPurchaseSuccess(id);
      setTimeout(() => setPurchaseSuccess(null), 2500);
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto py-6 px-4 md:px-8 select-none">
      {/* Gem Balance Banner */}
      <div className="flex items-center justify-between p-6 mb-8 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-3xl shadow-md">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-sky-200">
            IELTS Gems Store
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-1">
            Shop Boosters & Power-ups
          </h2>
          <p className="text-xs md:text-sm font-semibold opacity-90 mt-1">
            Use gems earned from lessons & streaks to boost your prep!
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/30">
            <Gem className="w-6 h-6 text-sky-200 fill-sky-200" />
            <span className="font-black text-2xl">{stats.gems}</span>
          </div>
          {/* Quick debug button to get free gems */}
          <button
            onClick={() => {
              sound.playChest();
              addGems(100);
            }}
            className="text-[11px] font-black text-sky-100 hover:text-white underline"
          >
            + Add 100 Test Gems
          </button>
        </div>
      </div>

      {/* Shop Items List */}
      <div className="space-y-4">
        {SHOP_ITEMS.map(item => {
          const canAfford = stats.gems >= item.gemCost;
          const isPurchasedJustNow = purchaseSuccess === item.id;

          return (
            <div
              key={item.id}
              className={`card-duo p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.popular ? 'border-duo-blue/70 bg-blue-50/20' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-duo-gray flex items-center justify-center text-3xl shrink-0 shadow-xs">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-black text-duo-charcoal">
                      {item.title}
                    </h3>
                    {item.popular && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-duo-blue text-white">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-500 mt-1 max-w-md">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Price & Buy Button */}
              <div className="self-end md:self-auto shrink-0">
                {isPurchasedJustNow ? (
                  <div className="flex items-center gap-1.5 px-6 py-3 bg-green-100 text-green-800 font-black text-xs rounded-2xl border border-green-300">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>PURCHASED!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuy(item.id, item.gemCost)}
                    disabled={!canAfford}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
                      canAfford
                        ? 'btn-duo-blue'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed border-b-4 border-gray-300'
                    }`}
                  >
                    <Gem className="w-4 h-4 fill-current" />
                    <span>{item.gemCost} GEMS</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
