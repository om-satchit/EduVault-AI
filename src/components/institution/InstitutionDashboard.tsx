import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Plus, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  FileText, 
  Star, 
  AlertCircle, 
  Copy, 
  Check, 
  UserPlus,
  Settings,
  Layers,
  Sparkles,
  Sliders,
  Globe,
  Award
} from 'lucide-react';
import { InstitutionProfile, EducationalResource } from '../../types';

interface InstitutionDashboardProps {
  institution: InstitutionProfile;
  resources: EducationalResource[];
  onOpenResource: (resource: EducationalResource) => void;
  onUpdateInstitution: (updated: InstitutionProfile) => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({
  institution,
  resources,
  onOpenResource,
  onUpdateInstitution,
  activeTab = 'overview',
  onSelectTab
}) => {
  const [internalTab, setInternalTab] = useState<'overview' | 'departments' | 'faculty' | 'governance'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassTeacher, setNewClassTeacher] = useState('Prof. Rahul Sharma');
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  // Sync internal tab if activeTab changes from Navbar
  const currentTab = useMemo(() => {
    if (activeTab === 'overview') return 'overview';
    if (activeTab === 'departments') return 'departments';
    if (activeTab === 'faculty') return 'faculty';
    if (activeTab === 'governance') return 'governance';
    return internalTab;
  }, [activeTab, internalTab]);

