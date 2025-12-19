
import React, { useEffect, useRef } from 'react';
import { REMEDIES } from '../constants';
import { ChefHat, Droplet, Check } from 'lucide-react';

interface RemedyBookProps {
  highlightId?: string;
}

const RemedyBook: React.FC<RemedyBookProps> = ({ highlightId }) => {
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (highlightId && scrollRefs.current[highlightId]) {
      // Add a small delay to ensure transitions are finished
      const timer = setTimeout(() => {
        scrollRefs.current[highlightId]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [highlightId]);

  return (
    <div className="p-6 space-y-6 pb-24 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Remedy Recipes</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-tight">Organic alternatives to chemicals.</p>
      </div>

      <div className="space-y-6">
        {REMEDIES.map((remedy) => (
          <div 
            key={remedy.id} 
            // Fix: React callback refs must return void. Wrapping assignment in braces to avoid returning the element.
            ref={el => { scrollRefs.current[remedy.id] = el; }}
            className={`bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border transition-all duration-700 ${
              highlightId === remedy.id 
                ? 'border-emerald-500 ring-[8px] ring-emerald-500/10 scale-[1.02] shadow-xl' 
                : 'border-slate-100 dark:border-slate-700'
            }`}
          >
            <div className="bg-emerald-600 p-6 text-white rounded-t-[40px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl leading-tight">{remedy.name}</h3>
              </div>
              {highlightId === remedy.id && (
                <div className="bg-white text-emerald-700 p-1.5 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            
            <div className="p-7 space-y-6">
              <div className="space-y-3">
                <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-emerald-500" /> Ingredients
                </h4>
                <ul className="space-y-2">
                  {remedy.ingredients.map((ing, idx) => (
                    <li key={idx} className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Preparation Steps</h4>
                <div className="space-y-4">
                  {remedy.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-black w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-700/50">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Target Conditions</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {remedy.targetDisease.split('/').map((tag, i) => (
                    <span key={i} className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RemedyBook;
