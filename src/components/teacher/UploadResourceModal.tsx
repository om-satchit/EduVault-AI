import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  FileText, 
  Video, 
  Presentation, 
  BookOpen, 
  HelpCircle, 
  Brain, 
  Link2, 
  ShieldCheck, 
  Lock, 
  Globe2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ResourceType, DifficultyLevel, EducationalResource } from '../../types';
import { SUBJECT_HIERARCHY } from '../../data/mockData';

interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitForVerification: (draftData: Partial<EducationalResource>) => void;
}

export const UploadResourceModal: React.FC<UploadResourceModalProps> = ({
  isOpen,
  onClose,
  onSubmitForVerification
}) => {
  const [subject, setSubject] = useState('Computer Science');
  const [unit, setUnit] = useState('Unit 2');
  const [chapter, setChapter] = useState('Linear Data Structures');
  const [topic, setTopic] = useState('Linked Lists');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [targetClass, setTargetClass] = useState('B.Tech CSE - 2nd Year');
  const [language, setLanguage] = useState('English');
  const [resourceType, setResourceType] = useState<ResourceType>('notes');
  const [isPrivateToClass, setIsPrivateToClass] = useState(false);
  const [classCode, setClassCode] = useState('CSE-A-DS');

  const [title, setTitle] = useState('Linked Lists — Visual Architecture & Memory Pointers');
  const [description, setDescription] = useState('Comprehensive visual notes covering pointer manipulation, circular structures, and memory tradeoffs.');
  const [content, setContent] = useState(`# Linked Lists Architecture & Node Structuring

## 1. Abstract
Linked Lists allow dynamic memory expansion without contiguous physical reallocation.

## 2. Java Implementation Pattern
\`\`\`java
public class Node<T> {
    T val;
    Node<T> next;
    public Node(T v) { this.val = v; }
}
\`\`\`

## 3. Complexity Guarantees
- Prepend: O(1)
- Search: O(N)
- Delete Node: O(1) given predecessor reference.`);

  if (!isOpen) return null;

  const resourceTypeCards: { type: ResourceType; label: string; icon: string; desc: string }[] = [
    { type: 'notes', label: 'Short Notes', icon: '📄', desc: 'Concise, high-yield revision summaries' },
    { type: 'ppt', label: 'Presentation / PPT', icon: '📊', desc: 'Slide decks & lecture presentations' },
    { type: 'video', label: 'Video Lecture', icon: '📹', desc: 'Screen recording or explainer video' },
    { type: 'textbook', label: 'PDF / Textbook', icon: '📘', desc: 'Deep dive chapters & reference guides' },
    { type: 'question_bank', label: 'Question Bank', icon: '📝', desc: 'Exam questions with marking schemes' },
    { type: 'quiz', label: 'Interactive Quiz', icon: '🧠', desc: 'Knowledge check assessment questions' },
    { type: 'external', label: 'External Resource', icon: '🔗', desc: 'Curated links, papers, or repositories' },
  ];

  const handleQuickPreset = (presetType: 'clean' | 'outdated' | 'error') => {
    if (presetType === 'clean') {
      setTitle('Binary Search Trees & AVL Balancing');
      setTopic('Linked Lists');
      setContent(`# Binary Search Trees & Node Rotation Rules
Binary search trees enforce the property that for every node, left sub-tree values are strictly smaller and right sub-tree values are strictly larger.
Tree height stays logarithmic O(log N) through AVL balancing.`);
    } else if (presetType === 'outdated') {
      setTitle('Legacy Java Collections & Vector Enumerations');
      setContent(`# Legacy Collection Architectures
In older systems, developers used Vector and Hashtable with Enumeration methods.
Note: Vector is synchronized by default which causes lock contention compared to ArrayList.`);
    } else {
      setTitle('Experimental Hash Indexing Test');
      setContent(`# Hash Structures
Search is O(1) in linked lists when we have pointers, but linear scan takes O(1) if elements are contiguous.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitForVerification({
      title,
      description,
      subject,
      unit,
      chapter,
      topic,
      difficulty,
      type: resourceType,
      language,
      targetClass,
      isPrivateToClass,
      classCode: isPrivateToClass ? classCode : undefined,
      content,
      outline: [
        '1. Conceptual Overview',
        '2. Implementation & Code Examples',
        '3. Complexity Analysis & Pitfalls'
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Upload New Educational Resource</h3>
              <p className="text-xs text-emerald-100">Content will pass through the AI Verification pipeline before public discovery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Section 1: What do you want to teach? */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                1. What do you want to teach?
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Quick test presets:</span>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('clean')}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100"
                >
                  Ideal Note
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('outdated')}
                  className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold hover:bg-amber-100"
                >
                  Legacy Warning
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                >
                  {Object.keys(SUBJECT_HIERARCHY).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                >
                  <option value="Unit 1">Unit 1: Object Principles</option>
                  <option value="Unit 2">Unit 2: Linear Data Structures</option>
                  <option value="Unit 3">Unit 3: Operating Systems</option>
                  <option value="Unit 4">Unit 4: Relational Databases</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chapter / Module</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="e.g. Linear Data Structures"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="e.g. Linked Lists"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class / Cohort</label>
                <input
                  type="text"
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="e.g. B.Tech CSE - 2nd Year"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                  <option value="Bengali">বাংলা (Bengali)</option>
                  <option value="Spanish">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Audience Privacy</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPrivateToClass(false)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition ${
                      !isPrivateToClass 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Globe2 className="w-3.5 h-3.5" />
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPrivateToClass(true)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition ${
                      isPrivateToClass 
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800' 
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Private
                  </button>
                </div>
              </div>
            </div>

            {isPrivateToClass && (
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between">
                <div>
                  <span className="font-bold">Restricted to Enrolled Class: </span>
                  <span>Only students belonging to class <span className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-indigo-200">CSE-A-DS</span> can view this material.</span>
                </div>
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  className="w-32 px-2.5 py-1 text-xs rounded-lg border border-indigo-300 bg-white font-mono uppercase"
                  placeholder="Class Code"
                />
              </div>
            )}
          </div>

          {/* Section 2: Resource Type Selection */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. What type of resource are you uploading?
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {resourceTypeCards.map((card) => {
                const isSelected = resourceType === card.type;
                return (
                  <button
                    key={card.type}
                    type="button"
                    onClick={() => setResourceType(card.type)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{card.icon}</span>
                    <span className={`text-[11px] font-bold block ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {card.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Content details */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Resource Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                placeholder="e.g. Linked Lists Made Easy — Complete Visual Notes"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                placeholder="A concise summary of what students will master..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Content Body (Markdown & Code supported)
              </label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                placeholder="# Unit Notes..."
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>EduVault AI will check factual accuracy, obsolete methods, and curriculum relevance.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI Verification Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
