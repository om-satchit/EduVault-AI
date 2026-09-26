import React from 'react';
import { X, Accessibility, Type, Eye, Volume2, Globe, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../utils/i18n';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onSetFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  dyslexiaFont: boolean;
  onToggleDyslexiaFont: () => void;
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  fontSize,
  onSetFontSize,
  highContrast,
  onToggleHighContrast,
  dyslexiaFont,
  onToggleDyslexiaFont,
  currentLanguage,
  onChangeLanguage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Accessibility className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Accessibility & Language Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Text Size */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-600" />
              Adjust Text Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSetFontSize('normal')}
                className={`py-2 rounded-xl border text-center font-bold transition ${
                  fontSize === 'normal' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Default (100%)
              </button>
              <button
                type="button"
                onClick={() => onSetFontSize('large')}
                className={`py-2 rounded-xl border text-center font-bold transition text-sm ${
                  fontSize === 'large' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Large (115%)
              </button>
              <button
                type="button"
                onClick={() => onSetFontSize('xlarge')}
                className={`py-2 rounded-xl border text-center font-bold transition text-base ${
                  fontSize === 'xlarge' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                X-Large (130%)
              </button>
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-slate-700" />
              <div>
                <span className="font-bold text-slate-900 block">High Contrast Mode</span>
                <span className="text-[11px] text-slate-500">Increases border and text sharpness</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleHighContrast}
              className={`w-11 h-6 rounded-full transition-colors relative ${highContrast ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white block transition-transform shadow-xs ${highContrast ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Dyslexia-Friendly Font */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Type className="w-4 h-4 text-slate-700" />
              <div>
                <span className="font-bold text-slate-900 block">Dyslexia-Friendly Font</span>
                <span className="text-[11px] text-slate-500">Higher letter distinction spacing</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleDyslexiaFont}
              className={`w-11 h-6 rounded-full transition-colors relative ${dyslexiaFont ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white block transition-transform shadow-xs ${dyslexiaFont ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-600" />
              Interface Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => onChangeLanguage(l.code)}
                  className={`p-2 rounded-xl border text-left font-semibold transition flex items-center justify-between ${
                    currentLanguage === l.code ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{l.flag}</span>
                    <span className="text-xs">{l.nativeLabel}</span>
                  </span>
                  {currentLanguage === l.code && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition"
            >
              Save Preferences
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
