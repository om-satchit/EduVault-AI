import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Sparkles
} from 'lucide-react';
import { StudentProfile } from '../../types';

interface StudentAuthModalProps {
  initialProfile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: StudentProfile) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  initialProfile,
  isOpen,
  onClose,
  onLogin
}) => {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [joinMethod, setJoinMethod] = useState<'code' | 'email'>('code');
  const [institutionCode, setInstitutionCode] = useState('SRM-CSE-2026');
  const [codeVerified, setCodeVerified] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      ...profile,
      institutionCode: codeVerified ? institutionCode : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Student Portal Onboarding</h3>
              <p className="text-xs text-indigo-100">Unlock verified study guides, AI tutor & campus spaces</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                placeholder="Aarav Patel"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                placeholder="student@srm.edu"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                placeholder="+91 98765 00000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">School / College</label>
              <input
                type="text"
                value={profile.schoolCollege}
                onChange={(e) => setProfile({ ...profile, schoolCollege: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                placeholder="SRM Institute"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Degree</label>
              <input
                type="text"
                value={profile.courseClass}
                onChange={(e) => setProfile({ ...profile, courseClass: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                placeholder="B.Tech Computer Science"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year / Semester</label>
              <input
                type="text"
                value={profile.yearSemester}
                onChange={(e) => setProfile({ ...profile, yearSemester: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                placeholder="Semester 3 (2nd Year)"
              />
            </div>
          </div>

          {/* Join Institution Section */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                Join Your Campus Space
              </span>
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                Optional
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Enter an institution code, class code or invitation token to unlock private class notes.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={institutionCode}
                onChange={(e) => setInstitutionCode(e.target.value)}
                placeholder="e.g. SRM-CSE-2026 or CS201-A"
                className="flex-1 px-3 py-1.5 rounded-xl border border-indigo-200 text-xs font-mono bg-white uppercase tracking-wider focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setCodeVerified(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Apply
              </button>
            </div>

            {codeVerified && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Connected to SRM Institute of Science & Technology (CSE-A)</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition"
            >
              Start Learning with EduVault AI
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
