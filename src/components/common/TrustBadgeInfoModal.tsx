import React from 'react';
import { X, ShieldCheck, Award, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TrustBadgeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrustBadgeInfoModal: React.FC<TrustBadgeInfoModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">EduVault Trust Framework</h3>
              <p className="text-xs text-slate-400">Understanding our 3 distinct verification statuses</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Explanation List */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* 1. AI Verified */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>✓ AI Verified</span>
            </div>
            <p className="text-emerald-900 leading-relaxed">
              The material passed an automated verification pipeline checking for factual consistency, mathematical and asymptotic complexity correctness, absence of deprecated or obsolete APIs, and alignment with modern curriculum standards.
            </p>
          </div>

          {/* 2. Faculty Reviewed */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-indigo-950">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <Award className="w-4 h-4 text-indigo-600" />
              <span>✓ Faculty Reviewed</span>
            </div>
            <p className="text-indigo-900 leading-relaxed">
              A certified professor, lecturer, or subject matter expert with verified credentials has personally reviewed the explanations, problem formulations, and pedagogical structure.
            </p>
          </div>

          {/* 3. Institution Verified */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>✓ Institution Verified</span>
            </div>
            <p className="text-amber-900 leading-relaxed">
              The educator published this resource from an accredited school, college, or university account verified via institutional DNS email (.edu, .ac.in) and registrar documentation.
            </p>
          </div>

          {/* Trust Transparency Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Transparency Statement:</strong> AI verification assists quality assurance and checks against known academic literature, but does not claim infallibility. We encourage active peer feedback and faculty review.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
            >
              Understood
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
