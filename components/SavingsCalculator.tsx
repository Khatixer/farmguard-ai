
import React, { useState } from 'react';
import { DollarSign, ChevronLeft, TrendingUp } from 'lucide-react';

interface SavingsCalculatorProps {
  onBack: () => void;
}

const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ onBack }) => {
  const [area, setArea] = useState<number>(1);
  const [yieldPerArea, setYieldPerArea] = useState<number>(500);
  const [marketPrice, setMarketPrice] = useState<number>(2);

  const potentialLoss = area * yieldPerArea * marketPrice * 0.4;
  const aiSavings = potentialLoss * 0.85;

  return (
    <div className="p-6 space-y-6 pb-24 animate-in fade-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">Savings Calculator</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <CalcInput label="Total Farm Area (Acres)" value={area} onChange={v => setArea(v)} />
        <CalcInput label="Estimated Yield (kg per Acre)" value={yieldPerArea} onChange={v => setYieldPerArea(v)} />
        <CalcInput label="Market Price ($ per kg)" value={marketPrice} onChange={v => setMarketPrice(v)} icon={DollarSign} />
      </div>

      <div className="bg-emerald-600 p-8 rounded-[48px] text-white space-y-6 shadow-2xl shadow-emerald-200 dark:shadow-none border border-emerald-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-lg">Estimated Benefit</h3>
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">AI-Driven Impact</p>
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-[32px] border border-white/10 backdrop-blur-sm">
          <p className="text-4xl font-black tracking-tighter">${aiSavings.toLocaleString()}</p>
          <p className="text-xs text-emerald-100 mt-2 font-medium">Potential crop value saved by immediate AI diagnosis and organic treatment.</p>
        </div>
      </div>
    </div>
  );
};

const CalcInput = ({ label, value, onChange, icon: Icon }: { label: string, value: number, onChange: (v: number) => void, icon?: any }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
      <input 
        type="number" 
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-black text-lg text-slate-900 dark:text-white transition-all ${Icon ? 'pl-11' : ''}`}
      />
    </div>
  </div>
);

export default SavingsCalculator;
