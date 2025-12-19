
import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Leaf, AlertCircle } from 'lucide-react';
import { diagnosePlant } from '../services/geminiService';
import { DiagnosisResult } from '../types';

interface ScannerProps {
  onResult: (result: DiagnosisResult) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onResult }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImage = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const aiData = await diagnosePlant(base64);
          if (!aiData.isPlant) {
            setError("The image does not appear to be a plant. Please try again with a clear photo of a leaf.");
            setLoading(false);
            return;
          }
          const result: DiagnosisResult = {
            id: Math.random().toString(36).substr(2, 9),
            plantName: aiData.plantName,
            disease: aiData.disease,
            confidence: aiData.confidence,
            remedyId: aiData.remedyId,
            timestamp: Date.now(),
            imageUrl: base64,
            isTreated: false,
            isPlant: aiData.isPlant
          };
          onResult(result);
        } catch (err) {
          setError("AI analysis failed. Check your internet connection or try a clearer photo.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Error processing file.");
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImage(file);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 animate-in fade-in duration-700">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl shadow-slate-200 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 p-10 text-center space-y-8">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto shadow-inner">
          <Leaf className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 leading-tight tracking-tight">Identify Disease</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed px-4">Diagnose crop issues instantly using your mobile camera.</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-3xl flex items-center gap-3 text-sm text-left border border-red-100 dark:border-red-900/40">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={loading}
            className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[24px] shadow-xl shadow-emerald-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
            {loading ? 'Analyzing...' : 'Open Camera'}
          </button>
          
          <button
            onClick={() => galleryInputRef.current?.click()}
            disabled={loading}
            className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 font-black py-5 rounded-[24px] transition-all disabled:opacity-50 active:scale-95 shadow-sm"
          >
            <Upload className="w-6 h-6" />
            Upload from Gallery
          </button>

          <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={onFileChange} />
          <input type="file" accept="image/*" className="hidden" ref={galleryInputRef} onChange={onFileChange} />
        </div>
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Powered by AI Studio</p>
      </div>
    </div>
  );
};

export default Scanner;
