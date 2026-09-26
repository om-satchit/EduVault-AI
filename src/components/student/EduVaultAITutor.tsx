import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Star, 
  ShieldCheck, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  RefreshCw, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Globe, 
  ExternalLink, 
  Radio, 
  Cpu, 
  Zap, 
  Brain, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Layers,
  StopCircle,
  Play,
  RotateCcw,
  Copy,
  Check,
  Languages,
  Award,
  ChevronRight,
  Flame,
  BookmarkPlus,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EducationalResource } from '../../types';
import { 
  ChatMessage, 
  sendChatMessageAI, 
  transcribeAudioAI, 
  generateQuizAI,
  generateFlashcardsAI,
  explainSimplyAI,
  summarizeAI,
  translateContentAI
} from '../../services/aiService';
import { InteractiveDiagramViewer } from '../common/InteractiveDiagramViewer';

interface EduVaultAITutorProps {
  resources: EducationalResource[];
  onOpenResource: (resource: EducationalResource) => void;
  initialQuery?: string;
}

type StudioTab = 'chat' | 'diagram' | 'quiz' | 'flashcards' | 'live_voice';
type TutorPersona = 'socratic' | 'exam_coach' | 'code_architect';
type ModelMode = 'fast' | 'general' | 'complex';

const PERSONA_CONFIGS: Record<TutorPersona, { name: string; badge: string; icon: string; systemInstruction: string; description: string }> = {
  socratic: {
    name: 'Prof. Socratic',
    badge: 'Socratic Method',
    icon: '🏛️',
    description: 'Guides understanding through thoughtful questions, foundational axioms, and mental models.',
    systemInstruction: 'You are Prof. Socratic, a world-class academic mentor. Do not just hand over raw answers; guide the student through intuitive Socratic dialogue, asking guiding questions, proposing thought experiments, and clarifying core mathematical and conceptual foundations.'
  },
  exam_coach: {
    name: 'Exam Prep Coach',
    badge: 'High-Yield Exam Focus',
    icon: '🎯',
    description: 'Pinpoints exam mark distribution, formulas, step-by-step rubrics, and common traps.',
    systemInstruction: 'You are EduVault Exam Prep Coach. Your mission is high-yield university exam readiness: deliver structured bullet points, formula summaries, asymptotic complexities, and specifically highlight the top 3 traps students fall into during exams.'
  },
  code_architect: {
    name: 'Code & Systems Mentor',
    badge: 'Algorithm & Memory',
    icon: '💻',
    description: 'Step-by-step algorithms, memory diagrams, pointer traces, and modern clean syntax.',
    systemInstruction: 'You are a Senior Systems & Algorithms Architect. Provide clear algorithmic explanations with asymptotic time/space bounds, pointer/memory allocation details (heap vs stack), and production-grade syntax.'
  }
};

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  userSelectedIndex?: number;
}

interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  mastered?: boolean;
}

