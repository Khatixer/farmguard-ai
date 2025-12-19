
import React, { useState } from 'react';
import { Leaf, Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2, Ruler, Sprout, Briefcase } from 'lucide-react';
import { User as UserType } from '../types';
import { handleSignUp, handleLogin } from '../supabaseClient';

interface AuthProps {
  onAuthSuccess: (user: UserType) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    farmSize: '1',
    mainCrop: '',
    experienceYears: '1',
    farmType: 'Organic' as 'Organic' | 'Traditional' | 'Hydroponic',
    preferredContact: 'Email' as 'Email' | 'Phone' | 'WhatsApp'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Handle Login
        const result = await handleLogin(formData.email, formData.password);

        if (result.success && result.user) {
          // Check if we have stored signup data for this user
          const storedProfile = localStorage.getItem(`farmguard_signup_${result.user.id}`);
          let profileData = null;

          if (storedProfile) {
            try {
              profileData = JSON.parse(storedProfile);
              // Clean up the stored signup data
              localStorage.removeItem(`farmguard_signup_${result.user.id}`);
            } catch (e) {
              console.error('Error parsing stored profile:', e);
            }
          }

          // Create user object from Supabase data and stored profile data
          const user: UserType = {
            name: result.profile?.farm_name || profileData?.name || result.user.email?.split('@')[0] || 'Farmer',
            email: result.user.email || formData.email,
            phone: profileData?.phone || '+1 234 567 890',
            location: profileData?.location || 'Green Valley',
            farmSize: result.profile?.farm_size || profileData?.farmSize || 1,
            mainCrop: result.profile?.main_crop || profileData?.mainCrop || 'Mixed crops',
            experienceYears: profileData?.experienceYears || 1,
            farmType: profileData?.farmType || 'Organic',
            preferredContact: profileData?.preferredContact || 'Email',
            bio: profileData?.bio || `Sustainable farming expert focusing on ${result.profile?.main_crop || profileData?.mainCrop || 'high-yield crops'}.`
          };

          localStorage.setItem('farmguard_user', JSON.stringify(user));
          onAuthSuccess(user);
        } else {
          alert(result.error || 'Login failed');
        }
      } else {
        // Handle Signup
        const profileData = {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          farmSize: Number(formData.farmSize),
          mainCrop: formData.mainCrop,
          experienceYears: Number(formData.experienceYears),
          farmType: formData.farmType,
          preferredContact: formData.preferredContact,
          bio: `Sustainable ${formData.farmType.toLowerCase()} farming expert focusing on ${formData.mainCrop || 'high-yield crops'}.`
        };

        const result = await handleSignUp(formData.email, formData.password, profileData);

        if (result.success) {
          // Store the complete profile data locally for when user logs in
          const completeUserProfile = {
            name: profileData.name,
            email: formData.email,
            phone: profileData.phone,
            location: profileData.location,
            farmSize: profileData.farmSize,
            mainCrop: profileData.mainCrop,
            experienceYears: profileData.experienceYears,
            farmType: profileData.farmType,
            preferredContact: profileData.preferredContact,
            bio: profileData.bio
          };

          // Store with user ID as key so we can retrieve it during login
          localStorage.setItem(`farmguard_signup_${result.user?.id}`, JSON.stringify(completeUserProfile));

          alert(result.message);
          // Switch to login mode after successful signup
          setIsLogin(true);
        } else {
          alert(result.error || 'Signup failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 overflow-y-auto no-scrollbar py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="bg-emerald-600 w-16 h-16 rounded-[22px] flex items-center justify-center mx-auto shadow-xl shadow-emerald-200 dark:shadow-none mb-4">
            <Leaf className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            FarmGuard <span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {isLogin ? 'Welcome back, Farmer!' : 'Join the organic revolution'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="space-y-4">
            {!isLogin && (
              <AuthInput icon={User} placeholder="Full Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} required />
            )}

            <AuthInput icon={Mail} type="email" placeholder="Email Address" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} required />
            <AuthInput icon={Lock} type="password" placeholder="Password" value={formData.password} onChange={v => setFormData({ ...formData, password: v })} required />

            {!isLogin && (
              <>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Farm & Experience</p>
                  <div className="grid grid-cols-1 gap-4">
                    <AuthInput icon={Phone} placeholder="Phone Number" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
                    <AuthInput icon={MapPin} placeholder="Farm Location" value={formData.location} onChange={v => setFormData({ ...formData, location: v })} />
                    <div className="grid grid-cols-2 gap-3">
                      <AuthInput icon={Ruler} type="number" placeholder="Acres" value={formData.farmSize} onChange={v => setFormData({ ...formData, farmSize: v })} />
                      <AuthInput icon={Briefcase} type="number" placeholder="Years" value={formData.experienceYears} onChange={v => setFormData({ ...formData, experienceYears: v })} />
                    </div>
                    <AuthInput icon={Sprout} placeholder="Primary Crop (e.g. Tomato)" value={formData.mainCrop} onChange={v => setFormData({ ...formData, mainCrop: v })} />

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Farm Strategy</label>
                      <div className="flex bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl gap-1">
                        {['Organic', 'Traditional', 'Hydroponic'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, farmType: type as any })}
                            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${formData.farmType === type ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-100 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                {isLogin ? 'Login' : 'Create Account'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pb-8">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-600 dark:text-emerald-400 font-black text-sm hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AuthInput = ({ icon: Icon, type = 'text', placeholder, value, onChange, required = false }: { icon: any, type?: string, placeholder: string, value: string, onChange: (v: string) => void, required?: boolean }) => (
  <div className="relative">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
    <input
      required={required}
      type={type}
      value={value}
      placeholder={placeholder}
      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 dark:text-white border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-sm placeholder:text-slate-300 dark:placeholder:text-slate-600"
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Auth;
