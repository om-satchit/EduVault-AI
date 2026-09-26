import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Clipboard, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Zap,
  Globe,
  HelpCircle
} from 'lucide-react';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  clearStoredApiKey, 
  hasStoredApiKey, 
  validateGeminiApiKey,
  getMaskedApiKey 
} from '../../services/geminiKeyService';

interface GeminiApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: () => void;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredApiKey();
      setHasKey(hasStoredApiKey());
      setMaskedKey(getMaskedApiKey());
      setApiKeyInput(stored);
      setValidationResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setApiKeyInput(text.trim());
        setValidationResult(null);
      }
    } catch {
      // Fallback
    }
  };

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKeyInput.trim();

    if (!cleanKey) {
      setValidationResult({
        success: false,
        message: 'Please enter or paste a valid Gemini API key.'
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    const res = await validateGeminiApiKey(cleanKey);
    setIsValidating(false);

    if (res.valid) {
      setStoredApiKey(cleanKey);
      setHasKey(true);
      setMaskedKey(getMaskedApiKey());
      setValidationResult({
        success: true,
        message: '✓ Key verified! Gemini 3.8 Flash is now actively powering all website features.'
      });
      if (onKeyUpdated) onKeyUpdated();
    } else {
      setValidationResult({
        success: false,
        message: `Validation failed: ${res.error || 'Check that your Gemini key is active and has available quota.'}`
      });
    }
  };

  const handleRemoveKey = () => {
    clearStoredApiKey();
    setApiKeyInput('');
    setHasKey(false);
    setMaskedKey('');
    setValidationResult({
      success: true,
      message: 'API Key removed. Platform now running with built-in academic offline engines.'
    });
    if (onKeyUpdated) onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  Link Gemini AI Key
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                Unlock real-time AI translation, voice prep & verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs text-slate-600">

          {/* Current Connection Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            hasKey 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            {hasKey ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-bold text-sm">
                {hasKey ? 'Gemini AI Linked & Operational' : 'Using Built-in Academic Engine'}
              </div>
              <div className="text-xs mt-0.5 opacity-90">
                {hasKey ? (
                  <span>Active Key: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">{maskedKey}</code></span>
                ) : (
                  <span>Paste your Gemini API key below to activate live multi-language note translation (Hindi, Tamil, Telugu, etc.), voice synthesis, and dynamic AI quizzes.</span>
                )}
              </div>
            </div>
            {hasKey && (
              <button
                type="button"
                onClick={handleRemoveKey}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline shrink-0"
              >
                Disconnect
              </button>
            )}
          </div>

          {/* Key Input Form */}
          <form onSubmit={handleTestAndSave} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Google Gemini API Key</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Clipboard className="w-3 h-3" />
                    <span>Paste Key</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste your Gemini API key (starts with AIzaSy...)"
                  className="w-full px-4 py-3 pr-24 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs text-slate-900 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 transition"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>Free tier available at Google AI Studio</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Get a Free API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Validation Feedback */}
            {validationResult && (
              <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in duration-150 ${
                validationResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {validationResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{validationResult.message}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isValidating || !apiKeyInput.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/25 transition disabled:opacity-50 active:scale-95"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Test & Save Key</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Feature Matrix: What this AI key powers */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Features Powered by this Gemini API Key</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100">
                <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span><strong>Multi-Language Notes</strong> (Hindi, Tamil, Telugu, etc.)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span><strong>Voice Narration</strong> translation & scripts</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span><strong>AI Syllabus Verification</strong> & syllabus audit</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100">
                <Zap className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                <span><strong>Explain Simply</strong> (Kid, High School, College)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100">
                <Key className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span><strong>Exam Summary</strong> (5 key takeaway bullets)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span><strong>Dynamic Quizzes</strong> & Flashcards generator</span>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Your key is stored safely in your browser and used only to power features on this website.</span>
          </div>

        </div>

      </div>
    </div>
  );
};
