import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  Key, 
  User, 
  Phone, 
  School, 
  Zap, 
  AlertCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserRole, StudentProfile, TeacherProfile, InstitutionProfile } from '../../types';
import { initialStudentProfile, initialTeacherProfile, initialInstitutionProfile } from '../../data/mockData';

interface LoginPageProps {
  initialCategory?: UserRole;
  onLoginSuccess: (role: UserRole, profileData?: any) => void;
  onStartTeacherVerification: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialCategory = 'student',
  onLoginSuccess,
  onStartTeacherVerification,
  onBackToLanding
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialCategory);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Student Form State
  const [studentEmail, setStudentEmail] = useState('aarav.patel@student.srm.edu');
  const [studentPassword, setStudentPassword] = useState('••••••••••••');
  const [studentCampusCode, setStudentCampusCode] = useState('SRM-CSE-2026');
  // Student Signup State
  const [studentFullName, setStudentFullName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentCollege, setStudentCollege] = useState('');
  const [studentCourse, setStudentCourse] = useState('');
  const [studentYear, setStudentYear] = useState('Semester 3 (2nd Year)');

  // Teacher Form State
  const [teacherEmail, setTeacherEmail] = useState('rahul.sharma@srmist.edu.in');
  const [teacherPassword, setTeacherPassword] = useState('••••••••••••');
  const [teacherInstitution, setTeacherInstitution] = useState('SRM Institute of Science & Technology');

  // Institution Form State
  const [instEmail, setInstEmail] = useState('admin@srmist.edu.in');
  const [instPassword, setInstPassword] = useState('••••••••••••');
  const [instCode, setInstCode] = useState('SRM-IST-2026');
  // Institution Registration State
  const [instName, setInstName] = useState('');
  const [instDomain, setInstDomain] = useState('');
  const [instAdminName, setInstAdminName] = useState('');
  const [instType, setInstType] = useState('University / Autonomous College');
  const [instStudents, setInstStudents] = useState('5000+');

  const showFeedback = (type: 'success' | 'error' | 'info', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Demo Login Shortcuts
  const handleQuickDemo = (role: UserRole) => {
    if (role === 'student') {
      showFeedback('success', 'Logged in as Student: Aarav Patel (B.Tech CSE)');
      setTimeout(() => onLoginSuccess('student', initialStudentProfile), 350);
    } else if (role === 'teacher') {
      showFeedback('success', 'Logged in as Verified Faculty: Prof. Rahul Sharma');
      setTimeout(() => onLoginSuccess('teacher', initialTeacherProfile), 350);
    } else {
      showFeedback('success', 'Logged in as Institution Admin: SRM IST');
      setTimeout(() => onLoginSuccess('institution', initialInstitutionProfile), 350);
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signin') {
      if (!studentEmail) {
        showFeedback('error', 'Please enter your student email or ID.');
        return;
      }
      showFeedback('success', `Welcome back, ${studentEmail.split('@')[0]}!`);
      const profile: StudentProfile = {
        ...initialStudentProfile,
        email: studentEmail,
        institutionCode: studentCampusCode || 'SRM-CSE-2026'
      };
      setTimeout(() => onLoginSuccess('student', profile), 400);
    } else {
      if (!studentFullName || !studentEmail) {
        showFeedback('error', 'Please enter your full name and student email.');
        return;
      }
      const newStudent: StudentProfile = {
        fullName: studentFullName,
        email: studentEmail,
        phone: studentPhone || '+91 98765 00000',
        schoolCollege: studentCollege || 'SRM Institute of Science & Technology',
        courseClass: studentCourse || 'B.Tech CSE',
        yearSemester: studentYear,
        institutionCode: studentCampusCode || undefined,
        enrolledClasses: ['CS201-A'],
        streakDays: 1,
        xp: 150,
        completedChallengesCount: 0,
        savedResourceIds: []
      };
      showFeedback('success', `Account created successfully! Welcome to EduVault.`);
      setTimeout(() => onLoginSuccess('student', newStudent), 400);
    }
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherEmail) {
      showFeedback('error', 'Please enter your educator email address.');
      return;
    }
    showFeedback('success', 'Faculty credentials validated. Accessing educator hub...');
    const profile: TeacherProfile = {
      ...initialTeacherProfile,
      fullName: 'Prof. Rahul Sharma',
      email: teacherEmail,
      institution: teacherInstitution || initialTeacherProfile.institution,
      isInstitutionalEmail: teacherEmail.includes('.edu') || teacherEmail.includes('.ac') || teacherEmail.includes('.in')
    };
    setTimeout(() => onLoginSuccess('teacher', profile), 400);
  };

  const handleInstitutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signin') {
      if (!instEmail) {
        showFeedback('error', 'Please enter your institutional admin email.');
        return;
      }
      showFeedback('success', 'Campus administration authenticated. Launching workspace...');
      const profile: InstitutionProfile = {
        ...initialInstitutionProfile,
        adminEmail: instEmail,
        code: instCode || initialInstitutionProfile.code
      };
      setTimeout(() => onLoginSuccess('institution', profile), 400);
    } else {
      if (!instName || !instDomain) {
        showFeedback('error', 'Please provide your institution name and official domain.');
        return;
      }
      showFeedback('success', `Campus workspace created for ${instName}!`);
      const newInst: InstitutionProfile = {
        ...initialInstitutionProfile,
        name: instName,
        domain: instDomain,
        code: `${instName.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        adminEmail: instEmail || 'admin@' + instDomain
      };
      setTimeout(() => onLoginSuccess('institution', newInst), 400);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* Header with Back button and Brand */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100/80 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              EduVault
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-md shadow-xs">
              AI
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          Universal Academic Authentication
        </div>
      </header>

      {/* Main Login Container */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 flex-1 flex flex-col items-center justify-center">
        
        {/* Feedback Alert Toast */}
        {feedbackMessage && (
          <div className={`mb-5 w-full max-w-xl p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-150 ${
            feedbackMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : feedbackMessage.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
          }`}>
            {feedbackMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {feedbackMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {feedbackMessage.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* CATEGORY TABS SELECTOR (Student, Teacher, Institution) */}
          <div className="p-3 bg-slate-50 border-b border-slate-200/80">
            <div className="text-center mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Select Login Category
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Category 1: Student */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student');
                  setAuthMode('signin');
                }}
                className={`py-3 px-3 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1.5 relative ${
                  selectedRole === 'student'
                    ? 'bg-white text-indigo-900 shadow-md ring-2 ring-indigo-500/20 border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                  selectedRole === 'student' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  👨‍🎓
                </div>
                <span>Student</span>
                <span className="text-[10px] font-semibold text-slate-400 -mt-1 hidden sm:block">Learner</span>
              </button>

              {/* Category 2: Teacher */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('teacher');
                  setAuthMode('signin');
                }}
                className={`py-3 px-3 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1.5 relative ${
                  selectedRole === 'teacher'
                    ? 'bg-white text-emerald-900 shadow-md ring-2 ring-emerald-500/20 border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                  selectedRole === 'teacher' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  👨‍🏫
                </div>
                <span>Teacher</span>
                <span className="text-[10px] font-semibold text-slate-400 -mt-1 hidden sm:block">Educator</span>
              </button>

              {/* Category 3: Institution */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('institution');
                  setAuthMode('signin');
                }}
                className={`py-3 px-3 rounded-2xl text-xs font-bold transition flex flex-col items-center gap-1.5 relative ${
                  selectedRole === 'institution'
                    ? 'bg-white text-amber-900 shadow-md ring-2 ring-amber-500/20 border border-amber-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                  selectedRole === 'institution' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  🏫
                </div>
                <span>Institution</span>
                <span className="text-[10px] font-semibold text-slate-400 -mt-1 hidden sm:block">Campus Space</span>
              </button>
            </div>
          </div>

          {/* Role Header Banner */}
          <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between ${
            selectedRole === 'student' 
              ? 'bg-gradient-to-r from-indigo-50/80 to-violet-50/50' 
              : selectedRole === 'teacher'
                ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/50'
                : 'bg-gradient-to-r from-amber-50/80 to-orange-50/50'
          }`}>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {selectedRole === 'student' && 'Student Learning Portal'}
                {selectedRole === 'teacher' && 'Faculty & Educator Portal'}
                {selectedRole === 'institution' && 'Institution Admin Workspace'}
              </h2>
              <p className="text-xs text-slate-500">
                {selectedRole === 'student' && 'Access notes, interactive AI tutor & study challenges'}
                {selectedRole === 'teacher' && 'Upload courseware & access AI verification pipelines'}
                {selectedRole === 'institution' && 'Manage departments, courses & campus governance'}
              </p>
            </div>

            {/* Quick Demo Button for Current Category */}
            <button
              type="button"
              onClick={() => handleQuickDemo(selectedRole)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                selectedRole === 'student' 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : selectedRole === 'teacher'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
              title="Skip typing and test directly with active demo persona"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>1-Click Demo</span>
            </button>
          </div>

          {/* Sub-mode Toggle (Sign In vs Sign Up / Verification) */}
          <div className="px-6 pt-5 pb-2 flex items-center gap-2 border-b border-slate-100">
            {selectedRole === 'student' && (
              <>
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    authMode === 'signin' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Student Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    authMode === 'signup' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  New Student Registration
                </button>
              </>
            )}

            {selectedRole === 'teacher' && (
              <>
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    authMode === 'signin' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Verified Educator Sign In
                </button>
                <button
                  type="button"
                  onClick={onStartTeacherVerification}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Start 5-Step Teacher Verification →</span>
                </button>
              </>
            )}

            {selectedRole === 'institution' && (
              <>
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    authMode === 'signin' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Institution Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    authMode === 'signup' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Register Campus Space
                </button>
              </>
            )}
          </div>

          {/* 1. STUDENT LOGIN / SIGNUP BODY */}
          {selectedRole === 'student' && (
            <form onSubmit={handleStudentSubmit} className="p-6 space-y-4">
              {authMode === 'signin' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student Email or Roll Number
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="aarav.patel@student.srm.edu or 2024CS019"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => showFeedback('info', 'Demo password is saved. Click "Sign In as Student" or use 1-Click Demo.')}
                        className="text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="Your password"
                        className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-1.5">
                    <label className="block text-[11px] font-bold text-indigo-950">
                      Campus Access Code (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={studentCampusCode}
                        onChange={(e) => setStudentCampusCode(e.target.value)}
                        placeholder="e.g. SRM-CSE-2026 or CS201-A"
                        className="flex-1 px-3 py-1.5 text-xs font-mono uppercase bg-white border border-indigo-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="px-2.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Valid
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Unlocks private notes uploaded by your university professors.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Remember this student device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-violet-800 transition transform active:scale-98"
                  >
                    Sign In as Student
                  </button>
                </>
              ) : (
                /* Student Signup */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={studentFullName}
                        onChange={(e) => setStudentFullName(e.target.value)}
                        placeholder="Aarav Patel"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Student Email</label>
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="aarav@university.edu"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">School / College</label>
                      <input
                        type="text"
                        value={studentCollege}
                        onChange={(e) => setStudentCollege(e.target.value)}
                        placeholder="SRM Institute of Science & Technology"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Degree</label>
                      <input
                        type="text"
                        value={studentCourse}
                        onChange={(e) => setStudentCourse(e.target.value)}
                        placeholder="B.Tech Computer Science"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Year / Semester</label>
                      <input
                        type="text"
                        value={studentYear}
                        onChange={(e) => setStudentYear(e.target.value)}
                        placeholder="Semester 3"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
                    <input
                      type="password"
                      required
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Complete Student Registration
                  </button>
                </div>
              )}
            </form>
          )}

          {/* 2. TEACHER LOGIN BODY */}
          {selectedRole === 'teacher' && (
            <div className="p-6 space-y-4">
              <form onSubmit={handleTeacherSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institutional / Faculty Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      placeholder="professor@university.edu"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => showFeedback('info', 'Demo password pre-loaded. Click "Sign In as Verified Educator".')}
                      className="text-[11px] font-semibold text-emerald-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      placeholder="Your educator password"
                      className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Affiliated Institution
                  </label>
                  <input
                    type="text"
                    value={teacherInstitution}
                    onChange={(e) => setTeacherInstitution(e.target.value)}
                    placeholder="SRM Institute of Science & Technology"
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Remember this educator session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-800 transition transform active:scale-98"
                >
                  Sign In as Verified Educator
                </button>
              </form>

              {/* Verification Notice Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Not verified yet?</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  EduVault requires a 5-step verification process (personal info, academic credentials, degree certificate, and institutional email OTP) before granting upload privileges.
                </p>
                <button
                  type="button"
                  onClick={onStartTeacherVerification}
                  className="w-full py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 transition flex items-center justify-center gap-1.5"
                >
                  <span>Start 5-Step Educator Accreditation Flow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 3. INSTITUTION LOGIN / REGISTER BODY */}
          {selectedRole === 'institution' && (
            <div className="p-6 space-y-4">
              {authMode === 'signin' ? (
                <form onSubmit={handleInstitutionSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institutional Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={instEmail}
                        onChange={(e) => setInstEmail(e.target.value)}
                        placeholder="admin@srmist.edu.in"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">Admin Password</label>
                      <button
                        type="button"
                        onClick={() => showFeedback('info', 'Demo password pre-loaded. Click "Sign In as Institution Admin".')}
                        className="text-[11px] font-semibold text-amber-700 hover:underline"
                      >
                        Reset password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={instPassword}
                        onChange={(e) => setInstPassword(e.target.value)}
                        placeholder="Admin security key"
                        className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Campus Code / Domain Identifier
                    </label>
                    <input
                      type="text"
                      value={instCode}
                      onChange={(e) => setInstCode(e.target.value)}
                      placeholder="SRM-IST-2026 or srmist.edu.in"
                      className="w-full px-3 py-2.5 text-xs font-mono uppercase rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 hover:from-amber-700 hover:to-orange-700 transition transform active:scale-98"
                  >
                    Sign In to Institution Workspace
                  </button>
                </form>
              ) : (
                /* Institution Registration */
                <form onSubmit={handleInstitutionSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Institution Name</label>
                    <input
                      type="text"
                      required
                      value={instName}
                      onChange={(e) => setInstName(e.target.value)}
                      placeholder="e.g. Stanford University or SRM Institute"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Official Domain</label>
                      <input
                        type="text"
                        required
                        value={instDomain}
                        onChange={(e) => setInstDomain(e.target.value)}
                        placeholder="stanford.edu"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Admin Contact Name</label>
                      <input
                        type="text"
                        required
                        value={instAdminName}
                        onChange={(e) => setInstAdminName(e.target.value)}
                        placeholder="Dean of Academic Affairs"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Campus Type</label>
                      <select
                        value={instType}
                        onChange={(e) => setInstType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="University / Autonomous College">University / Autonomous</option>
                        <option value="Affiliated Engineering College">Engineering College</option>
                        <option value="Medical & Science Academy">Medical & Science</option>
                        <option value="School / Higher Secondary">Higher Secondary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Student Enrollment</label>
                      <select
                        value={instStudents}
                        onChange={(e) => setInstStudents(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="500 - 1,500">500 - 1,500 students</option>
                        <option value="1,500 - 5,000">1,500 - 5,000 students</option>
                        <option value="5,000+">5,000+ students</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Admin Email</label>
                    <input
                      type="email"
                      required
                      value={instEmail}
                      onChange={(e) => setInstEmail(e.target.value)}
                      placeholder="admin@institution.edu"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
                  >
                    Provision Campus Workspace
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs text-slate-400">
        EduVault AI Platform • Multi-Role Authentication Protocol • Privacy & Integrity Secured
      </footer>

    </div>
  );
};
