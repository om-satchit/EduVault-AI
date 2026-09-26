import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  UploadCloud, 
  Users, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Globe2, 
  Eye, 
  Edit3, 
  GitBranch, 
  Layers, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { EducationalResource, TeacherProfile } from '../../types';

interface TeacherDashboardProps {
  teacherProfile: TeacherProfile;
  resources: EducationalResource[];
  onOpenUpload: () => void;
  onOpenResource: (resource: EducationalResource) => void;
  onOpenVerificationReport: (resource: EducationalResource) => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacherProfile,
  resources,
  onOpenUpload,
  onOpenResource,
  onOpenVerificationReport,
  activeTab = 'dashboard',
  onSelectTab
}) => {
  const [internalTab, setInternalTab] = useState<'overview' | 'resources' | 'classes' | 'verification' | 'history'>('overview');
  const [resourceSearch, setResourceSearch] = useState('');
  const [selectedResourceTypeFilter, setSelectedResourceTypeFilter] = useState<string>('all');

  // Sync internal tab if activeTab changes from Navbar
  const currentTab = useMemo(() => {
    if (activeTab === 'dashboard') return 'overview';
    if (activeTab === 'resources') return 'resources';
    if (activeTab === 'classrooms') return 'classes';
    if (activeTab === 'verification') return 'verification';
    if (activeTab === 'history') return 'history';
    return internalTab;
  }, [activeTab, internalTab]);

  const handleTabChange = (t: 'overview' | 'resources' | 'classes' | 'verification' | 'history') => {
    setInternalTab(t);
    if (onSelectTab) {
      if (t === 'overview') onSelectTab('dashboard');
      else if (t === 'resources') onSelectTab('resources');
      else if (t === 'classes') onSelectTab('classrooms');
      else if (t === 'verification') onSelectTab('verification');
      else onSelectTab(t);
    }
  };

  const teacherResources = resources.filter(r => r.teacherName === teacherProfile.fullName || r.teacherName.includes('Rahul'));
  
  const totalStudents = teacherResources.reduce((acc, r) => acc + r.studentsCount, 0);
  const avgRating = (teacherResources.reduce((acc, r) => acc + r.rating, 0) / (teacherResources.length || 1)).toFixed(1);
  const needingReviewCount = teacherResources.filter(r => r.aiReport?.status === 'review_required').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-md">
              <img 
                src={teacherProfile.avatarUrl} 
                alt={teacherProfile.fullName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Good morning, {teacherProfile.fullName.split(' ')[0] === 'Prof.' || teacherProfile.fullName.split(' ')[0] === 'Dr.' ? teacherProfile.fullName : `Professor ${teacherProfile.fullName}`} 👋
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  Verified Faculty
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                {teacherProfile.position} • {teacherProfile.institution}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-lg shadow-black/10 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3] text-emerald-700" />
              <span>Upload New Resource</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Uploaded */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Resources</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{teacherResources.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">3 Active Subjects</div>
          </div>
        </div>

        {/* Students Reached */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Learners Reached</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{totalStudents.toLocaleString()}</div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">+14% this month</div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Resource Ratings</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{avgRating} / 5.0</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Community feedback</div>
          </div>
        </div>

        {/* Needs Review */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Needs Review</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{needingReviewCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {needingReviewCount === 0 ? 'All audits clean' : 'Action suggested'}
            </div>
          </div>
        </div>

        {/* AI Verification Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">AI Verification</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600">100% Passed</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Audited Sep 2026</div>
          </div>
        </div>

      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => handleTabChange('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            currentTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          My Uploaded Resources ({teacherResources.length})
        </button>
        <button
          onClick={() => handleTabChange('classes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            currentTab === 'classes'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Classroom Spaces (CSE-A)
        </button>
        <button
          onClick={() => handleTabChange('verification')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'verification'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>AI Verification Hub</span>
        </button>
        <button
          onClick={() => handleTabChange('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            currentTab === 'history'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Version History & Auto-Audit
        </button>
      </div>

      {/* TAB 1: UPLOADED RESOURCES LIST */}
      {currentTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Active Resources ({teacherResources.length})
            </h3>
            <span className="text-xs text-slate-500">
              Every item has passed automated AI verification and peer review.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teacherResources.map((res) => (
              <div 
                key={res.id}
                className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs hover:shadow-lg hover:border-emerald-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {res.type.replace('_', ' ')}
                    </span>
                    {res.isPrivateToClass ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <Lock className="w-3 h-3" />
                        Private: {res.classCode}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Globe2 className="w-3 h-3" />
                        Public
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-base line-clamp-2 hover:text-emerald-700 cursor-pointer" onClick={() => onOpenResource(res)}>
                    {res.title}
                  </h4>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded">
                      {res.subject} → {res.topic}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-medium text-slate-600">{res.difficulty}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {res.rating}
                    </span>
                    <span className="text-slate-400">
                      👥 {res.studentsCount} students
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenVerificationReport(res)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition flex items-center gap-1"
                      title="Inspect AI Verification Report"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Report</span>
                    </button>
                    <button
                      onClick={() => onOpenResource(res)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition"
                    >
                      Open
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CLASSROOM SPACES */}
      {currentTab === 'classes' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-700 text-indigo-200">
                  Course CS201-A
                </span>
                <h3 className="text-xl font-bold">CSE-A — Data Structures & Algorithms</h3>
              </div>
              <p className="text-xs text-indigo-200 mt-1">
                SRM Institute of Science & Technology • 78 students enrolled • Semester 3
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-mono text-xs border border-white/20">
                Class Code: <span className="font-bold text-indigo-300">CS201-A</span>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Assigned Course Materials & Private Problem Sets
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teacherResources.map(r => (
                <div key={r.id} className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {r.type === 'question_bank' ? '📝' : '📄'}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{r.title}</div>
                      <div className="text-xs text-slate-500">
                        {r.isPrivateToClass ? '🔒 Enrolled CSE-A Students Only' : '🌐 Public Resource'} • {r.lastVerifiedDate}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenResource(r)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI VERIFICATION HUB */}
      {currentTab === 'verification' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold">AI Resource Verification Pipeline Hub</h3>
              </div>
              <p className="text-xs text-emerald-200 mt-1 max-w-xl">
                Every resource uploaded to EduVault is evaluated across 5 dimensions: Accuracy, Outdated Information, Relevance, Quality, and Trusted Sources.
              </p>
            </div>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Verify & Publish New Material</span>
            </button>
          </div>

          {/* Audit Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400">Total Pipeline Runs</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{teacherResources.length} Audits</div>
              <span className="text-[11px] text-emerald-600 font-bold">✓ 100% Passed or Resolved</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400">Average Pedagogical Quality</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">98.4 / 100</div>
              <span className="text-[11px] text-slate-500">Curriculum alignment verified</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-400">Outdated Content Detected</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">0 Flagged</div>
              <span className="text-[11px] text-emerald-600 font-bold">Modern Java 21 / 2026 specs</span>
            </div>
          </div>

          {/* List of Resource Reports */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Verification Reports for Your Content
            </h4>
            <div className="space-y-3">
              {teacherResources.map(r => (
                <div key={r.id} className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{r.title}</div>
                      <div className="text-xs text-slate-500">
                        Audited: {r.lastVerifiedDate} • Subject: {r.subject} → {r.topic}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      AI Verified
                    </span>
                    <button
                      onClick={() => onOpenVerificationReport(r)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                    >
                      View Report Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VERSION HISTORY */}
      {currentTab === 'history' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-900">EduVault Automated Re-check Engine: </span>
            Whenever you revise course materials or update examples, EduVault AI automatically runs the verification pipeline to ensure no newly deprecated APIs or outdated statistics were introduced.
          </div>

          <div className="space-y-4">
            {teacherResources.map(r => (
              <div key={r.id} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm">{r.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                      Current: {r.version}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Last audited: {r.lastVerifiedDate}
                  </span>
                </div>

                <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
                  {r.versionHistory.map((v, i) => (
                    <div key={i} className="text-xs relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{v.version}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{v.date}</span>
                        {v.verifiedByAI && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            AI Verified
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 mt-0.5">{v.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