  const handleTabChange = (t: 'overview' | 'departments' | 'faculty' | 'governance') => {
    setInternalTab(t);
    if (onSelectTab) {
      onSelectTab(t);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(institution.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteSent(true);
    setTimeout(() => {
      setShowInviteModal(false);
      setInviteSent(false);
      setInviteEmail('');
      setInviteName('');
    }, 1500);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass = {
      id: `class-${Date.now()}`,
      name: newClassName,
      code: `CS${Math.floor(100 + Math.random() * 900)}`,
      semester: 'Semester 3',
      teacherName: newClassTeacher,
      teacherPosition: 'Associate Professor',
      studentsCount: 65,
      resourceIds: ['res-1']
    };

    const updated = {
      ...institution,
      departments: institution.departments.map(dept => {
        if (dept.id === 'dept-cse') {
          return {
            ...dept,
            courses: dept.courses.map(course => {
              if (course.id === 'course-btech-cse') {
                return {
                  ...course,
                  classes: [...course.classes, newClass]
                };
              }
              return course;
            })
          };
        }
        return dept;
      })
    };

    onUpdateInstitution(updated);
    setNewClassName('');
    setShowAddClassModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner">
            🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {institution.name}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
                Verified Campus Domain
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 mt-1">
              Domain: <span className="font-mono">{institution.domain}</span> • Institutional Code: <span className="font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded">{institution.code}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white text-amber-950 font-bold text-xs shadow-md transition active:scale-95"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-700" />}
            <span>{copiedCode ? 'Code Copied' : 'Share Campus Join Code'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Faculty</span>
          <div className="text-2xl font-extrabold text-slate-900">{institution.teachersCount}</div>
          <span className="text-[10px] font-bold text-emerald-600">✓ 100% Verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Enrolled Students</span>
          <div className="text-2xl font-extrabold text-slate-900">{institution.studentsCount}</div>
          <span className="text-[10px] font-semibold text-slate-400">Campus Cohort</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Active Courses</span>
          <div className="text-2xl font-extrabold text-slate-900">{institution.coursesCount}</div>
          <span className="text-[10px] font-semibold text-slate-400">2 Departments</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Library Resources</span>
          <div className="text-2xl font-extrabold text-slate-900">{institution.uploadedResourcesCount}</div>
          <span className="text-[10px] font-bold text-indigo-600">AI Audited</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Average Feedback</span>
          <div className="text-2xl font-extrabold text-slate-900">4.8 / 5.0</div>
          <span className="text-[10px] font-semibold text-amber-600">⭐ Outstanding</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Audits Pending</span>
          <div className="text-2xl font-extrabold text-emerald-600">0</div>
          <span className="text-[10px] font-semibold text-emerald-700">All cleared</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTabChange('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              currentTab === 'overview'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Overview & Hierarchy
          </button>
          <button
            onClick={() => handleTabChange('departments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              currentTab === 'departments'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Classes & Faculty Spaces
          </button>
          <button
            onClick={() => handleTabChange('faculty')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              currentTab === 'faculty'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Verified Faculty Roster
          </button>
          <button
            onClick={() => handleTabChange('governance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentTab === 'governance'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Academic Quality & Codes</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddClassModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Class</span>
        </button>
      </div>

      {/* TAB 1: ACADEMIC HIERARCHY TREE */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Institution Structure: Departments → Courses → Classes → Sections
            </h3>
            <span className="text-xs text-slate-400">
              SRM University Educational Tree
            </span>
          </div>

          <div className="space-y-4">
            {institution.departments.map((dept) => (
              <div key={dept.id} className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      🏢
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900">{dept.name}</h4>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {dept.courses.length} Degree Programs
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {dept.courses.map((course) => (
                    <div key={course.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{course.name}</span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {course.classes.length} Active Classes
                        </span>
                      </div>

                      <div className="space-y-2">
                        {course.classes.map((cls) => (
                          <div key={cls.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-slate-800">{cls.name}</div>
                              <div className="text-[11px] text-slate-500">
                                Teacher: <span className="font-semibold text-slate-700">{cls.teacherName}</span> • {cls.studentsCount} students
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-600 text-[10px]">
                              {cls.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CLASSES & FACULTY SPACES */}
      {currentTab === 'departments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Private Classroom Spaces & Materials
            </h3>
            <span className="text-xs text-slate-400">
              Only enrolled students have access to private class notes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {institution.departments[0].courses[0].classes.map((cls) => (
              <div key={cls.id} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      🎓
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{cls.name}</h4>
                      <div className="text-[11px] text-slate-400">{cls.semester} • Code: {cls.code}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                    {cls.studentsCount} Students
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="font-semibold text-slate-700">Assigned Educator:</div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cls.teacherName}</span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      ✓ Verified
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Class Resources ({cls.resourceIds.length})
                  </div>
                  {cls.resourceIds.map((rId) => {
                    const matched = resources.find(r => r.id === rId);
                    if (!matched) return null;
                    return (
                      <div 
                        key={rId} 
                        onClick={() => onOpenResource(matched)}
                        className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 flex items-center justify-between cursor-pointer text-xs"
                      >
                        <span className="font-medium text-slate-800 truncate">{matched.title}</span>
                        <span className="text-[10px] font-bold text-indigo-600 shrink-0">Open</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FACULTY ROSTER */}
      {currentTab === 'faculty' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Verified Institutional Faculty Roster ({institution.teachersCount})
              </h3>
              <p className="text-xs text-slate-400">
                Institutional Email Verified • Credential Verified
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite Faculty Member</span>
            </button>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="py-3.5 px-6">Educator</th>
                  <th className="py-3.5 px-6">Position</th>
                  <th className="py-3.5 px-6">Specialization</th>
                  <th className="py-3.5 px-6">Campus Email</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      R
                    </div>
                    <span>Prof. Rahul Sharma</span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">Associate Professor</td>
                  <td className="py-3.5 px-6 text-slate-600">Data Structures & Algorithms</td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">rahul.sharma@srmist.edu.in</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      E
                    </div>
                    <span>Dr. Elena Vance</span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">Professor of Systems</td>
                  <td className="py-3.5 px-6 text-slate-600">Operating Systems & Kernels</td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">elena.vance@srmist.edu.in</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      S
                    </div>
                    <span>Prof. Sarah Chen</span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">Assistant Professor</td>
                  <td className="py-3.5 px-6 text-slate-600">Java & Discrete Mathematics</td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">sarah.chen@srmist.edu.in</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ACADEMIC QUALITY & CODES */}
      {currentTab === 'governance' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold">Academic Quality, Verification Policy & Campus Codes</h3>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Configure your institution's pedagogical standards, access tokens, and AI verification strictness thresholds.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-mono border border-white/20">
                Campus Join Token: <span className="font-bold text-amber-300">{institution.code}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Setting Card 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">AI Verification Strictness</h4>
              </div>
              <p className="text-xs text-slate-500">
                Control the threshold for automated approval of faculty courseware before student publishing.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">Strictness Level:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">High (Standard Academic)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Flag deprecated programming APIs (Java 8/11 deprecated patterns)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Enforce syllabus curriculum unit alignment</span>
                </div>
              </div>
            </div>

            {/* Setting Card 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-sm text-slate-900">Institutional Domain Whitelist</h4>
              </div>
              <p className="text-xs text-slate-500">
                Only email addresses ending in approved campus domains will receive automatic faculty credentials.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">@srmist.edu.in</span>
                  <span className="text-emerald-600 font-bold">✓ Active Faculty</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">@student.srm.edu</span>
                  <span className="text-indigo-600 font-bold">✓ Active Students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Faculty Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">Invite Faculty Member</h3>
            <p className="text-xs text-slate-500">
              Send an official accreditation invite link to an educator with pre-approved institutional credentials.
            </p>
            <form onSubmit={handleSendInvite} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Faculty Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="rajesh.kumar@srmist.edu.in"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {inviteSent && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Invitation sent successfully!</span>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={inviteSent}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition disabled:opacity-50"
                >
                  {inviteSent ? 'Sent' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">Create New Class Space</h3>
            <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Class Title</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. CSE-C — Database Management"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Teacher</label>
                <select
                  value={newClassTeacher}
                  onChange={(e) => setNewClassTeacher(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white"
                >
                  <option value="Prof. Rahul Sharma">Prof. Rahul Sharma</option>
                  <option value="Dr. Elena Vance">Dr. Elena Vance</option>
                  <option value="Prof. Sarah Chen">Prof. Sarah Chen</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
