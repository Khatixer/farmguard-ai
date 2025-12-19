
import React, { useMemo } from 'react';
import { DollarSign, ShieldCheck, Clock, FlaskConical, Calculator, Inbox, Sparkles, CheckCircle } from 'lucide-react';
import { DiagnosisResult } from '../types';

interface ImpactDashboardProps {
  history: DiagnosisResult[];
  onOpenCalculator: () => void;
}

const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ history, onOpenCalculator }) => {
  const metrics = useMemo(() => {
    const treatedItems = history.filter(h => h.isTreated);
    return {
      treatedCount: treatedItems.length,
      yieldSaved: treatedItems.length * 45,
      chemicalsAvoided: treatedItems.length * 0.8,
      timeSaved: history.length * 15,
      historyLength: history.length
    };
  }, [history]);

  const hasHistory = history.length > 0;

  return (
    <div className="p-6 space-y-6 pb-32 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Impact</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-tight">Real-world results of your farm care.</p>
        </div>
        <button 
          onClick={onOpenCalculator}
          className="p-3 bg-emerald-600 text-white rounded-[22px] shadow-lg shadow-emerald-200 dark:shadow-none active:scale-95 transition-all"
        >
          <Calculator className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={DollarSign} 
          value={`$${metrics.yieldSaved}`} 
          label="Yield Saved" 
          color="emerald" 
        />
        <StatCard 
          icon={FlaskConical} 
          value={`${metrics.chemicalsAvoided.toFixed(1)}L`} 
          label="Eco-Savings" 
          color="blue" 
        />
        <StatCard 
          icon={Clock} 
          value={`${(metrics.timeSaved / 60).toFixed(1)}h`} 
          label="Time Gained" 
          color="amber" 
        />
        <StatCard 
          icon={ShieldCheck} 
          value={metrics.treatedCount.toString()} 
          label="Recovered" 
          color="purple" 
        />
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-emerald-100 dark:border-slate-800 space-y-6 transition-all">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900 dark:text-slate-200 flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Impact Summary
          </h3>
        </div>
        
        {hasHistory ? (
          <div className="space-y-5">
            <ImpactRow 
              title="Economic Resilience" 
              desc={`Prevented $${metrics.yieldSaved} in potential crop loss through organic intervention.`} 
              icon={DollarSign}
            />
            <ImpactRow 
              title="Chemical Reduction" 
              desc={`Avoided ${metrics.chemicalsAvoided.toFixed(1)}L of synthetic pesticides using local remedies.`} 
              icon={FlaskConical}
            />
            <ImpactRow 
              title="Diagnosis Speed" 
              desc="Diagnosis reduced from days to seconds, enabling immediate plant recovery." 
              icon={Clock}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 py-12 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-inner">
              <Inbox className="w-12 h-12 opacity-20" />
            </div>
            <div className="text-center space-y-2 px-4">
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-60">No Data Yet</p>
              <p className="text-xs font-medium text-slate-400 max-w-[200px] mx-auto leading-relaxed">Start scanning and treating plants to calculate your total farming impact.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ImpactRow = ({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) => (
  <div className="flex gap-4 group">
    <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-2xl h-fit shrink-0 border border-emerald-100 dark:border-emerald-800/30">
      <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    </div>
    <div className="space-y-1">
      <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, value, label, color }: { icon: any, value: string, label: string, color: string }) => {
  const themes: Record<string, string> = {
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30",
  };

  return (
    <div className={`p-6 rounded-[32px] shadow-sm border flex flex-col items-center text-center space-y-3 transition-all bg-white dark:bg-slate-900 ${themes[color]}`}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-700">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-black tracking-tighter leading-none dark:text-white">{value}</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest leading-tight mt-2">{label}</p>
      </div>
    </div>
  );
};

export default ImpactDashboard;
