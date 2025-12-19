import React, { useState, useEffect, useMemo } from 'react';
import { 
  Camera, BookOpen, BarChart3, Clock, ChevronRight, CheckCircle2, X, Trash2, User, 
  Settings as SettingsIcon, Edit2, Save, LogOut, Bell, Moon, Sun, Smartphone, 
  Eye, PlusCircle, ChefHat, Droplet, MapPin, Phone, Briefcase, Ruler, Sprout, 
  MessageSquare, Info, Mail, Boxes, Leaf as LeafIconLucide 
} from 'lucide-react';
import Scanner from './components/Scanner';
import RemedyBook from './components/RemedyBook';
import ImpactDashboard from './components/ImpactDashboard';
import SavingsCalculator from './components/SavingsCalculator';
import Auth from './components/Auth';
import { DiagnosisResult, AppView, User as UserType, AppSettings, Remedy } from './types';
import { REMEDIES } from './constants';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  notifications: true,
  offlineMode: false,
  highContrast: false
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('scanner');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [history, setHistory] = useState<DiagnosisResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<DiagnosisResult | null>(null);
  const [viewingRemedy, setViewingRemedy] = useState<Remedy | null>(null);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedUser = localStorage.getItem('farmguard_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedHistory = localStorage.getItem('farmguard_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedSettings = localStorage.getItem('farmguard_settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      applyVisualSettings(parsedSettings);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('farmguard_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('farmguard_settings', JSON.stringify(settings));
    applyVisualSettings(settings);
  }, [settings]);

  const applyVisualSettings = (config: AppSettings) => {
    const doc = document.documentElement;
    if (config.theme === 'dark') {
      doc.classList.add('dark');
      doc.classList.remove('light');
    } else {
      doc.classList.remove('dark');
      doc.classList.add('light');
    }
    if (config.highContrast) {
      doc.classList.add('high-contrast');
    } else {
      doc.classList.remove('high-contrast');
    }
  };

  const handleScanResult = (result: DiagnosisResult) => {
    setHistory([result, ...history]);
    setSelectedResult(result);
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(history.filter(item => item.id !== id));
    if (selectedResult?.id === id) setSelectedResult(null);
  };

  const toggleTreated = (id: string) => {
    const updatedHistory = history.map(item => 
      item.id === id ? { ...item, isTreated: !item.isTreated } : item
    );
    setHistory(updatedHistory);
    if (selectedResult?.id === id) {
      setSelectedResult({ ...selectedResult, isTreated: !selectedResult.isTreated });
    }
  };

  const logout = () => {
    localStorage.removeItem('farmguard_user');
    setCurrentUser(null);
    setCurrentView('auth');
  };

  const currentRemedy = useMemo(() => {
    if (!selectedResult) return null;
    const rid = (selectedResult.remedyId || "").toLowerCase().trim();
    const disease = (selectedResult.disease || "").toLowerCase();
    
    let found = REMEDIES.find(r => r.id.toLowerCase() === rid);
    if (!found) {
      found = REMEDIES.find(r => rid.includes(r.id.toLowerCase()) || r.name.toLowerCase().includes(rid));
    }
    if (!found) {
      if (disease.includes('mildew') || disease.includes('blight')) found = REMEDIES.find(r => r.id === 'baking-soda-spray');
      else if (disease.includes('pest') || disease.includes('rust')) found = REMEDIES.find(r => r.id === 'neem-oil-mix');
      else if (disease.includes('aphid') || disease.includes('mite')) found = REMEDIES.find(r => r.id === 'garlic-chili-spray');
    }
    if (!found && disease !== 'healthy' && disease !== 'none') found = REMEDIES[0];
    return found || null;
  }, [selectedResult]);

  if (!currentUser) {
    return <Auth onAuthSuccess={(user) => {
      setCurrentUser(user);
      setCurrentView('scanner');
    }} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'scanner': return <Scanner onResult={handleScanResult} />;
      case 'remedies': return <RemedyBook />;
      case 'impact': return <ImpactDashboard history={history} onOpenCalculator={() => setCurrentView('calculator')} />;
      case 'calculator': return <SavingsCalculator onBack={() => setCurrentView('impact')} />;
      case 'profile':
        return (
          <div className="p-6 space-y-6 pb-32 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Farmer Profile</h2>
              <button 
                onClick={() => {
                  if (isEditingProfile) localStorage.setItem('farmguard_user', JSON.stringify(currentUser));
                  setIsEditingProfile(!isEditingProfile);
                }}
                className="px-5 py-2.5 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-black text-xs rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 active:scale-95 transition-all flex items-center gap-2"
              >
                {isEditingProfile ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                {isEditingProfile ? 'Save' : 'Edit'}
              </button>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-emerald-600 text-white rounded-[32px] flex items-center justify-center font-black text-4xl shadow-xl">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                {isEditingProfile ? (
                  <div className="space-y-4 w-full">
                    <input className="text-center font-black text-xl bg-slate-50 dark:bg-slate-800 border-0 rounded-xl p-3 w-full text-slate-900 dark:text-white" value={currentUser.name} placeholder="Full Name" onChange={e => setCurrentUser({...currentUser, name: e.target.value})} />
                    <textarea className="text-center font-medium text-xs bg-slate-50 dark:bg-slate-800 border-0 rounded-xl p-3 w-full text-slate-500 dark:text-slate-400 h-20 resize-none" value={currentUser.bio} placeholder="Tell us about your farm..." onChange={e => setCurrentUser({...currentUser, bio: e.target.value})} />
                  </div>
                ) : (
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-2xl">{currentUser.name}</h3>
                    <p className="text-emerald-600 font-black uppercase text-[10px] tracking-widest mt-1">{currentUser.farmType} Farming Specialist</p>
                    <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-[250px] mx-auto italic">"{currentUser.bio || 'Passionate about sustainable crop protection.'}"</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <section className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-3 h-3 text-emerald-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Info</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ProfileField icon={Mail} isEditing={isEditingProfile} label="Email Address" value={currentUser.email} onChange={v => setCurrentUser({...currentUser, email: v})} />
                    <ProfileField icon={Phone} isEditing={isEditingProfile} label="Phone Number" value={currentUser.phone} onChange={v => setCurrentUser({...currentUser, phone: v})} />
                    <ProfileField icon={MapPin} isEditing={isEditingProfile} label="Farm Location" value={currentUser.location} onChange={v => setCurrentUser({...currentUser, location: v})} />
                    <ProfileField icon={MessageSquare} isEditing={isEditingProfile} label="Contact Preference" value={currentUser.preferredContact || 'Email'} type="select" options={['Email', 'Phone', 'WhatsApp']} onChange={v => setCurrentUser({...currentUser, preferredContact: v as any})} />
                  </div>
                </section>

                <section className="space-y-4 border-t border-slate-50 dark:border-slate-800 pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Boxes className="w-3 h-3 text-emerald-500" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Farm Details</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ProfileField icon={Sprout} isEditing={isEditingProfile} label="Main Crop" value={currentUser.mainCrop} onChange={v => setCurrentUser({...currentUser, mainCrop: v})} />
                    <ProfileField icon={Ruler} isEditing={isEditingProfile} label="Farm Size (Acres)" value={currentUser.farmSize.toString()} type="number" onChange={v => setCurrentUser({...currentUser, farmSize: Number(v)})} />
                    <ProfileField icon={Briefcase} isEditing={isEditingProfile} label="Experience (Years)" value={currentUser.experienceYears.toString()} type="number" onChange={v => setCurrentUser({...currentUser, experienceYears: Number(v)})} />
                    <ProfileField icon={LeafIconLucide} isEditing={isEditingProfile} label="Farm Strategy" value={currentUser.farmType} type="select" options={['Organic', 'Traditional', 'Hydroponic']} onChange={v => setCurrentUser({...currentUser, farmType: v as any})} />
                  </div>
                </section>
                
                <button onClick={logout} className="w-full py-4 text-red-500 font-black text-sm bg-red-50 dark:bg-red-900/10 rounded-2xl active:scale-95 transition-all mt-4 border border-red-100 dark:border-red-900/20">Sign Out</button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 space-y-8 pb-40 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h2>
            <div className="space-y-6">
              <section className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Accessibility</h4>
                <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <SettingToggle 
                    icon={settings.theme === 'dark' ? Moon : Sun} 
                    label="Dark Mode" 
                    active={settings.theme === 'dark'} 
                    onToggle={() => setSettings({...settings, theme: settings.theme === 'dark' ? 'light' : 'dark'})} 
                  />
                  <SettingToggle 
                    icon={Eye} 
                    label="High Contrast" 
                    active={settings.highContrast} 
                    onToggle={() => setSettings({...settings, highContrast: !settings.highContrast})} 
                  />
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">System</h4>
                <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <SettingToggle 
                    icon={Bell} 
                    label="Notifications" 
                    active={settings.notifications} 
                    onToggle={() => setSettings({...settings, notifications: !settings.notifications})} 
                  />
                  <SettingToggle 
                    icon={Smartphone} 
                    label="Offline AI Mode" 
                    active={settings.offlineMode} 
                    onToggle={() => setSettings({...settings, offlineMode: !settings.offlineMode})} 
                  />
                </div>
              </section>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="p-6 space-y-4 pb-32 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Log History</h2>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl font-black uppercase tracking-widest">{history.length} Logs</span>
            </div>
            {history.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-16 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4">
                <Clock className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed px-4">Build your farm records by scanning your first plant.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} onClick={() => setSelectedResult(item)} className="bg-white dark:bg-slate-900 p-5 rounded-[32px] shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img src={item.imageUrl} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800" alt="Leaf" />
                        {item.isTreated && <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white dark:border-slate-900"><CheckCircle2 className="w-3 h-3" /></div>}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-lg leading-tight">{item.plantName}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{item.disease}</p>
                      </div>
                    </div>
                    <button onClick={(e) => deleteHistoryItem(item.id, e)} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default: return <Scanner onResult={handleScanResult} />;
    }
  };

  return (
    <div className={`min-h-screen max-w-md mx-auto relative flex flex-col`}>
      <header className="p-6 pb-2 flex items-center justify-between z-30 relative shrink-0">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView('scanner')}>
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg">
            <LeafIcon size={20} color="white" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">FarmGuard AI</h1>
        </div>
        <div className="flex gap-2">
          <HeaderBtn active={currentView === 'settings'} onClick={() => setCurrentView('settings')} icon={SettingsIcon} />
          <HeaderBtn active={currentView === 'profile'} onClick={() => setCurrentView('profile')} label={currentUser.name.charAt(0)} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        {renderView()}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 px-6 py-5 flex items-center justify-between z-40 shadow-2xl">
        <NavItem active={currentView === 'history'} icon={Clock} label="Logs" onClick={() => setCurrentView('history')} />
        <NavItem active={currentView === 'remedies'} icon={BookOpen} label="Remedy" onClick={() => setCurrentView('remedies')} />
        <div className="relative -top-10">
          <button onClick={() => { setSelectedResult(null); setCurrentView('scanner'); }} className="bg-emerald-600 w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-emerald-400 dark:shadow-none border-4 border-brand-light dark:border-slate-950 transition-transform active:scale-90"><Camera className="w-8 h-8" /></button>
        </div>
        <NavItem active={currentView === 'impact'} icon={BarChart3} label="Impact" onClick={() => setCurrentView('impact')} />
        <NavItem active={currentView === 'profile'} icon={User} label="Farm" onClick={() => setCurrentView('profile')} />
      </nav>

      {selectedResult && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-50 flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="relative h-72 shrink-0">
              <img src={selectedResult.imageUrl} className="w-full h-full object-cover" alt="Diagnosis" />
              <button onClick={() => setSelectedResult(null)} className="absolute top-6 right-6 bg-black/40 backdrop-blur-xl p-3 rounded-full text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">{selectedResult.disease}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-[10px] mt-2">Identified in {selectedResult.plantName}</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/20 space-y-4">
                <p className="text-emerald-800 dark:text-emerald-300 font-black text-lg">{currentRemedy?.name || (selectedResult.disease === 'Healthy' ? 'Healthy Plant' : 'Finding remedy...')}</p>
                <button 
                  onClick={() => currentRemedy && setViewingRemedy(currentRemedy)} 
                  className="w-full py-4 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 rounded-xl font-black text-sm shadow-sm active:scale-95 border border-emerald-200 dark:border-slate-700 flex items-center justify-center gap-2"
                  disabled={!currentRemedy}
                >
                  View Step-by-Step Recipe <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => toggleTreated(selectedResult.id)} 
                className={`w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 ${
                  selectedResult.isTreated ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 dark:shadow-none'
                }`}
              >
                {selectedResult.isTreated ? <CheckCircle2 className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
                {selectedResult.isTreated ? 'Already Treated' : 'Mark as Treated'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingRemedy && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="bg-emerald-600 p-6 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <ChefHat className="w-6 h-6" />
                <h3 className="text-xl font-black">{viewingRemedy.name}</h3>
              </div>
              <button onClick={() => setViewingRemedy(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 overflow-y-auto no-scrollbar space-y-6 flex-1">
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Ingredients</h4>
                <ul className="space-y-2">
                  {viewingRemedy.ingredients.map((ing, idx) => (
                    <li key={idx} className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />{ing}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Steps</h4>
                {viewingRemedy.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 font-black w-6 h-6 rounded-lg flex items-center justify-center text-[10px] shrink-0">{idx + 1}</div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 pt-0 shrink-0"><button onClick={() => setViewingRemedy(null)} className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-black">Close Recipe</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

const HeaderBtn = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon?: any, label?: string }) => (
  <button onClick={onClick} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'}`}>
    {Icon ? <Icon className="w-5 h-5" /> : <span className="font-black text-sm">{label}</span>}
  </button>
);

const ProfileField = ({ label, value, isEditing, onChange, icon: Icon, type = 'text', options = [] }: { label: string, value: string, isEditing: boolean, onChange: (v: string) => void, icon?: any, type?: 'text' | 'number' | 'select', options?: string[] }) => (
  <div className="space-y-1 group">
    <div className="flex items-center gap-2 ml-1">
      {Icon && <Icon className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 transition-colors" />}
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    </div>
    {isEditing ? (
      type === 'select' ? (
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm appearance-none cursor-pointer">
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" />
      )
    ) : (
      <div className="w-full p-4 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl font-black text-slate-700 dark:text-slate-300 text-sm overflow-hidden text-ellipsis whitespace-nowrap">{value}</div>
    )}
  </div>
);

const SettingToggle = ({ icon: Icon, label, active, onToggle }: { icon: any, label: string, active: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl ${active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-black text-slate-800 dark:text-slate-100 text-sm">{label}</span>
    </div>
    <button onClick={onToggle} className={`w-12 h-7 rounded-full relative transition-all duration-300 border-2 ${active ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-200 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${active ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

const NavItem = ({ active, icon: Icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-emerald-600 scale-110' : 'text-slate-400 opacity-60'}`}>
    <Icon className="w-5.5 h-5.5" />
    <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const LeafIcon = ({ size, color }: { size: number, color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1.8 9.8a7 7 0 0 1-9.8 8.2Z" /><path d="M14 12c-5 1.5-7 10-7 10" />
  </svg>
);

export default App;