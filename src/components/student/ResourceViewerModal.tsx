import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Globe, 
  HelpCircle, 
  Brain, 
  FileText, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  Check, 
  ShieldCheck, 
  Award, 
  MessageSquare, 
  GitBranch, 
  ChevronRight, 
  Copy,
  RefreshCw,
  Play,
  Pause,
  Square,
  Languages,
  Sliders,
  ChevronDown,
  CheckCircle2,
  Headphones,
  Radio,
  Key,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EducationalResource, ResourceFeedback } from '../../types';
import { 
  explainSimplyAI, 
  summarizeAI, 
  generateQuizAI, 
  generateFlashcardsAI, 
  translateContentAI 
} from '../../services/aiService';
import { SUPPORTED_LANGUAGES, SupportedLanguage, getTranslation } from '../../utils/i18n';
import { hasStoredApiKey } from '../../services/geminiKeyService';
import { GeminiApiKeyModal } from '../common/GeminiApiKeyModal';
import { InteractiveDiagramViewer } from '../common/InteractiveDiagramViewer';

interface ResourceViewerModalProps {
  resource: EducationalResource | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveResource?: (resourceId: string) => void;
  isSaved?: boolean;
  onAddFeedback?: (resourceId: string, feedback: ResourceFeedback) => void;
  onLaunchChallenge?: (topic: string) => void;
  currentLanguage?: string;
  initialTab?: 'read' | 'diagram' | 'feedback' | 'versions';
}

