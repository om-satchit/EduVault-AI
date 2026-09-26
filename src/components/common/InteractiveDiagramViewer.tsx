import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Plus, 
  Trash2, 
  Sparkles, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Info, 
  Cpu, 
  Zap, 
  Activity, 
  ArrowRight, 
  CornerDownRight,
  Database,
  Terminal,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { EducationalResource } from '../../types';

interface InteractiveDiagramViewerProps {
  resource?: EducationalResource | null;
  initialDiagramType?: 'linked_list' | 'java_oop' | 'os_process' | 'dbms' | 'concept_graph';
  onAskAIAboutConcept?: (concept: string) => void;
}

interface LinkedListNode {
  id: string;
  value: number | string;
  address: string;
  nextId: string | null;
  prevId?: string | null;
}

const DEFAULT_FALLBACK_RESOURCE: EducationalResource = {
  id: 'res-diag-engine',
  title: 'Data Structures & System Architecture Master Visualizer',
  description: 'Interactive architecture diagrams simulating linked structures, heap memory, process schedulers, and relational schemas.',
  subject: 'Computer Science',
  unit: 'Core Systems & Foundations',
  chapter: 'Memory Models & Runtime Execution',
  topic: 'Interactive Visual Architecture',
  difficulty: 'Advanced',
  content: 'Interactive architecture diagrams simulating linked structures, heap memory, process schedulers, and relational schemas.',
  teacherName: 'EduVault Faculty',
  teacherRole: 'Senior Systems Architect',
  institutionName: 'EduVault Academic Faculty',
  isAiVerified: true,
  isFacultyReviewed: true,
  isInstitutionVerified: true,
  lastVerifiedDate: '2026-09-26',
  rating: 4.9,
  reviewCount: 142,
  studentsCount: 1250,
  version: '1.0',
  versionHistory: [],
  feedbacks: [],
  language: 'English',
  targetClass: 'Computer Science Undergrad',
  outline: [
    'Linear Pointer Chains (O(1) Prepend vs O(N) Access)',
    'Floyd Tortoise & Hare Cycle Collision Proof',
    'JVM Constructor Initializer Memory Model'
  ],
  type: 'notes'
};

