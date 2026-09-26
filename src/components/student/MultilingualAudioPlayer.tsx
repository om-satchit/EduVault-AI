import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Globe, 
  Sparkles, 
  Check, 
  ChevronDown, 
  Subtitles, 
  Copy, 
  CheckCheck,
  Headphones,
  Sliders,
  Zap
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageOption, getLanguageOption } from '../../services/i18n';
import { translateContentAI } from '../../services/aiService';

interface MultilingualAudioPlayerProps {
  content: string;
  title: string;
  defaultLang?: string;
  onLanguageChange?: (langCode: string) => void;
}

export const MultilingualAudioPlayer: React.FC<MultilingualAudioPlayerProps> = ({
  content,
  title,
  defaultLang = 'en',
  onLanguageChange
}) => {
  const [selectedLang, setSelectedLang] = useState<string>(defaultLang);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [showCaptions, setShowCaptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<any>(null);

  // Sync with available browser speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      clearInterval(progressTimerRef.current);
    };
  }, []);

  // Update translation whenever language or content changes
  useEffect(() => {
    let isCancelled = false;

    async function loadTranslation() {
      // Clean content from Markdown symbols for clean speech
      const cleaned = content
        .replace(/```[a-z]*[\s\S]*?```/g, 'Code example included in notes canvas.')
        .replace(/[#*`_$\\]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (selectedLang === 'en') {
        setTranslatedText(cleaned);
        return;
      }

      setIsTranslating(true);
      const targetLangObj = getLanguageOption(selectedLang);
      const translated = await translateContentAI(cleaned.slice(0, 2500), targetLangObj.label);
      if (!isCancelled) {
        setTranslatedText(translated);
        setIsTranslating(false);
      }
    }

    loadTranslation();

    return () => {
      isCancelled = true;
    };
  }, [content, selectedLang]);

  // Handle Play / Pause / Resume
  const handlePlay = () => {
    if (!window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Stop current speech
    window.speechSynthesis.cancel();

    const textToSpeak = translatedText || content.replace(/[#*`_$\\]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    const langObj = getLanguageOption(selectedLang);
    utterance.lang = langObj.voiceLang;
    utterance.rate = playbackRate;

    // Pick best native voice matching the language code if available
    const matchedVoice = availableVoices.find(v => 
      v.lang.toLowerCase().startsWith(langObj.voiceLang.toLowerCase().slice(0, 2))
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentProgress(5);
      progressTimerRef.current = setInterval(() => {
        setCurrentProgress(prev => (prev < 90 ? prev + 3 : prev));
      }, 1000);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentProgress(100);
      clearInterval(progressTimerRef.current);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      clearInterval(progressTimerRef.current);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
    clearInterval(progressTimerRef.current);
  };

  const handleStop = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentProgress(0);
    clearInterval(progressTimerRef.current);
  };

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLang(langCode);
    setLangDropdownOpen(false);
    if (onLanguageChange) onLanguageChange(langCode);
    if (isPlaying) {
      handleStop();
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (isPlaying && utteranceRef.current) {
      // Re-trigger with new speed
      handlePlay();
    }
  };

  const handleCopyTranslatedText = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentLangObj = getLanguageOption(selectedLang);

  return (
    <div className="rounded-2xl border border-indigo-200/90 bg-gradient-to-r from-indigo-50/90 via-white to-violet-50/70 p-4 shadow-sm space-y-3 animate-in fade-in duration-150">
      
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">
                Multilingual Audio Lecture Companion
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                Studique Style
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Listen to verified campus notes in your native language with adaptive voice synthesis
            </p>
          </div>
        </div>

        {/* Audio Language Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-indigo-200 shadow-xs text-xs font-bold text-indigo-950 hover:bg-indigo-50/80 transition"
          >
            <span>{currentLangObj.flag}</span>
            <span>{currentLangObj.nativeLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-2xl border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Listen in Language:
              </div>
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLanguageSelect(l.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition ${
                    selectedLang === l.code ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{l.flag}</span>
                    <span>{l.nativeLabel} ({l.label})</span>
                  </span>
                  {selectedLang === l.code && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Audio Controls and Equalizer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
        
        {/* Play / Pause / Reset Buttons */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              disabled={isTranslating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isPaused ? 'Resume Audio' : `Listen in ${currentLangObj.nativeLabel}`}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition active:scale-95"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              title="Stop & Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Equalizer Visualizer Waves */}
          {isPlaying && (
            <div className="flex items-center gap-1 px-2">
              <span className="w-1 h-3.5 bg-indigo-600 rounded-full animate-pulse" />
              <span className="w-1 h-5 bg-violet-600 rounded-full animate-bounce" />
              <span className="w-1 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
              <span className="w-1 h-4 bg-purple-600 rounded-full animate-bounce" />
            </div>
          )}
        </div>

        {/* Speed chips and Captions toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
            <span className="px-1 text-slate-400">Speed:</span>
            {[0.75, 1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSpeedChange(s)}
                className={`px-2 py-0.5 rounded-lg transition ${
                  playbackRate === s ? 'bg-white text-indigo-700 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowCaptions(!showCaptions)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              showCaptions ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>Read Along ({currentLangObj.code.toUpperCase()})</span>
          </button>
        </div>

      </div>

      {/* Loading banner while preparing speech in new language */}
      {isTranslating && (
        <div className="p-2.5 rounded-xl bg-indigo-100/60 text-indigo-900 text-xs font-medium flex items-center gap-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
          <span>Synthesizing audio translation in {currentLangObj.label} ({currentLangObj.nativeLabel})...</span>
        </div>
      )}

      {/* Read Along Captions Drawer */}
      {showCaptions && (
        <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <span>{currentLangObj.flag}</span>
              <span>Spoken Transcript in {currentLangObj.nativeLabel}</span>
            </span>
            <button
              type="button"
              onClick={handleCopyTranslatedText}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Audio Script'}</span>
            </button>
          </div>
          <div className="max-h-44 overflow-y-auto leading-relaxed text-slate-200 font-normal pr-2">
            {translatedText || 'Loading audio script...'}
          </div>
        </div>
      )}

    </div>
  );
};