export const ResourceViewerModal: React.FC<ResourceViewerModalProps> = ({
  resource,
  isOpen,
  onClose,
  onSaveResource,
  isSaved = false,
  onAddFeedback,
  onLaunchChallenge,
  currentLanguage = 'en',
  initialTab = 'read'
}) => {

  if (!isOpen || !resource) return null;

  // Active AI Sidebar tool
  const [activeAiTool, setActiveAiTool] = useState<'explain' | 'summarize' | 'quiz' | 'flashcards' | 'translate' | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [explanationOutput, setExplanationOutput] = useState<string>('');
  const [explainLevel, setExplainLevel] = useState<'kid' | 'high_school' | 'college'>('high_school');
  const [summaryBullets, setSummaryBullets] = useState<string[]>([]);
  const [quizList, setQuizList] = useState<Array<{ question: string; options: string[]; correctIndex: number; explanation: string }>>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [flashcards, setFlashcards] = useState<Array<{ front: string; back: string }>>([]);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [translatedLanguage, setTranslatedLanguage] = useState<SupportedLanguage>('hi');
  const [translatedSnippet, setTranslatedSnippet] = useState<string>('');
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);

  // Multilingual Speech & Audio Player State
  const initialLang = (SUPPORTED_LANGUAGES.some(l => l.code === currentLanguage) ? currentLanguage : 'hi') as SupportedLanguage;
  const [speechLanguage, setSpeechLanguage] = useState<SupportedLanguage>(initialLang);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranslatingSpeech, setIsTranslatingSpeech] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState<string>('');
  const [showAudioBar, setShowAudioBar] = useState(true);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [canvasLanguage, setCanvasLanguage] = useState<string>('original');
  const [canvasContent, setCanvasContent] = useState<string>(resource.content);
  const [isTranslatingCanvas, setIsTranslatingCanvas] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reset document content and state when resource or modal opens
  useEffect(() => {
    if (resource) {
      setCanvasContent(resource.content);
      setCanvasLanguage('original');
      setAudioTranscript('');
      setIsSpeaking(false);
      setIsPaused(false);
      const validCurrent = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);
      if (validCurrent) {
        setSpeechLanguage(validCurrent.code);
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setActiveTab(initialTab || 'read');
    }
  }, [resource?.id, isOpen, initialTab]);

  // Student Rating & Feedback state
  const [userRating, setUserRating] = useState<number>(5);
  const [isHelpfulVote, setIsHelpfulVote] = useState<boolean | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'read' | 'diagram' | 'feedback' | 'versions'>(initialTab);
  const [localSaved, setLocalSaved] = useState(isSaved);

  // Selected Text for instant explanation
  const [selectedText, setSelectedText] = useState<string>('');

  // Cleanup speech synthesis on unmount or close
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelection = () => {
    const text = window.getSelection()?.toString().trim();
    if (text && text.length > 5) {
      setSelectedText(text);
    }
  };

  const handleExplainSimply = async (level = explainLevel) => {
    setActiveAiTool('explain');
    setIsAiLoading(true);
    const targetText = selectedText || resource.content.slice(0, 1500);
    const result = await explainSimplyAI(targetText, level);
    setExplanationOutput(result);
    setIsAiLoading(false);
  };

  const handleSummarize = async () => {
    setActiveAiTool('summarize');
    setIsAiLoading(true);
    const bullets = await summarizeAI(resource.content);
    setSummaryBullets(bullets);
    setIsAiLoading(false);
  };

  const handleGenerateQuiz = async () => {
    setActiveAiTool('quiz');
    setIsAiLoading(true);
    const quiz = await generateQuizAI(resource.content);
    setQuizList(quiz);
    setQuizAnswers({});
    setIsAiLoading(false);
  };

  const handleGenerateFlashcards = async () => {
    setActiveAiTool('flashcards');
    setIsAiLoading(true);
    const cards = await generateFlashcardsAI(resource.content);
    setFlashcards(cards);
    setFlippedCards({});
    setIsAiLoading(false);
  };

  const handleTranslate = async (targetLang: SupportedLanguage = translatedLanguage) => {
    setActiveAiTool('translate');
    setTranslatedLanguage(targetLang);
    setIsAiLoading(true);
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === targetLang);
    const result = await translateContentAI(resource.content.slice(0, 1200), langObj?.label || targetLang, targetLang);
    setTranslatedSnippet(result);
    setIsAiLoading(false);
  };

  // MULTILINGUAL SPEECH SYNTHESIS ENGINE
  const speakInLanguage = async (targetLangCode: SupportedLanguage, speed = speechSpeed) => {
    if (!window.speechSynthesis) {
      showToast('Text-to-speech is not supported on this device/browser.');
      return;
    }

    // If currently paused, resume
    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Cancel existing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setIsPaused(false);

    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === targetLangCode) || SUPPORTED_LANGUAGES[0];

    // Prepare text to speak
    let textToSpeak = '';
    if (canvasLanguage === targetLangCode && canvasContent) {
      // Use currently translated canvas text directly
      textToSpeak = canvasContent.replace(/[#*`_$\\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1800);
    } else {
      const cleanSource = resource.content.replace(/[#*`_$\\]/g, ' ').replace(/\s+/g, ' ').trim();
      const textSnippet = cleanSource.slice(0, 1600);

      if (targetLangCode !== 'en') {
        setIsTranslatingSpeech(true);
        showToast(`Translating audio to ${langObj.nativeLabel}...`);
        textToSpeak = await translateContentAI(textSnippet, langObj.label, targetLangCode);
        setIsTranslatingSpeech(false);
      } else {
        textToSpeak = textSnippet;
      }
    }

    setAudioTranscript(textToSpeak);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langObj.speechCode;
    utterance.rate = speed;

    // Pick best matching browser voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => 
      v.lang.toLowerCase() === langObj.speechCode.toLowerCase() ||
      v.lang.toLowerCase().replace('_', '-').startsWith(targetLangCode.toLowerCase())
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    showToast(`Now playing audio narration in ${langObj.nativeLabel} (${speed}x)`);
  };

  const handlePauseSpeech = () => {
    if (window.speechSynthesis) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  const handleStopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Change Speech Language & Re-play if already playing
  const handleSelectSpeechLanguage = (langCode: SupportedLanguage) => {
    setSpeechLanguage(langCode);
    setShowLangDropdown(false);
    if (isSpeaking) {
      speakInLanguage(langCode, speechSpeed);
    }
  };

  // Change Speech Speed
  const handleChangeSpeed = (newSpeed: number) => {
    setSpeechSpeed(newSpeed);
    if (isSpeaking && !isPaused) {
      speakInLanguage(speechLanguage, newSpeed);
    }
  };

  // Translate full document canvas into selected language
  const handleTranslateFullCanvas = async (langCode: SupportedLanguage) => {
    if (langCode === 'en' || (canvasLanguage !== 'original' && canvasLanguage === langCode)) {
      setCanvasLanguage('original');
      setCanvasContent(resource.content);
      showToast('Restored original note text.');
      return;
    }

    setIsTranslatingCanvas(true);
    setCanvasLanguage(langCode);
    setSpeechLanguage(langCode);
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    showToast(`Translating note canvas to ${langObj?.nativeLabel}...`);

    try {
      const translated = await translateContentAI(resource.content, langObj?.label || 'Hindi', langCode);
      setCanvasContent(translated);
      showToast(`Note translated to ${langObj?.nativeLabel}!`);
    } catch {
      showToast('Error translating note text.');
    } finally {
      setIsTranslatingCanvas(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Resource link copied to clipboard!');
  };

  const handleSaveToggle = () => {
    setLocalSaved(!localSaved);
    if (onSaveResource) onSaveResource(resource.id);
    showToast(localSaved ? 'Removed from saved notes' : 'Saved to your offline vault!');
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddFeedback) {
      onAddFeedback(resource.id, {
        id: `fb-${Date.now()}`,
        studentName: 'Aarav Patel',
        rating: userRating,
        helpful: isHelpfulVote ?? true,
        comment: feedbackComment,
        date: 'Just now'
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
      setFeedbackSubmitted(true);
      showToast('Thank you for contributing peer review feedback!');
    }
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === speechLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-6xl bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <span className="text-2xl p-2 rounded-2xl bg-white border border-slate-200 shadow-xs">
              {resource.type === 'notes' ? '📄' : resource.type === 'ppt' ? '📊' : resource.type === 'video' ? '📹' : '📘'}
            </span>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                  {resource.title}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  AI Verified
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {resource.subject} • {resource.unit}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                by <strong className="text-slate-700 font-semibold">{resource.teacherName}</strong> • {resource.institutionName} • {resource.version} • Last verified: {resource.lastVerifiedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Gemini AI Key Setup Button */}
            <button
              onClick={() => setIsGeminiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition active:scale-95 shadow-xs"
              title="Link or change your Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Gemini AI Key</span>
              <span className={`w-2 h-2 rounded-full ${hasStoredApiKey() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            </button>

            {/* Quick Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition"
              title="Share Resource"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Quick Bookmark */}
            <button
              onClick={handleSaveToggle}
              className={`p-2 rounded-xl border transition ${
                localSaved 
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-600' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Save to Vault"
            >
              <Bookmark className={`w-4 h-4 ${localSaved ? 'fill-indigo-600' : ''}`} />
            </button>

            {/* Close button */}
            <button
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MULTILINGUAL AUDIO PLAYER BAR (Inspired by Studique.in) */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border-b border-indigo-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-3">
            {/* Studique inspiration & Audio status */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSpeaking ? 'bg-amber-400 text-slate-950 animate-bounce' : 'bg-white/10 text-indigo-200'}`}>
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-white flex items-center gap-1">
                    Multi-Language Audio Narration
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-white/10 text-amber-300 border border-white/10 hidden sm:inline">
                    Studique Companion
                  </span>
                </div>
                <div className="text-[11px] text-indigo-200/80 flex items-center gap-1">
                  {isTranslatingSpeech ? (
                    <span className="text-amber-300 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Translating speech to {currentLangObj.nativeLabel}...
                    </span>
                  ) : isSpeaking ? (
                    <span className="text-emerald-300 flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                      {isPaused ? 'Audio paused' : `Speaking in ${currentLangObj.nativeLabel} (${currentLangObj.label})`}
                    </span>
                  ) : (
                    <span>Listen to verified notes in your native language</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition active:scale-95"
                title="Select language to listen in"
              >
                <span>{currentLangObj.flag}</span>
                <span>{currentLangObj.nativeLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-1.5 w-60 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Listen in Multiple Languages
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectSpeechLanguage(lang.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-indigo-50 transition ${
                          speechLanguage === lang.code ? 'font-bold text-indigo-700 bg-indigo-50/70' : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <div>
                            <div className="font-semibold">{lang.nativeLabel}</div>
                            <div className="text-[10px] text-slate-400">{lang.label}</div>
                          </div>
                        </span>
                        {speechLanguage === lang.code && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Play / Pause Primary Button */}
            {!isSpeaking ? (
              <button
                onClick={() => speakInLanguage(speechLanguage, speechSpeed)}
                disabled={isTranslatingSpeech}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition active:scale-95 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Listen ({currentLangObj.nativeLabel})</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePauseSpeech}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition hover:bg-amber-300"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  onClick={handleStopSpeech}
                  className="p-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white transition"
                  title="Stop audio"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            )}

            {/* Speech Speed Switcher */}
            <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10">
              {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleChangeSpeed(spd)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    speechSpeed === spd 
                      ? 'bg-white text-indigo-950 shadow-xs' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Translate Canvas in This Language Toggle */}
            <button
              onClick={() => handleTranslateFullCanvas(speechLanguage)}
              disabled={isTranslatingCanvas}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                canvasLanguage === speechLanguage 
                  ? 'bg-emerald-500 border-emerald-400 text-white font-bold' 
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-indigo-100'
              }`}
              title="Read full note in this language"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>
                {canvasLanguage === speechLanguage ? '✓ Reading in ' + currentLangObj.nativeLabel : 'Read in ' + currentLangObj.nativeLabel}
              </span>
            </button>

          </div>

        </div>

        {/* Live Audio Equalizer & Spoken Transcript Banner (if speaking or audio active) */}
        {isSpeaking && (
          <div className="px-6 py-2 bg-amber-50 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2 truncate">
              {/* Equalizer Wave Simulation */}
              <div className="flex items-end gap-0.5 h-4 shrink-0">
                <span className="w-1 bg-amber-600 rounded-full animate-bounce [animation-delay:0ms] h-3" />
                <span className="w-1 bg-amber-600 rounded-full animate-bounce [animation-delay:150ms] h-4" />
                <span className="w-1 bg-amber-600 rounded-full animate-bounce [animation-delay:300ms] h-2" />
                <span className="w-1 bg-amber-600 rounded-full animate-bounce [animation-delay:75ms] h-3.5" />
              </div>
              <span className="font-bold shrink-0">Now Reading:</span>
              <span className="truncate italic text-slate-700">
                {audioTranscript || resource.title}
              </span>
            </div>
            <button
              onClick={handleStopSpeech}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 shrink-0 ml-3 underline"
            >
              Dismiss Audio
            </button>
          </div>
        )}

        {/* Action Tabs under title */}
        <div className="px-6 py-2 border-b border-slate-100 bg-white flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('read')}
              className={`py-1.5 border-b-2 transition ${activeTab === 'read' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Document Canvas
            </button>
            <button
              onClick={() => setActiveTab('diagram')}
              className={`py-1.5 border-b-2 transition flex items-center gap-1.5 ${activeTab === 'diagram' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Interactive Diagrams & Visualizer</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xs">
                SIMULATION
              </span>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-1.5 border-b-2 transition flex items-center gap-1.5 ${activeTab === 'feedback' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <span>Student Reviews</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                {resource.feedbacks.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              className={`py-1.5 border-b-2 transition flex items-center gap-1 ${activeTab === 'versions' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Version History ({resource.version})</span>
            </button>
          </div>


          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>Est. read: {resource.estimatedReadMinutes || 8} min</span>
            <span>•</span>
            <span>Audio: {speechLanguage.toUpperCase()}</span>
          </div>
        </div>

        {/* Main Content Area: Left Outline + Middle Content + Right AI Sidebar */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT: Outline / Table of Contents */}
          <div className="hidden lg:block w-56 border-r border-slate-200/80 p-5 bg-slate-50/50 overflow-y-auto text-xs">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Table of Contents
            </div>
            <ul className="space-y-2 text-slate-600">
              {resource.outline.map((sec, i) => (
                <li key={i} className="hover:text-indigo-600 cursor-pointer font-medium leading-snug">
                  {sec}
                </li>
              ))}
            </ul>

            {/* Quick stats box */}
            <div className="mt-8 p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Community Trust
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {resource.rating} / 5.0
                </span>
                <span className="text-[11px] text-slate-500">
                  {resource.reviewCount} ratings
                </span>
              </div>
              <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between">
                <span>Audited:</span>
                <span className="font-mono text-emerald-700 font-bold">{resource.lastVerifiedDate}</span>
              </div>
            </div>

            {/* Multilingual Quick Switcher inside Sidebar */}
            <div className="mt-6 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1">
                <Globe className="w-3 h-3 text-indigo-600" />
                Listen in Language
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {SUPPORTED_LANGUAGES.slice(0, 6).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectSpeechLanguage(lang.code)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold text-left transition flex items-center gap-1 ${
                      speechLanguage === lang.code 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white text-slate-700 hover:bg-indigo-100'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="truncate">{lang.nativeLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MIDDLE: Reading Canvas */}
          <div 
            onMouseUp={handleSelection}
            className="flex-1 p-6 sm:p-8 overflow-y-auto bg-white selection:bg-indigo-100 selection:text-indigo-900 leading-relaxed text-slate-800"
          >
            {activeTab === 'read' && (
              <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Canvas Language Notice Banner */}
                {canvasLanguage !== 'original' && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Document translated into <strong>{SUPPORTED_LANGUAGES.find(l => l.code === canvasLanguage)?.nativeLabel}</strong>
                      </span>
                    </span>
                    <button
                      onClick={() => handleTranslateFullCanvas('en')}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      Show Original English
                    </button>
                  </div>
                )}

                {/* Floating Selection Tooltip when text is highlighted */}
                {selectedText && (
                  <div className="sticky top-2 z-30 p-2 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center justify-between gap-3 animate-in fade-in duration-150">
                    <span className="text-xs truncate max-w-xs text-slate-300">
                      "{selectedText.slice(0, 35)}..."
                    </span>
                    <button
                      onClick={() => handleExplainSimply()}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Explain Simply
                    </button>
                  </div>
                )}

                {/* Multi-Language Reading & Canvas Translation Bar */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-indigo-700 shrink-0" />
                    <div>
                      <span className="font-extrabold text-xs text-indigo-950 block">
                        Read Note in Multiple Languages:
                      </span>
                      <span className="text-[10px] text-indigo-600">
                        Select a language to translate the canvas text & prepare audio narration
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Original English */}
                    <button
                      onClick={() => handleTranslateFullCanvas('en')}
                      disabled={isTranslatingCanvas}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        canvasLanguage === 'original' || canvasLanguage === 'en'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span>🇺🇸 English (Original)</span>
                    </button>

                    {/* Regional & Global Languages */}
                    {SUPPORTED_LANGUAGES.filter(l => l.code !== 'en').map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleTranslateFullCanvas(lang.code)}
                        disabled={isTranslatingCanvas}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
                          canvasLanguage === lang.code
                            ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                            : 'bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200'
                        }`}
                        title={`Translate and read in ${lang.nativeLabel}`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.nativeLabel}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loading state when translating note */}
                {isTranslatingCanvas ? (
                  <div className="py-20 text-center space-y-3 bg-slate-50/80 rounded-3xl border border-dashed border-indigo-200 p-8 my-4">
                    <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                    <div className="font-extrabold text-slate-900 text-base">
                      Translating Note to {SUPPORTED_LANGUAGES.find(l => l.code === canvasLanguage)?.nativeLabel || 'Selected Language'}...
                    </div>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Formulas ($O(1)$, $O(N)$) and code architectures are being preserved while pedagogical explanations are translated.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Interactive Diagram Banner Callout */}
                    <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
                          <Layers className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-white">
                              Interactive Architecture & Memory Diagram
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-xs">
                              SIMULATION
                            </span>
                          </div>
                          <p className="text-xs text-indigo-200/90 mt-0.5">
                            Simulate pointer chains, heap memory allocations, and state machines live in the interactive visualizer.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('diagram')}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 shrink-0 self-end sm:self-center"
                      >
                        <span>Launch Visualizer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Markdown content viewer */}
                    <article className="prose prose-slate max-w-none text-sm space-y-4">
                      {canvasContent.split('\n\n').map((paragraph, idx) => {
                        if (paragraph.startsWith('# ')) {
                          return <h1 key={idx} className="text-2xl font-extrabold text-slate-900">{paragraph.replace('# ', '')}</h1>;
                        }
                        if (paragraph.startsWith('## ')) {
                          return <h2 key={idx} className="text-xl font-bold text-slate-900 mt-6 pt-2 border-t border-slate-100">{paragraph.replace('## ', '')}</h2>;
                        }
                        if (paragraph.startsWith('### ')) {
                          return <h3 key={idx} className="text-base font-bold text-slate-800">{paragraph.replace('### ', '')}</h3>;
                        }
                        if (paragraph.startsWith('```')) {
                          const isDiagramBlock = paragraph.includes('--->') || paragraph.includes('[Head:') || paragraph.includes('NULL') || paragraph.includes('Heap') || paragraph.includes('Node');
                          return (
                            <div key={idx} className="space-y-2">
                              <pre className="p-4 rounded-2xl bg-slate-900 text-indigo-300 font-mono text-xs overflow-x-auto shadow-inner">
                                <code>{paragraph.replace(/```[a-z]*/g, '')}</code>
                              </pre>
                              {isDiagramBlock && (
                                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between gap-3 text-xs">
                                  <span className="flex items-center gap-2 font-semibold text-indigo-950 text-[11px]">
                                    <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span>Memory Architecture Diagram above is available in the interactive simulator!</span>
                                  </span>
                                  <button
                                    onClick={() => setActiveTab('diagram')}
                                    className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shrink-0 flex items-center gap-1 shadow-xs"
                                  >
                                    <span>View Live Diagram</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        }
                        return <p key={idx} className="text-slate-700 leading-relaxed">{paragraph}</p>;
                      })}
                    </article>
                  </>
                )}


                {/* Rate this Resource CTA at bottom */}
                <div className="mt-12 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 text-center">
                  <h4 className="font-extrabold text-slate-900 text-base">
                    Was this resource helpful for your studies?
                  </h4>

                  {/* 1-5 Stars */}
                  <div className="flex items-center justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setUserRating(s)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${userRating >= s ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>

                  {/* Helpful / Not Helpful buttons */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsHelpfulVote(true)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                        isHelpfulVote === true 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Helpful
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsHelpfulVote(false)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                        isHelpfulVote === false 
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      Not helpful
                    </button>
                  </div>

                  {/* Review comment form */}
                  <form onSubmit={handleSubmitFeedback} className="space-y-2 max-w-md mx-auto pt-2">
                    <input
                      type="text"
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Optional: What did you like or dislike? (e.g. diagrams made it easy)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      {feedbackSubmitted ? '✓ Feedback Recorded' : 'Submit Review'}
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* TAB: Interactive Diagrams & Architecture Visualizer */}
            {activeTab === 'diagram' && (
              <div className="w-full h-full pb-8">
                <InteractiveDiagramViewer
                  resource={resource}
                  onAskAIAboutConcept={(concept) => handleExplainSimply()}
                />
              </div>
            )}

            {/* TAB: Student Reviews */}
            {activeTab === 'feedback' && (

              <div className="max-w-xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">
                    Community Reviews & Aggregated Feedback
                  </h4>
                  <span className="text-xs font-semibold text-slate-400">
                    Students cannot edit teacher content
                  </span>
                </div>

                <div className="space-y-3">
                  {resource.feedbacks.map((fb) => (
                    <div key={fb.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {fb.studentName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{fb.studentName}</div>
                            <div className="text-[10px] text-slate-400">{fb.date}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < fb.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} 
                            />
                          ))}
                        </div>
                      </div>

                      {fb.comment && (
                        <p className="text-xs text-slate-700 pl-9">
                          "{fb.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Version History */}
            {activeTab === 'versions' && (
              <div className="max-w-xl mx-auto space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Resource Version History</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Whenever an educator updates course material, EduVault AI automatically re-verifies accuracy and updates the verified timestamp.
                  </p>
                </div>

                <div className="border-l-2 border-slate-200 pl-4 space-y-5 ml-2">
                  {resource.versionHistory.map((ver) => (
                    <div key={ver.version} className="relative text-xs">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{ver.version}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{ver.date}</span>
                        {ver.verifiedByAI && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-800">
                            <Check className="w-3 h-3 text-emerald-600" />
                            AI Verified
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 mt-1">{ver.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: AI Tools Sidebar */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200/80 p-5 bg-slate-50/70 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                AI Learning Toolkit
              </span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                Grounded
              </span>
            </div>

            {/* Tool Action Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleExplainSimply()}
                className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center gap-2 ${
                  activeAiTool === 'explain' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Explain Simply</span>
              </button>

              <button
                onClick={handleSummarize}
                className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center gap-2 ${
                  activeAiTool === 'summarize' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Summarize</span>
              </button>

              <button
                onClick={handleGenerateQuiz}
                className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center gap-2 ${
                  activeAiTool === 'quiz' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Create Quiz</span>
              </button>

              <button
                onClick={handleGenerateFlashcards}
                className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center gap-2 ${
                  activeAiTool === 'flashcards' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Brain className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Flashcards</span>
              </button>

              <button
                onClick={() => handleTranslate(translatedLanguage)}
                className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center gap-2 ${
                  activeAiTool === 'translate' 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Translate</span>
              </button>

              <button
                onClick={() => setActiveTab('diagram')}
                className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center gap-2 ${
                  activeTab === 'diagram'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-400' 
                    : 'bg-indigo-50/80 border-indigo-200 text-indigo-950 hover:bg-indigo-100'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-bold">Live Diagram</span>
              </button>

              {onLaunchChallenge && (

                <button
                  onClick={() => onLaunchChallenge(resource.topic)}
                  className="p-2.5 rounded-xl border bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 font-semibold text-left flex items-center gap-2 transition"
                >
                  <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Challenge Me</span>
                </button>
              )}
            </div>

            {/* AI Output Card */}
            {isAiLoading ? (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                <div className="text-xs font-semibold text-slate-600">
                  EduVault AI synthesizing study aid...
                </div>
              </div>
            ) : (
              <div>
                {/* TOOL: Explain Simply */}
                {activeAiTool === 'explain' && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Explanation Level</span>
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          onClick={() => { setExplainLevel('kid'); handleExplainSimply('kid'); }}
                          className={`px-2 py-0.5 rounded ${explainLevel === 'kid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
                        >
                          Like I'm 10
                        </button>
                        <button
                          onClick={() => { setExplainLevel('high_school'); handleExplainSimply('high_school'); }}
                          className={`px-2 py-0.5 rounded ${explainLevel === 'high_school' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
                        >
                          College
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                      {explanationOutput}
                    </p>
                  </div>
                )}

                {/* TOOL: Summarize */}
                {activeAiTool === 'summarize' && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 animate-in fade-in duration-150">
                    <span className="text-xs font-bold text-slate-900">Key Takeaways</span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {summaryBullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* TOOL: Quiz */}
                {activeAiTool === 'quiz' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <span className="text-xs font-bold text-slate-900">Knowledge Check</span>
                    {quizList.map((q, qIndex) => {
                      const selected = quizAnswers[qIndex];
                      return (
                        <div key={qIndex} className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                          <div className="font-bold text-slate-900">{qIndex + 1}. {q.question}</div>
                          <div className="space-y-1">
                            {q.options.map((opt, optIndex) => {
                              const isChosen = selected === optIndex;
                              const isCorrect = q.correctIndex === optIndex;
                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => setQuizAnswers({ ...quizAnswers, [qIndex]: optIndex })}
                                  className={`w-full text-left p-2 rounded-xl text-xs transition ${
                                    selected !== undefined
                                      ? isCorrect
                                        ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300'
                                        : isChosen
                                          ? 'bg-rose-100 text-rose-950 font-bold border border-rose-300'
                                          : 'bg-slate-50 text-slate-500'
                                      : 'bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {selected !== undefined && (
                            <div className="text-[11px] text-slate-500 pt-1 italic">
                              💡 {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TOOL: Flashcards */}
                {activeAiTool === 'flashcards' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <span className="text-xs font-bold text-slate-900">Interactive Concept Cards</span>
                    {flashcards.map((fc, i) => {
                      const isFlipped = flippedCards[i];
                      return (
                        <div
                          key={i}
                          onClick={() => setFlippedCards({ ...flippedCards, [i]: !isFlipped })}
                          className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all duration-200 ${
                            isFlipped
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-400'
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">
                            {isFlipped ? 'Answer (Click to flip)' : 'Prompt (Click to reveal answer)'}
                          </div>
                          <div className="font-semibold text-sm">
                            {isFlipped ? fc.back : fc.front}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TOOL: Translate */}
                {activeAiTool === 'translate' && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Translate Notes</span>
                      <span className="text-[10px] text-indigo-600 font-semibold">9 Languages</span>
                    </div>

                    <select
                      value={translatedLanguage}
                      onChange={(e) => handleTranslate(e.target.value as SupportedLanguage)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold"
                    >
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.nativeLabel} ({lang.label})
                        </option>
                      ))}
                    </select>

                    <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 leading-relaxed border border-slate-100 max-h-48 overflow-y-auto">
                      {translatedSnippet || (
                        <p className="text-slate-400 italic">Select a language above to preview translation...</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleTranslateFullCanvas(translatedLanguage)}
                        className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                      >
                        <Languages className="w-3.5 h-3.5" />
                        <span>Apply to Canvas</span>
                      </button>
                      <button
                        onClick={() => speakInLanguage(translatedLanguage)}
                        className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                        title="Listen to this translation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </div>

      {/* Gemini AI Key Settings Modal */}
      <GeminiApiKeyModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
      />
    </div>
  );
};