export const InteractiveDiagramViewer: React.FC<InteractiveDiagramViewerProps> = ({
  resource = DEFAULT_FALLBACK_RESOURCE,
  initialDiagramType,
  onAskAIAboutConcept
}) => {
  const safeRes = resource || DEFAULT_FALLBACK_RESOURCE;
  // Determine diagram type from resource
  const resSubject = safeRes.subject.toLowerCase();
  const resTopic = (safeRes.topic + ' ' + safeRes.title + ' ' + safeRes.content).toLowerCase();

  let defaultDiagramType: 'linked_list' | 'java_oop' | 'os_process' | 'dbms' | 'concept_graph' = initialDiagramType || 'linked_list';
  if (!initialDiagramType) {
    if (resTopic.includes('linked list') || resTopic.includes('node') || resTopic.includes('pointer')) {
      defaultDiagramType = 'linked_list';
    } else if (resTopic.includes('constructor') || resTopic.includes('oop') || resTopic.includes('jvm') || resTopic.includes('heap')) {
      defaultDiagramType = 'java_oop';
    } else if (resTopic.includes('process') || resTopic.includes('scheduling') || resTopic.includes('deadlock') || resTopic.includes('operating system')) {
      defaultDiagramType = 'os_process';
    } else if (resTopic.includes('dbms') || resTopic.includes('normal') || resTopic.includes('sql') || resTopic.includes('database')) {
      defaultDiagramType = 'dbms';
    }
  }

  const [activeDiagramType, setActiveDiagramType] = useState<string>(initialDiagramType || defaultDiagramType);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<any | null>(null);

  // ----------------------------------------------------
  // LINKED LIST INTERACTIVE STATE
  // ----------------------------------------------------
  const [llNodes, setLlNodes] = useState<LinkedListNode[]>([
    { id: 'n1', value: 10, address: '0x7FFE0010', nextId: 'n2' },
    { id: 'n2', value: 20, address: '0x7FFE0030', nextId: 'n3' },
    { id: 'n3', value: 30, address: '0x7FFE0050', nextId: null }
  ]);
  const [llActiveIndex, setLlActiveIndex] = useState<number | null>(0);
  const [isTraversalPlaying, setIsTraversalPlaying] = useState(false);
  const [llNewValue, setLlNewValue] = useState<string>('40');
  const [llMode, setLlMode] = useState<'singly' | 'doubly' | 'floyd_cycle'>('singly');
  const [floydSlow, setFloydSlow] = useState(0);
  const [floydFast, setFloydFast] = useState(0);
  const [floydMet, setFloydMet] = useState(false);

  // ----------------------------------------------------
  // JAVA OOP CONSTRUCTOR LIFECYCLE SCRUBBER
  // ----------------------------------------------------
  const [jvmStep, setJvmStep] = useState(1);
  const [isJvmPlaying, setIsJvmPlaying] = useState(false);

  // ----------------------------------------------------
  // OS PROCESS STATE MACHINE
  // ----------------------------------------------------
  const [osState, setOsState] = useState<'NEW' | 'READY' | 'RUNNING' | 'WAITING' | 'TERMINATED'>('READY');
  const [rrQuantumTick, setRrQuantumTick] = useState(0);

  // ----------------------------------------------------
  // TIMERS / ANIMATION LOOPS
  // ----------------------------------------------------
  useEffect(() => {
    let timer: any = null;
    if (isTraversalPlaying && activeDiagramType === 'linked_list') {
      timer = setInterval(() => {
        setLlActiveIndex(prev => {
          if (prev === null) return 0;
          if (prev >= llNodes.length - 1) {
            setIsTraversalPlaying(false);
            return null;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTraversalPlaying, llNodes.length, activeDiagramType]);

  useEffect(() => {
    let timer: any = null;
    if (isJvmPlaying && activeDiagramType === 'java_oop') {
      timer = setInterval(() => {
        setJvmStep(prev => {
          if (prev >= 5) {
            setIsJvmPlaying(false);
            return 1;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isJvmPlaying, activeDiagramType]);

  // Linked list mutations
  const handleInsertHead = () => {
    const val = parseInt(llNewValue) || Math.floor(Math.random() * 90) + 10;
    const newId = 'n_' + Date.now();
    const hex = '0x7FFE' + Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
    
    setLlNodes(prev => [
      { id: newId, value: val, address: hex, nextId: prev[0]?.id || null },
      ...prev
    ]);
    setLlActiveIndex(0);
  };

  const handleAppendTail = () => {
    const val = parseInt(llNewValue) || Math.floor(Math.random() * 90) + 10;
    const newId = 'n_' + Date.now();
    const hex = '0x7FFE' + Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');

    setLlNodes(prev => {
      if (prev.length === 0) {
        return [{ id: newId, value: val, address: hex, nextId: null }];
      }
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        nextId: newId
      };
      updated.push({ id: newId, value: val, address: hex, nextId: null });
      return updated;
    });
    setLlActiveIndex(llNodes.length);
  };

  const handleDeleteHead = () => {
    if (llNodes.length === 0) return;
    setLlNodes(prev => prev.slice(1));
    setLlActiveIndex(null);
  };

  const handleStepFloyd = () => {
    const cycleLen = 4;
    const nextSlow = (floydSlow + 1) % cycleLen;
    const nextFast = (floydFast + 2) % cycleLen;
    setFloydSlow(nextSlow);
    setFloydFast(nextFast);
    if (nextSlow === nextFast) {
      setFloydMet(true);
    } else {
      setFloydMet(false);
    }
  };

  const handleResetFloyd = () => {
    setFloydSlow(0);
    setFloydFast(0);
    setFloydMet(false);
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full min-h-[600px]">
      
      {/* Top Diagram Toolbar */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400 shadow-inner">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base">
                Interactive Architecture & Concept Diagram
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Live Simulation
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Visualizing memory models, asymptotic complexity, and execution pointers
            </div>
          </div>
        </div>

        {/* Diagram Archetype Selector */}
        <div className="flex items-center bg-slate-800/90 rounded-2xl p-1 border border-slate-700/60 text-xs">
          <button
            onClick={() => setActiveDiagramType('linked_list')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeDiagramType === 'linked_list'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Linked List Memory</span>
          </button>

          <button
            onClick={() => setActiveDiagramType('java_oop')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeDiagramType === 'java_oop'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>JVM Heap & Stack</span>
          </button>

          <button
            onClick={() => setActiveDiagramType('os_process')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeDiagramType === 'os_process'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Process State Machine</span>
          </button>

          <button
            onClick={() => setActiveDiagramType('dbms')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeDiagramType === 'dbms'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>DBMS Normalization</span>
          </button>

          <button
            onClick={() => setActiveDiagramType('concept_graph')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeDiagramType === 'concept_graph'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Concept Graph</span>
          </button>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 rounded-xl p-1 border border-slate-700/60">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono px-1.5 text-slate-300">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 text-[10px] font-bold"
            title="Reset Zoom"
          >
            100%
          </button>
        </div>

      </div>

      {/* Main Canvas & Inspector Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
        
        {/* Visualizer Canvas (3 cols) */}
        <div className="lg:col-span-3 p-6 sm:p-8 flex flex-col justify-between overflow-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] relative">
          
          {/* Zoom Wrapper */}
          <div 
            className="flex-1 flex flex-col justify-center items-center transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >

            {/* ========================================================= */}
            {/* 1. LINKED LIST INTERACTIVE MEMORY ARCHITECTURE            */}
            {/* ========================================================= */}
            {activeDiagramType === 'linked_list' && (
              <div className="w-full max-w-3xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Sub-mode selector */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Visualization Sub-mode:</span>
                    <button
                      onClick={() => setLlMode('singly')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        llMode === 'singly' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Singly Linked List
                    </button>
                    <button
                      onClick={() => setLlMode('doubly')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        llMode === 'doubly' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Doubly Linked List (DLL)
                    </button>
                    <button
                      onClick={() => setLlMode('floyd_cycle')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        llMode === 'floyd_cycle' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Floyd Cycle Detection
                    </button>
                  </div>

                  <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                    O(1) Insertion • O(N) Search
                  </div>
                </div>

                {/* Singly / Doubly View */}
                {llMode !== 'floyd_cycle' ? (
                  <div className="space-y-6">
                    {/* Head Pointer Label */}
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 animate-pulse">
                        <span>HEAD Pointer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-mono text-indigo-300">
                        Points to {llNodes[0]?.address || 'NULL'}
                      </span>
                    </div>

                    {/* Nodes Chain Render */}
                    <div className="flex flex-wrap items-center gap-4 py-4 overflow-x-auto">
                      {llNodes.map((node, idx) => {
                        const isActive = llActiveIndex === idx;
                        return (
                          <div key={node.id} className="flex items-center gap-3 shrink-0">
                            
                            {/* Single Node Card */}
                            <div
                              onClick={() => setSelectedNodeInfo({
                                type: 'Linked List Node',
                                address: node.address,
                                value: node.value,
                                nextAddress: llNodes[idx + 1]?.address || 'NULL (0x0000)',
                                prevAddress: idx > 0 ? llNodes[idx - 1].address : 'NULL (0x0000)',
                                overhead: '16 bytes (Object header + 64-bit reference pointer)',
                                complexity: idx === 0 ? 'O(1) access from Head' : `O(${idx + 1}) linear traversal hops required`
                              })}
                              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer transform hover:-translate-y-1 shadow-xl ${
                                isActive
                                  ? 'bg-indigo-950/90 border-indigo-400 shadow-indigo-500/20 ring-4 ring-indigo-500/20 scale-105'
                                  : 'bg-slate-900 border-slate-700/80 hover:border-slate-500'
                              }`}
                            >
                              {/* Node Address tag */}
                              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-slate-800">
                                <span className="text-indigo-400 font-bold">Node #{idx + 1}</span>
                                <span>{node.address}</span>
                              </div>

                              {/* Node Memory Layout: [ Value | Next Pointer ] */}
                              <div className="mt-2.5 flex items-stretch gap-1.5 text-xs font-mono">
                                <div className="px-3 py-2 rounded-xl bg-slate-800 text-white font-extrabold flex flex-col items-center">
                                  <span className="text-[9px] uppercase tracking-wider text-slate-400">DATA</span>
                                  <span className="text-base text-amber-300 font-bold">{node.value}</span>
                                </div>
                                <div className="px-3 py-2 rounded-xl bg-indigo-900/60 text-indigo-200 border border-indigo-700/40 flex flex-col items-center">
                                  <span className="text-[9px] uppercase tracking-wider text-indigo-400">NEXT *</span>
                                  <span className="text-xs font-mono font-bold">
                                    {llNodes[idx + 1]?.address.slice(0, 6) || 'NULL'}
                                  </span>
                                </div>
                              </div>

                              {/* DLL prev indicator */}
                              {llMode === 'doubly' && (
                                <div className="mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30 flex items-center justify-between">
                                  <span>PREV *</span>
                                  <span>{idx > 0 ? llNodes[idx - 1].address.slice(0, 6) : 'NULL'}</span>
                                </div>
                              )}
                            </div>

                            {/* Arrow to Next Node */}
                            <div className="flex flex-col items-center gap-0.5 text-indigo-400">
                              <span className="font-mono text-[10px] text-slate-500">.next</span>
                              <div className="flex items-center">
                                <div className="w-8 h-0.5 bg-indigo-500" />
                                <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-indigo-500" />
                              </div>
                              {llMode === 'doubly' && (
                                <div className="flex items-center rotate-180 text-emerald-500">
                                  <div className="w-8 h-0.5 bg-emerald-500" />
                                  <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-emerald-500" />
                                </div>
                              )}
                            </div>

                          </div>
                        );
                      })}

                      {/* NULL Terminator */}
                      <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-dashed border-rose-500/50 text-rose-400 font-mono font-extrabold text-xs shadow-inner flex flex-col items-center">
                        <span className="text-[9px] text-slate-500">TERMINATOR</span>
                        <span>NULL (0x0)</span>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* Floyd Cycle Detection Interactive Simulator */
                  <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-amber-400" />
                          <span>Floyd's Tortoise and Hare Loop Detection Simulator</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Slow pointer moves 1 step per tick; Fast pointer moves 2 steps. Inside a cycle, distance between them decreases by 1 each step!
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleStepFloyd}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition"
                        >
                          Step Pointers →
                        </button>
                        <button
                          onClick={handleResetFloyd}
                          className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Cycle Ring Visualizer */}
                    <div className="relative py-8 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-8 w-72">
                        {['Node A (0x10)', 'Node B (0x20)', 'Node D (0x40)', 'Node C (0x30)'].map((name, i) => (
                          <div 
                            key={name}
                            className={`p-4 rounded-2xl border text-center font-mono text-xs transition-all ${
                              floydMet && floydSlow === i
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-400 font-bold scale-110'
                                : (floydSlow === i || floydFast === i)
                                  ? 'bg-amber-950 border-amber-400 text-amber-200'
                                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="font-bold">{name}</div>
                            <div className="flex items-center justify-center gap-1.5 mt-2">
                              {floydSlow === i && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-500 text-white text-[9px] font-bold animate-bounce">
                                  🐢 Slow
                                </span>
                              )}
                              {floydFast === i && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-bold animate-bounce">
                                  🐇 Fast
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {floydMet && (
                      <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span><strong>Cycle Verified!</strong> Slow and Fast pointers collided at node. Proves cycle existence in O(N) time with O(1) space!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Traversal & Mutation Controls */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  
                  {/* Traversal player */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTraversalPlaying(!isTraversalPlaying)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      {isTraversalPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isTraversalPlaying ? 'Pause Traversal' : 'Animate Traversal'}</span>
                    </button>

                    <button
                      onClick={() => setLlActiveIndex(prev => (prev === null || prev >= llNodes.length - 1 ? 0 : prev + 1))}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                      title="Step forward one node"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => { setLlActiveIndex(0); setIsTraversalPlaying(false); }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Reset pointer to head"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <span className="text-xs text-slate-400 ml-2 font-mono">
                      Current: {llActiveIndex !== null ? `Node ${llActiveIndex + 1} (${llNodes[llActiveIndex]?.address})` : 'Idle'}
                    </span>
                  </div>

                  {/* Mutate List: Add / Delete */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={llNewValue}
                      onChange={(e) => setLlNewValue(e.target.value)}
                      placeholder="Val"
                      className="w-16 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-hidden"
                    />
                    
                    <button
                      onClick={handleInsertHead}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition"
                      title="Insert Node at Head (O(1))"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Prepend Head O(1)</span>
                    </button>

                    <button
                      onClick={handleAppendTail}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 transition border border-slate-700"
                      title="Append to Tail (O(N))"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Append Tail</span>
                    </button>

                    <button
                      onClick={handleDeleteHead}
                      disabled={llNodes.length <= 1}
                      className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 disabled:opacity-30"
                      title="Delete Head Node"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* 2. JVM HEAP VS STACK CONSTRUCTOR LIFECYCLE               */}
            {/* ========================================================= */}
            {activeDiagramType === 'java_oop' && (
              <div className="w-full max-w-3xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Step indicator header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-indigo-400" />
                      <span>JVM Constructor Execution & Memory Model</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Step {jvmStep} of 5: {
                        jvmStep === 1 ? '1. Heap Memory Allocation' :
                        jvmStep === 2 ? '2. Default Zero Initialization' :
                        jvmStep === 3 ? '3. Explicit Field Initializers' :
                        jvmStep === 4 ? '4. Constructor Body & Chaining this()' :
                        '5. Reference Pointer Returned to Stack'
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsJvmPlaying(!isJvmPlaying)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1"
                    >
                      {isJvmPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isJvmPlaying ? 'Pause' : 'Play Lifecycle'}</span>
                    </button>
                    <button
                      onClick={() => setJvmStep(prev => (prev >= 5 ? 1 : prev + 1))}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                    >
                      Next Step →
                    </button>
                  </div>
                </div>

                {/* Stack vs Heap Side-by-Side Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* STACK MEMORY */}
                  <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        Stack Frame (Thread Execution)
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Fast • LIFO</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                      <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                        Method: <span className="text-white">main(String[] args)</span>
                      </div>
                      <div className={`p-3 rounded-xl border transition-all ${
                        jvmStep === 5 
                          ? 'bg-indigo-950/80 border-indigo-400 text-white ring-2 ring-indigo-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-300">Student s:</span>
                          <span className="font-mono text-amber-300">
                            {jvmStep === 5 ? '0x5B80 (HEAP REF)' : 'uninitialized'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* HEAP MEMORY */}
                  <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" />
                        JVM Heap Memory
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Dynamic • GC Managed</span>
                    </div>

                    {/* Heap Object Card */}
                    <div className={`p-4 rounded-2xl border transition-all space-y-2.5 font-mono text-xs ${
                      jvmStep >= 1
                        ? 'bg-slate-950 border-amber-500/40 shadow-xl shadow-amber-500/5'
                        : 'bg-slate-950/40 border-slate-800 opacity-40'
                    }`}>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-amber-400 font-bold">Instance @ 0x5B80</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Student.class</span>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                          <span className="text-slate-400">id:</span>
                          <span className={`font-bold ${jvmStep >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {jvmStep >= 4 ? '"S101"' : (jvmStep >= 2 ? 'null' : 'allocating...')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                          <span className="text-slate-400">name:</span>
                          <span className={`font-bold ${jvmStep >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {jvmStep >= 4 ? '"Alice"' : (jvmStep >= 2 ? 'null' : 'allocating...')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                          <span className="text-slate-400">gpa:</span>
                          <span className={`font-bold ${jvmStep >= 4 ? 'text-emerald-400' : (jvmStep >= 3 ? 'text-indigo-400' : 'text-slate-500')}`}>
                            {jvmStep >= 4 ? '3.9' : (jvmStep >= 2 ? '0.0' : 'allocating...')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Step Explanation Card */}
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-3">
                  <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-white block mb-0.5">
                      Why order matters for exam questions:
                    </span>
                    If an overridden method is called inside a superclass constructor, it accesses subclass fields while they still contain their default values (e.g. 0 or null), before step 3 or 4 runs!
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* 3. OPERATING SYSTEMS PROCESS STATE MACHINE & SCHEDULING  */}
            {/* ========================================================= */}
            {activeDiagramType === 'os_process' && (
              <div className="w-full max-w-3xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <span>Operating System Process Lifecycle & Scheduling Timeline</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Click any state to inspect PCB (Process Control Block) registers and context switches
                    </p>
                  </div>
                </div>

                {/* State Machine Flowchart */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    
                    {/* NEW */}
                    <div 
                      onClick={() => setOsState('NEW')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition text-center w-28 ${
                        osState === 'NEW' ? 'bg-indigo-950 border-indigo-400 text-white ring-2 ring-indigo-400 scale-105' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] text-slate-500 font-mono">1. CREATED</div>
                      <div className="font-extrabold text-sm text-indigo-300">NEW</div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

                    {/* READY */}
                    <div 
                      onClick={() => setOsState('READY')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition text-center w-28 ${
                        osState === 'READY' ? 'bg-blue-950 border-blue-400 text-white ring-2 ring-blue-400 scale-105' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] text-slate-500 font-mono">Ready Queue</div>
                      <div className="font-extrabold text-sm text-blue-300">READY</div>
                    </div>

                    <div className="flex flex-col items-center text-xs text-slate-500 font-mono">
                      <span>dispatch →</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                      <span>← interrupt</span>
                    </div>

                    {/* RUNNING */}
                    <div 
                      onClick={() => setOsState('RUNNING')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition text-center w-28 ${
                        osState === 'RUNNING' ? 'bg-emerald-950 border-emerald-400 text-white ring-2 ring-emerald-400 scale-105 animate-pulse' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] text-emerald-400 font-mono">On CPU</div>
                      <div className="font-extrabold text-sm text-emerald-300">RUNNING</div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

                    {/* TERMINATED */}
                    <div 
                      onClick={() => setOsState('TERMINATED')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition text-center w-28 ${
                        osState === 'TERMINATED' ? 'bg-rose-950 border-rose-400 text-white ring-2 ring-rose-400 scale-105' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] text-slate-500 font-mono">Exit</div>
                      <div className="font-extrabold text-sm text-rose-300">EXIT / DEAD</div>
                    </div>

                  </div>

                  {/* WAITING / BLOCKED branch below */}
                  <div className="pt-2 flex justify-center">
                    <div 
                      onClick={() => setOsState('WAITING')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition text-center w-64 ${
                        osState === 'WAITING' ? 'bg-amber-950 border-amber-400 text-white ring-2 ring-amber-400 scale-105' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] text-amber-400 font-mono">I/O or Event Wait</div>
                      <div className="font-extrabold text-sm text-amber-300">WAITING / BLOCKED</div>
                      <div className="text-[10px] text-slate-500 mt-1">Moves back to READY upon I/O completion</div>
                    </div>
                  </div>
                </div>

                {/* Round Robin Timeline Simulation */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Round Robin Gantt Chart (Time Quantum = 2ms):</span>
                    <button
                      onClick={() => setRrQuantumTick(prev => (prev + 1) % 6)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold"
                    >
                      Tick Quantum +2ms
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-1 font-mono text-xs text-center">
                    {['P1 (0-2ms)', 'P2 (2-4ms)', 'P3 (4-6ms)', 'P1 (6-8ms)', 'P2 (8-10ms)', 'P3 (10-12ms)'].map((slot, i) => (
                      <div 
                        key={slot}
                        className={`p-2 rounded-xl border transition ${
                          rrQuantumTick === i 
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-300 scale-105 shadow-md' 
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* 4. DBMS NORMALIZATION DEPENDENCY GRAPH                    */}
            {/* ========================================================= */}
            {activeDiagramType === 'dbms' && (
              <div className="w-full max-w-3xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-indigo-400" />
                      <span>Relational Database Normalization Stages</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Eliminating Insertion, Deletion, and Update Anomalies
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1NF */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      1NF (First Normal Form)
                    </span>
                    <h5 className="font-bold text-white text-xs">Atomic Values</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Every cell in every row must hold only single atomic scalars. No comma lists like `{"{Java, Python}"}`!
                    </p>
                  </div>

                  {/* 2NF */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      2NF (Second Normal Form)
                    </span>
                    <h5 className="font-bold text-white text-xs">No Partial Dependencies</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Must be in 1NF. Every non-prime attribute must depend on the FULL composite candidate key, not a slice.
                    </p>
                  </div>

                  {/* 3NF */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      3NF & BCNF
                    </span>
                    <h5 className="font-bold text-white text-xs">No Transitive Dependencies</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      If A → B and B → C, then C must not depend transitively on A through non-candidate key B.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 5. CONCEPT GRAPH / HIERARCHICAL MINDMAP                  */}
            {/* ========================================================= */}
            {activeDiagramType === 'concept_graph' && (
              <div className="w-full max-w-3xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <span>{safeRes.topic} — Academic Concept Hierarchy</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Interactive breakdown of prerequisite nodes, core axioms, and exam test-cases
                    </p>
                  </div>
                </div>

                {/* Concept Nodes Graph */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                  {/* Root Node */}
                  <div className="flex justify-center">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-sm shadow-xl text-center max-w-xs ring-4 ring-indigo-500/20">
                      <div>{safeRes.title}</div>
                      <div className="text-[10px] font-normal text-indigo-200 mt-1">Core Subject Axiom</div>
                    </div>
                  </div>

                  {/* Branching Connectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {safeRes.outline.slice(0, 3).map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedNodeInfo({
                          type: 'Curriculum Node',
                          title: item,
                          details: `Unit checkpoint from ${safeRes.subject} course module. Tested extensively in midterm exams.`,
                          examTips: 'Focus on corner cases and boundary conditions.'
                        })}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-400 transition cursor-pointer space-y-2 hover:-translate-y-1 shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-400">Node #{i + 1}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Verified</span>
                        </div>
                        <div className="font-bold text-xs text-slate-200">{typeof item === 'string' ? item : (item as any)?.title || 'Checkpoint'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Canvas Hint */}
          <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Click on any node, box, or pointer to inspect detailed register memory and time complexity</span>
            </div>
            {onAskAIAboutConcept && (
              <button
                onClick={() => onAskAIAboutConcept(`Explain the diagram architecture for ${safeRes.topic}`)}
                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 text-xs"
              >
                <span>Ask AI Tutor About Diagram</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

        </div>

        {/* Node Property Inspector Panel (1 col) */}
        <div className="border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs text-white">Element Inspector</span>
            </div>
            <span className="text-[10px] text-slate-500">Real-time</span>
          </div>

          {selectedNodeInfo ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                  {selectedNodeInfo.type}
                </span>
                <div className="font-extrabold text-sm text-white">
                  {selectedNodeInfo.address || selectedNodeInfo.title}
                </div>
              </div>

              {selectedNodeInfo.value !== undefined && (
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Payload Data:</span>
                    <span className="text-amber-300 font-bold">{selectedNodeInfo.value}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Next Pointer:</span>
                    <span className="text-indigo-300 font-bold">{selectedNodeInfo.nextAddress}</span>
                  </div>
                  {selectedNodeInfo.prevAddress && (
                    <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">Prev Pointer:</span>
                      <span className="text-emerald-300 font-bold">{selectedNodeInfo.prevAddress}</span>
                    </div>
                  )}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[10px]">Memory Overhead:</span>
                    <span className="text-slate-200 text-[11px]">{selectedNodeInfo.overhead}</span>
                  </div>
                </div>
              )}

              {selectedNodeInfo.complexity && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                  <span className="font-bold block mb-0.5">Asymptotic Cost:</span>
                  <span>{selectedNodeInfo.complexity}</span>
                </div>
              )}

              {selectedNodeInfo.details && (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedNodeInfo.details}
                </p>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs space-y-2">
              <Activity className="w-8 h-8 mx-auto text-slate-700 animate-pulse" />
              <p>Click any memory cell or node in the diagram to inspect pointer references and allocation cost.</p>
            </div>
          )}

          {/* Quick Concept Cheatsheet */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Exam Cheatsheet Callouts
            </span>
            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <span className="font-bold text-amber-300 block mb-0.5">Pointer Arithmetic:</span>
                Arrays allow `ptr + i` instant dereference; Linked lists must walk node-by-node.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <span className="font-bold text-indigo-300 block mb-0.5">Cache Locality:</span>
                Heap allocations cause CPU L1/L2 cache misses compared to contiguous array blocks.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