export const EduVaultAITutor: React.FC<EduVaultAITutorProps> = ({
  resources,
  onOpenResource,
  initialQuery = ''
}) => {
  // Studio Tab State
  const [activeStudioTab, setActiveStudioTab] = useState<StudioTab>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      content: `### Welcome to EduVault AI Academic Super-Studio! 🎓✨

I am your comprehensive curriculum intelligence partner, powered by **Gemini 3 models** with **real-time Google Search Grounding**.

Here is what you can do right here:
- 💬 **Ask Any Concept:** Get rigorous intuitive explanations, asymptotic bounds, and code.
- 📊 **Interactive Diagram Studio:** Simulate Linked List pointer linking, Floyd cycle detection, JVM constructor memory allocation, and CPU scheduling.
- 📝 **AI Exam & Quiz Generator:** Generate instant university test papers with live grading.
- 🗂️ **Smart Active-Recall Flashcards:** 3D flip card decks tailored to your syllabus.
- 🎙️ **Live Voice Assistant:** Hands-free speech dialogue with real-time speech transcription.

Choose an action tab above or ask a question below to begin!`,
      timestamp: 'Ready',
      modelUsed: 'gemini-3.8-flash'
    }
  ]);

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState<TutorPersona>('socratic');
  const [modelMode, setModelMode] = useState<ModelMode>('general');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Audio Recording & Transcription State (gemini-3.5-transcribe)
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Live Voice Mode State
  const [liveAudioPlaying, setLiveAudioPlaying] = useState(false);

  // Diagram Studio State
  const [selectedDiagramTopic, setSelectedDiagramTopic] = useState<'linked_list' | 'java_oop' | 'os_process' | 'dbms' | 'concept_graph'>('linked_list');

  // AI Quiz Generator State
  const [quizTopic, setQuizTopic] = useState<string>('Linked Lists and Pointer Allocation');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      question: 'What is the time complexity of prepending a node to the beginning of a Singly Linked List?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
      correctIndex: 0,
      explanation: 'Inserting at the head only requires updating the new node\'s next pointer to current head and reassigning head, taking strictly constant O(1) time.'
    },
    {
      question: 'In Floyd\'s Cycle Detection algorithm, if a cycle exists, what is guaranteed about the fast and slow pointers?',
      options: [
        'They will never cross each other',
        'They are mathematically guaranteed to meet inside the cycle loop',
        'The fast pointer will trigger a NullPointerException',
        'The slow pointer arrives at the tail before fast'
      ],
      correctIndex: 1,
      explanation: 'Since the fast pointer closes the distance by 1 node per iteration relative to the slow pointer, the distance mod cycle length strictly decreases to 0.'
    },
    {
      question: 'Why do Arrays exhibit superior CPU spatial cache locality compared to Linked Lists?',
      options: [
        'Arrays have fewer elements than lists',
        'Arrays store elements at continuous contiguous memory slots, enabling CPU cache-line prefetching',
        'Arrays do not require RAM',
        'Arrays store pointers only'
      ],
      correctIndex: 1,
      explanation: 'Contiguous memory layout allows the CPU memory controller to prefetch entire 64-byte cache lines, minimizing cache misses compared to random heap node hops.'
    }
  ]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Smart Flashcard Deck State
  const [flashcardTopic, setFlashcardTopic] = useState<string>('Core Systems & Algorithmic Foundations');
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([
    {
      id: 'fc-1',
      front: 'What are the two components of a Linked List node in memory?',
      back: '1. Data Payload (value)\n2. Next Pointer (memory address in the heap referencing the next node).'
    },
    {
      id: 'fc-2',
      front: 'What is the time and space complexity of Floyd\'s Cycle Detection algorithm?',
      back: 'Time Complexity: O(N) linear time.\nAuxiliary Space: O(1) constant space (requires only two pointers: slow and fast).'
    },
    {
      id: 'fc-3',
      front: 'In Java JVM OOP, why must this() or super() be the FIRST line in a constructor?',
      back: 'To guarantee that the parent superclass state is initialized before child subclass instance members are evaluated.'
    },
    {
      id: 'fc-4',
      front: 'What causes a CPU Context Switch in Round Robin Scheduling?',
      back: 'When a running process exhausts its allocated Time Quantum slice, an interrupt timer fires, saving CPU registers to PCB and moving the task to the Ready Queue.'
    }
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [flashcardLoading, setFlashcardLoading] = useState(false);

  // Multilingual Translator Modal/State in AI Tutor
  const [translatingMsgId, setTranslatingMsgId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi');
  const [micError, setMicError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (activeStudioTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, activeStudioTab]);

  // Handle Initial Query if provided
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  // ----------------------------------------------------
  // SEND MESSAGE HANDLER
  // ----------------------------------------------------
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const activePersona = PERSONA_CONFIGS[persona];
      const conversationHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const result = await sendChatMessageAI({
        messages: conversationHistory,
        systemInstruction: activePersona.systemInstruction,
        taskMode: modelMode,
        useSearchGrounding
      });

      const modelMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'model',
        content: result.reply,
        sources: result.sources || [],
        modelUsed: result.modelUsed || (modelMode === 'complex' ? 'gemini-3.1-pro-preview' : modelMode === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMessage]);

      // If in Live Voice Mode, speak response
      if (activeStudioTab === 'live_voice' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const cleanSpeech = result.reply.replace(/[#*`_$\n]/g, ' ').slice(0, 350);
        const utter = new SpeechSynthesisUtterance(cleanSpeech);
        utter.rate = 1.0;
        setLiveAudioPlaying(true);
        utter.onend = () => setLiveAudioPlaying(false);
        utter.onerror = () => setLiveAudioPlaying(false);
        window.speechSynthesis.speak(utter);
      }
    } catch (err: any) {
      console.warn('Chat notice:', err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // QUICK ACTIONS TRIGGERED FROM A MESSAGE
  // ----------------------------------------------------
  const handleActionGenerateQuiz = async (content: string) => {
    setActiveStudioTab('quiz');
    setQuizLoading(true);
    setQuizSubmitted(false);
    try {
      const questions = await generateQuizAI(content.slice(0, 2000));
      if (questions && questions.length > 0) {
        setQuizQuestions(questions);
      }
    } catch (e) {
      console.warn('Quiz generation fallback:', e);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleActionGenerateFlashcards = async (content: string) => {
    setActiveStudioTab('flashcards');
    setFlashcardLoading(true);
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    try {
      const cards = await generateFlashcardsAI(content.slice(0, 2000));
      if (cards && cards.length > 0) {
        setFlashcards(cards.map((c, i) => ({ id: `dyn-fc-${i}`, front: c.front, back: c.back })));
      }
    } catch (e) {
      console.warn('Flashcard generation fallback:', e);
    } finally {
      setFlashcardLoading(false);
    }
  };

  const handleActionShowDiagram = (topicOrType?: string) => {
    if (topicOrType) {
      const lower = topicOrType.toLowerCase();
      if (lower.includes('linked list') || lower.includes('node') || lower.includes('floyd') || lower.includes('pointer')) {
        setSelectedDiagramTopic('linked_list');
      } else if (lower.includes('oop') || lower.includes('jvm') || lower.includes('heap') || lower.includes('constructor')) {
        setSelectedDiagramTopic('java_oop');
      } else if (lower.includes('process') || lower.includes('scheduling') || lower.includes('quantum') || lower.includes('operating')) {
        setSelectedDiagramTopic('os_process');
      } else if (lower.includes('dbms') || lower.includes('normal') || lower.includes('sql') || lower.includes('database')) {
        setSelectedDiagramTopic('dbms');
      } else {
        setSelectedDiagramTopic('concept_graph');
      }
    }
    setActiveStudioTab('diagram');
  };

  const handleActionExplainSimpler = async (msgContent: string) => {
    setLoading(true);
    try {
      const simple = await explainSimplyAI(msgContent.slice(0, 1500), 'high_school');
      const modelMessage: ChatMessage = {
        id: 'bot-simple-' + Date.now(),
        role: 'model',
        content: `### 💡 Crystal-Clear Intuitive Explanation:\n\n${simple}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.8-flash'
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleActionExamTakeaways = async (msgContent: string) => {
    setLoading(true);
    try {
      const bullets = await summarizeAI(msgContent.slice(0, 2000));
      const modelMessage: ChatMessage = {
        id: 'bot-summary-' + Date.now(),
        role: 'model',
        content: `### 🎯 High-Yield Exam Takeaways:\n\n${bullets.map(b => `- ${b}`).join('\n')}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.8-flash'
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleActionReadAloud = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[#*`_$\n]/g, ' ').slice(0, 500);
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.0;
    window.speechSynthesis.speak(utter);
  };

  const handleActionTranslate = async (msgId: string, text: string, langCode: string) => {
    setTranslatingMsgId(msgId);
    try {
      const langNames: Record<string, string> = {
        hi: 'Hindi',
        es: 'Spanish',
        fr: 'French',
        de: 'German',
        ta: 'Tamil',
        te: 'Telugu'
      };
      const translated = await translateContentAI(text.slice(0, 2500), langNames[langCode] || 'Hindi', langCode);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: translated } : m));
    } catch {} finally {
      setTranslatingMsgId(null);
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // ----------------------------------------------------
  // MICROPHONE AUDIO TRANSCRIPTION (gemini-3.5-transcribe)
  // ----------------------------------------------------
  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsTranscribing(true);
        try {
          const transcribedText = await transcribeAudioAI(audioBlob);
          if (transcribedText) {
            setInputQuery(transcribedText);
            if (activeStudioTab === 'live_voice') {
              handleSendMessage(transcribedText);
            }
          }
        } catch (err) {
          console.warn('Transcription error:', err);
        } finally {
          setIsTranscribing(false);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      setMicError(null);
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setMicError('Could not access microphone. Please ensure microphone permissions are granted in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // ----------------------------------------------------
  // QUIZ SELECTION & SCORING
  // ----------------------------------------------------
  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizQuestions(prev => prev.map((q, idx) => idx === qIdx ? { ...q, userSelectedIndex: optIdx } : q));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    const score = quizQuestions.filter(q => q.userSelectedIndex === q.correctIndex).length;
    if (score === quizQuestions.length) {
      confetti({ particleCount: 75, spread: 60 });
    }
  };

  const samplePrompts = [
    'Explain binary trees and search complexity',
    'How does Floyd cycle detection algorithm work in Linked Lists?',
    'What is the difference between 2NF and 3NF in DBMS?',
    'How does JVM execute constructor chaining with this() and super()?',
    'Simulate Round Robin CPU scheduling with 2ms quantum'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* ========================================================= */}
      {/* 1. TOP STUDIO COMMAND DECK                                */}
      {/* ========================================================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-500/20 space-y-5">
        
        {/* Title & Capabilities Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                EduVault AI Academic Super-Studio
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gemini 3 Suite
              </span>
            </div>
            <p className="text-xs text-indigo-200/80">
              Interactive visual diagrams, multi-turn AI reasoning, automated exam generator, and live voice coaching
            </p>
          </div>

          {/* Model Status Indicator */}
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/10 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-medium">Model:</span>
            <span className="font-bold text-indigo-300">
              {modelMode === 'complex' ? 'gemini-3.1-pro-preview' : modelMode === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash'}
            </span>
          </div>
        </div>

        {/* Studio Primary Feature Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          
          <button
            onClick={() => setActiveStudioTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStudioTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Tutor Chat & Assistant</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('diagram')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStudioTab === 'diagram'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Interactive Diagram Studio</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500/20 text-amber-300 font-extrabold uppercase">
              Visual
            </span>
          </button>

          <button
            onClick={() => setActiveStudioTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStudioTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>AI Exam & Quiz Generator</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStudioTab === 'flashcards'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <BookmarkPlus className="w-4 h-4 text-cyan-400" />
            <span>Smart Flashcard Decks</span>
          </button>

          <button
            onClick={() => setActiveStudioTab('live_voice')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStudioTab === 'live_voice'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400/40 animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 text-rose-400" />
            <span>Live Voice Assistant</span>
          </button>

        </div>

        {/* Secondary Configuration Controls: Personas, Speed & Grounding */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Persona selector */}
          <div className="flex items-center gap-2">
            <span className="text-white/60 font-medium text-[11px]">Tutor Persona:</span>
            <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10">
              {(Object.keys(PERSONA_CONFIGS) as TutorPersona[]).map((key) => {
                const p = PERSONA_CONFIGS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setPersona(key)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      persona === key 
                        ? 'bg-white text-indigo-950 shadow-xs' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Reasoning Speed Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/10 rounded-xl p-0.5 border border-white/10">
              <button
                onClick={() => setModelMode('fast')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                  modelMode === 'fast' ? 'bg-indigo-600 text-white' : 'text-white/70 hover:text-white'
                }`}
                title="gemini-3.1-flash-lite: high speed and rate limit headroom"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Fast</span>
              </button>
              <button
                onClick={() => setModelMode('general')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                  modelMode === 'general' ? 'bg-indigo-600 text-white' : 'text-white/70 hover:text-white'
                }`}
                title="gemini-3.8-flash: general academic problem solving"
              >
                <Brain className="w-3 h-3 text-cyan-400" />
                <span>General (Flash)</span>
              </button>
              <button
                onClick={() => setModelMode('complex')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                  modelMode === 'complex' ? 'bg-indigo-600 text-white' : 'text-white/70 hover:text-white'
                }`}
                title="gemini-3.1-pro-preview: deep STEM proofs and algorithmic verification"
              >
                <Cpu className="w-3 h-3 text-rose-400" />
                <span>Complex (Pro)</span>
              </button>
            </div>

            {/* Google Search Grounding Toggle */}
            <button
              onClick={() => setUseSearchGrounding(!useSearchGrounding)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition flex items-center gap-1.5 ${
                useSearchGrounding 
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                  : 'bg-white/5 border-white/10 text-white/50'
              }`}
              title="Ground responses with verified real-time Google Search data"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Search {useSearchGrounding ? 'ON' : 'OFF'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* TAB 1: TUTOR CHAT & CONVERSATION STUDIO                   */}
      {/* ========================================================= */}
      {activeStudioTab === 'chat' && (
        <div className="space-y-4">
          
          {/* Scrollable Conversation Thread */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 min-h-[440px] max-h-[620px] overflow-y-auto space-y-6">
            
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              const containsDiagramKeywords = !isUser && (
                msg.content.toLowerCase().includes('linked list') ||
                msg.content.toLowerCase().includes('pointer') ||
                msg.content.toLowerCase().includes('floyd') ||
                msg.content.toLowerCase().includes('heap') ||
                msg.content.toLowerCase().includes('constructor') ||
                msg.content.toLowerCase().includes('process') ||
                msg.content.toLowerCase().includes('scheduling') ||
                msg.content.toLowerCase().includes('normalization')
              );

              return (
                <div 
                  key={msg.id || idx}
                  className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in duration-150`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                    isUser 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white ring-2 ring-indigo-200'
                  }`}>
                    {isUser ? 'You' : <Bot className="w-5 h-5" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[88%] space-y-2 text-xs sm:text-sm ${isUser ? 'items-end' : 'items-start'}`}>
                    
                    {/* Header bar */}
                    <div className={`flex items-center gap-2 text-[10px] text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <span className="font-bold text-slate-700">
                        {isUser ? 'You' : PERSONA_CONFIGS[persona].name}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp || 'Just now'}</span>
                      {!isUser && msg.modelUsed && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono text-[9px] border border-indigo-200/60">
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>

                    {/* Content Card */}
                    <div className={`p-4 sm:p-5 rounded-2xl leading-relaxed whitespace-pre-line shadow-xs ${
                      isUser
                        ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none space-y-4'
                    }`}>
                      
                      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed">
                        {msg.content}
                      </div>

                      {/* INLINE INTERACTIVE DIAGRAM CALLOUT IF RELEVANT */}
                      {containsDiagramKeywords && (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 to-indigo-950 text-white border border-indigo-500/30 flex items-center justify-between gap-3 shadow-md">
                          <div className="flex items-center gap-2.5">
                            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                              <Layers className="w-4 h-4 animate-pulse" />
                            </span>
                            <div>
                              <div className="font-bold text-xs">Interactive Architecture Diagram Available</div>
                              <div className="text-[10px] text-indigo-200/80">Simulate pointer linking, memory heap allocations, and register addresses</div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleActionShowDiagram(msg.content)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                          >
                            <span>Open Simulation</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Google Search Grounding Sources Cards */}
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <Globe className="w-3 h-3 text-indigo-600" />
                            <span>Google Search Grounded Sources:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-indigo-700 hover:text-indigo-900 text-[11px] font-semibold transition shadow-xs"
                              >
                                <span className="truncate max-w-[200px]">{src.title}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI ACTION BUTTONS SUITE UNDER EACH MESSAGE */}
                      {!isUser && (
                        <div className="pt-3 border-t border-slate-200/70 flex flex-wrap items-center gap-1.5 text-xs">
                          
                          <button
                            type="button"
                            onClick={() => handleActionShowDiagram(msg.content)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] transition flex items-center gap-1 border border-indigo-200/60"
                            title="Open in interactive diagram canvas"
                          >
                            <Layers className="w-3 h-3 text-indigo-600" />
                            <span>Diagram</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleActionGenerateQuiz(msg.content)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] transition flex items-center gap-1 border border-emerald-200/60"
                            title="Generate 3 university-grade practice quiz questions"
                          >
                            <Award className="w-3 h-3 text-emerald-600" />
                            <span>Practice Quiz</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleActionGenerateFlashcards(msg.content)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-semibold text-[11px] transition flex items-center gap-1 border border-cyan-200/60"
                            title="Generate active-recall revision flashcards"
                          >
                            <BookmarkPlus className="w-3 h-3 text-cyan-600" />
                            <span>Flashcards</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleActionExplainSimpler(msg.content)}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-[11px] transition flex items-center gap-1 border border-amber-200/60"
                            title="Simplify with intuitive analogy"
                          >
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Explain Simpler</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleActionExamTakeaways(msg.content)}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[11px] transition flex items-center gap-1 border border-purple-200/60"
                            title="Extract 5 high-yield exam takeaways"
                          >
                            <Flame className="w-3 h-3 text-purple-600" />
                            <span>Exam Takeaways</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleActionReadAloud(msg.content)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition flex items-center gap-1"
                            title="Read out loud with text-to-speech"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleActionTranslate(msg.id || '', msg.content, selectedLanguage)}
                            disabled={translatingMsgId === msg.id}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition flex items-center gap-1"
                            title="Translate note to Hindi / Spanish / French"
                          >
                            <Languages className="w-3 h-3 text-indigo-600" />
                            <span>{translatingMsgId === msg.id ? 'Translating...' : 'Translate'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id || '', msg.content)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-[11px] transition flex items-center gap-1 ml-auto"
                            title="Copy formatted note"
                          >
                            {copiedMsgId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                        </div>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}

            {/* Loading Spinner Indicator */}
            {loading && (
              <div className="flex items-start gap-3.5 animate-in fade-in">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span className="font-semibold text-slate-700">
                    {PERSONA_CONFIGS[persona].name} synthesizing academic response...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box, Microphone & Quick Prompts */}
          <div className="space-y-3">
            {micError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{micError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMicError(null)}
                  className="text-amber-700 hover:text-amber-900 font-bold px-2 py-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputQuery); }} className="relative">
              <div className="relative group">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={
                    isRecording 
                      ? 'Listening to microphone...' 
                      : (isTranscribing ? 'Transcribing with gemini-3.5-transcribe...' : 'Ask a question, request code verification, or paste an exam problem...')
                  }
                  disabled={loading || isTranscribing}
                  className="w-full pl-5 pr-36 py-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xl shadow-indigo-500/5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                />

                {/* Right Buttons: Microphone & Send */}
                <div className="absolute inset-y-2 right-2 flex items-center gap-1.5">
                  
                  {/* Microphone Button (gemini-3.5-transcribe) */}
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      disabled={loading || isTranscribing}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition"
                      title="Speak with microphone (transcribed via gemini-3.5-transcribe)"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="p-2.5 rounded-xl bg-rose-500 text-white animate-pulse"
                      title="Stop recording"
                    >
                      <StopCircle className="w-4 h-4" />
                    </button>
                  )}

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={loading || !inputQuery.trim()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>

                </div>
              </div>
            </form>

            {/* Quick prompt pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Try asking:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { setInputQuery(p); handleSendMessage(p); }}
                  className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 text-xs font-medium transition shadow-xs cursor-pointer"
                >
                  &ldquo;{p}&rdquo;
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: INTERACTIVE DIAGRAM STUDIO                         */}
      {/* ========================================================= */}
      {activeStudioTab === 'diagram' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white border border-indigo-500/30">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-extrabold text-sm">Visual Architecture Studio</h3>
                <p className="text-xs text-slate-400">Step through execution chains, simulate pointer mutations, and inspect memory heap addresses</p>
              </div>
            </div>
            
            <button
              onClick={() => setActiveStudioTab('chat')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition shadow-sm"
            >
              <span>Back to Chat</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Embedded Full Interactive Diagram Component */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-2 shadow-2xl">
            <InteractiveDiagramViewer
              resource={resources[0] || null}
              initialDiagramType={selectedDiagramTopic}
              onAskAIAboutConcept={(concept) => {
                setActiveStudioTab('chat');
                setInputQuery(concept);
                handleSendMessage(concept);
              }}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: AI EXAM & QUIZ GENERATOR STUDIO                    */}
      {/* ========================================================= */}
      {activeStudioTab === 'quiz' && (
        <div className="space-y-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                  <Award className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  AI Practice Exam & Knowledge Assessment
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Generate university-grade multiple choice questions with immediate evaluation and in-depth explanations
              </p>
            </div>

            {/* Topic Input & Refresh */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                placeholder="Enter topic..."
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-hidden focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={() => handleActionGenerateQuiz(quizTopic)}
                disabled={quizLoading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${quizLoading ? 'animate-spin' : ''}`} />
                <span>{quizLoading ? 'Generating...' : 'Generate Exam'}</span>
              </button>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {quizQuestions.map((q, qIdx) => {
              const isAnswered = q.userSelectedIndex !== undefined;
              const isCorrect = q.userSelectedIndex === q.correctIndex;

              return (
                <div 
                  key={qIdx}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
                        {qIdx + 1}
                      </span>
                      <span>{q.question}</span>
                    </div>

                    {quizSubmitted && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = q.userSelectedIndex === optIdx;
                      let btnStyle = 'border-slate-200 bg-white hover:border-indigo-300 text-slate-800';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-400/40';
                        } else if (isSelected) {
                          btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold line-through';
                        } else {
                          btnStyle = 'border-slate-100 bg-white opacity-60 text-slate-500';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-2 ring-indigo-400/30';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                          className={`p-3 rounded-xl border text-xs text-left transition flex items-center gap-2.5 cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation reveal */}
                  {quizSubmitted && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1 text-slate-700 animate-in fade-in">
                      <div className="font-bold text-indigo-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Explanation & Curriculum Proof:</span>
                      </div>
                      <p className="leading-relaxed text-slate-600">
                        {q.explanation}
                      </p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Submit & Scoring Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {quizSubmitted ? (
                <span className="font-extrabold text-sm text-slate-900">
                  Final Score: {quizQuestions.filter(q => q.userSelectedIndex === q.correctIndex).length} / {quizQuestions.length} Questions Correct
                </span>
              ) : (
                <span>Answer all questions above, then click submit to verify your score</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {quizSubmitted ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizQuestions(prev => prev.map(q => ({ ...q, userSelectedIndex: undefined })));
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Retake Exam
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Submit Exam</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SMART FLASHCARD DECK STUDIO                        */}
      {/* ========================================================= */}
      {activeStudioTab === 'flashcards' && (
        <div className="space-y-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-100 text-cyan-700 font-bold">
                  <BookmarkPlus className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Active-Recall Flashcard Deck
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Space-repetition active recall cards generated on demand for high-yield exam retention
              </p>
            </div>

            {/* Topic Input & Refresh */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={flashcardTopic}
                onChange={(e) => setFlashcardTopic(e.target.value)}
                placeholder="Topic for flashcards..."
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:outline-hidden focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={() => handleActionGenerateFlashcards(flashcardTopic)}
                disabled={flashcardLoading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${flashcardLoading ? 'animate-spin' : ''}`} />
                <span>{flashcardLoading ? 'Generating...' : 'New Deck'}</span>
              </button>
            </div>
          </div>

          {/* Interactive 3D Flip Card */}
          {flashcards.length > 0 && (
            <div className="max-w-xl mx-auto space-y-4">
              
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
                <span>Card {currentCardIndex + 1} of {flashcards.length}</span>
                <span className="text-indigo-600 font-bold">Click card anywhere to flip</span>
              </div>

              {/* Flashcard container */}
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="w-full min-h-[260px] p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border-2 border-indigo-500/30 shadow-2xl flex flex-col justify-between cursor-pointer select-none transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-indigo-300">
                    {isCardFlipped ? 'Answer & Derivation' : 'Question / Prompt'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActionReadAloud(isCardFlipped ? flashcards[currentCardIndex].back : flashcards[currentCardIndex].front);
                    }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                    title="Read out loud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-6 text-center">
                  <div className="font-extrabold text-base sm:text-lg leading-relaxed whitespace-pre-line text-slate-100">
                    {isCardFlipped ? flashcards[currentCardIndex].back : flashcards[currentCardIndex].front}
                  </div>
                </div>

                <div className="text-center text-[11px] text-indigo-300/80">
                  {isCardFlipped ? 'Click to see question' : 'Click to reveal answer'}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCardFlipped(false);
                    setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : flashcards.length - 1));
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Previous Card
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFlashcards(prev => prev.map((c, i) => i === currentCardIndex ? { ...c, mastered: true } : c));
                      setIsCardFlipped(false);
                      setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mastered</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCardFlipped(false);
                    setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Next Card
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: LIVE VOICE COACHING                                */}
      {/* ========================================================= */}
      {activeStudioTab === 'live_voice' && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border border-indigo-500/30 space-y-6 shadow-2xl">
          
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Gemini Live Voice Coaching
            </span>
            <h3 className="text-2xl font-black">
              Hands-Free Spoken Dialogue
            </h3>
            <p className="text-xs text-slate-400">
              Tap the microphone to speak questions. Gemini will transcribe your voice with <code>gemini-3.5-transcribe</code> and speak back in real-time.
            </p>
          </div>

          {/* Audio Wave Visualizer */}
          <div className="flex items-center justify-center gap-1.5 h-16 py-2">
            {[4, 8, 12, 16, 10, 6, 14, 18, 12, 6, 10, 16, 8, 4].map((h, i) => (
              <span
                key={i}
                style={{ height: liveAudioPlaying || isRecording ? `${h * 3}px` : '8px' }}
                className={`w-2 rounded-full transition-all duration-150 ${
                  isRecording 
                    ? 'bg-rose-500 animate-pulse' 
                    : (liveAudioPlaying ? 'bg-indigo-400 animate-bounce' : 'bg-slate-700')
                }`}
              />
            ))}
          </div>

          {/* Central Microphone Action Button */}
          <div className="flex justify-center">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="px-8 py-4 rounded-3xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm flex items-center gap-3 transition shadow-xl shadow-rose-600/30 active:scale-95 cursor-pointer"
              >
                <Mic className="w-5 h-5" />
                <span>Start Speaking Now</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="px-8 py-4 rounded-3xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center gap-3 transition shadow-xl animate-pulse active:scale-95 cursor-pointer"
              >
                <StopCircle className="w-5 h-5" />
                <span>Done Speaking — Send</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* RECOMMENDED SYLLABUS NOTES FROM EDUVAULT LIBRARY          */}
      {/* ========================================================= */}
      <div className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Recommended Notes From EduVault Library</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Faculty & AI Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {resources.slice(0, 3).map((res) => (
            <div
              key={res.id}
              onClick={() => onOpenResource(res)}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {res.type.replace('_', ' ')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    AI Verified
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 line-clamp-2 hover:text-indigo-600">
                  {res.title}
                </h4>
                <div className="text-[11px] text-slate-400 mt-1">
                  by {res.teacherName}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {res.rating}
                </span>
                <span className="text-indigo-600 font-bold hover:underline flex items-center gap-0.5 text-[11px]">
                  Open Note
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
