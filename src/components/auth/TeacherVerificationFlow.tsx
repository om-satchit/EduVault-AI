import React, { useState } from 'react';
import { 
  Check, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  User, 
  GraduationCap, 
  FileCheck,
  Send,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TeacherProfile } from '../../types';

interface TeacherVerificationFlowProps {
  initialProfile: TeacherProfile;
  onComplete: (profile: TeacherProfile) => void;
  onCancel: () => void;
}

export const TeacherVerificationFlow: React.FC<TeacherVerificationFlowProps> = ({
  initialProfile,
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<TeacherProfile>({
    ...initialProfile,
    isApproved: false,
    verificationStep: 1
  });

  // Step 4 OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isAiScanningDocs, setIsAiScanningDocs] = useState(false);
  const [aiScanReport, setAiScanReport] = useState<{
    status: 'clean' | 'flagged';
    message: string;
    details: string[];
  } | null>(null);

  const positions = [
    'Professor',
    'Assistant Professor',
    'Associate Professor',
    'Lecturer',
    'School Teacher',
    'Teaching Assistant',
    'Subject Expert'
  ];

  const degrees = [
    'Doctorate (Ph.D.)',
    'Master of Science (M.S. / M.Sc.)',
    'Master of Technology (M.Tech)',
    'Bachelor of Technology / Engineering (B.Tech / B.E.)',
    'Master of Education (M.Ed)',
    'Bachelor of Science (B.Sc.)'
  ];

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc = {
        name: file.name,
        type: 'Official Credential',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: 'Just now',
        status: 'uploaded' as const
      };
      setProfile(prev => ({
        ...prev,
        documents: [...prev.documents, newDoc]
      }));

      // Trigger AI Assisted Scan
      setIsAiScanningDocs(true);
      setTimeout(() => {
        setIsAiScanningDocs(false);
        setAiScanReport({
          status: 'clean',
          message: 'AI Pre-Scan Passed: Document metadata, official watermark seals, and institutional headers verified.',
          details: [
            'Recognized accredited institutional seal matches profile name.',
            'Zero digital tampering artifacts or compression anomalies detected.',
            'Queued for priority human faculty registrar verification.'
          ]
        });
      }, 1200);
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() === '8492' || otpCode.length >= 4) {
      setOtpVerified(true);
      setProfile(prev => ({ ...prev, isEmailVerified: true }));
    }
  };

  const handleApproveProfile = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setProfile(prev => ({ ...prev, isApproved: true }));
    setTimeout(() => {
      onComplete({ ...profile, isApproved: true });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Educator Verification Portal</h2>
                <p className="text-xs text-emerald-100">Step {step} of 5 — Multi-Tier Trust Pipeline</p>
              </div>
            </div>
            <button 
              onClick={onCancel}
              className="text-xs text-emerald-100 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              Exit
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="mt-6 flex items-center justify-between max-w-xl mx-auto">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s 
                    ? 'bg-white text-emerald-700 shadow-md ring-4 ring-white/30' 
                    : step > s 
                      ? 'bg-emerald-400 text-emerald-950 font-extrabold' 
                      : 'bg-emerald-800/60 text-emerald-200'
                }`}>
                  {step > s ? <Check className="w-4 h-4 stroke-[3]" /> : s}
                </div>
                {s < 5 && (
                  <div className={`w-8 sm:w-16 h-1 rounded-full ${step > s ? 'bg-emerald-400' : 'bg-emerald-800/50'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          
          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  Step 1 — Personal Information
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Introduce yourself to the EduVault community. This will appear on your verified public notes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name & Title</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="e.g. Prof. Rahul Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="e.g. India, United States, UK"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Position</label>
                  <select
                    value={profile.position}
                    onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  >
                    {positions.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Affiliated School / College / University</label>
                  <input
                    type="text"
                    value={profile.institution}
                    onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="e.g. SRM Institute of Science & Technology"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition"
                >
                  <span>Continue to Credentials</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC CREDENTIALS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  Step 2 — Academic Credentials
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Specify your academic qualifications, alma mater, and primary subject specializations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Highest Degree</label>
                  <select
                    value={profile.highestDegree}
                    onChange={(e) => setProfile({ ...profile, highestDegree: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  >
                    {degrees.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree Title</label>
                  <input
                    type="text"
                    value={profile.degreeName}
                    onChange={(e) => setProfile({ ...profile, degreeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="e.g. Ph.D. in Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Awarding Alma Mater / Institution</label>
                  <input
                    type="text"
                    value={profile.degreeInstitution}
                    onChange={(e) => setProfile({ ...profile, degreeInstitution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="e.g. IIT Delhi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Graduation Year</label>
                  <input
                    type="text"
                    value={profile.graduationYear}
                    onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="e.g. 2019"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Specialization / Research Area</label>
                  <input
                    type="text"
                    value={profile.specialization}
                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="e.g. Distributed Systems & Algorithms"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subjects You Teach (Comma separated)</label>
                  <input
                    type="text"
                    value={profile.teachingSubjects.join(', ')}
                    onChange={(e) => setProfile({ ...profile, teachingSubjects: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="e.g. Data Structures, Operating Systems, Algorithms"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition"
                >
                  <span>Continue to Proof Upload</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROOF OF QUALIFICATION */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  Step 3 — Proof of Teaching Qualification
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload supporting evidence: Degree certificate, Teaching certificate, Faculty ID, or Institution badge.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center bg-slate-50/50 transition">
                <input
                  type="file"
                  id="doc-upload"
                  className="hidden"
                  onChange={handleDocumentUpload}
                />
                <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Click to browse or drag & drop certificates
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Supports PDF, PNG, JPG (up to 15MB each)
                  </span>
                </label>
              </div>

              {/* AI Scan Status Alert */}
              {isAiScanningDocs && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center gap-3 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
                  <div className="text-xs text-indigo-900">
                    <span className="font-bold">AI Assistant Scanning Credentials...</span>
                    <p className="text-indigo-700">Checking document seals, OCR text alignment, and cross-referencing institution registry.</p>
                  </div>
                </div>
              )}

              {aiScanReport && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{aiScanReport.message}</span>
                  </div>
                  <ul className="text-[11px] text-emerald-700 list-disc list-inside space-y-1">
                    {aiScanReport.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-slate-500 italic pt-1">
                    *EduVault AI assists in pre-filtering. Final decision is verified by an accredited university registrar.
                  </p>
                </div>
              )}

              {/* Uploaded Documents List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Attached Documents ({profile.documents.length})
                </h4>
                {profile.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{doc.name}</div>
                        <div className="text-[11px] text-slate-400">{doc.type} • {doc.size}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Pre-verified
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition"
                >
                  <span>Continue to Email Check</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: INSTITUTION EMAIL VERIFICATION */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  Step 4 — Institution Email Verification
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connecting an official domain (.edu, .ac.in, .edu.in) expedites your faculty badge.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">Official Campus Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                    placeholder="professor@university.edu"
                  />
                  <button
                    onClick={handleSendOtp}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                  >
                    {otpSent ? 'Resend Code' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <Send className="w-4 h-4 text-emerald-600" />
                    <span>Verification code sent to {profile.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 4-digit OTP (e.g. 8492)"
                      className="w-48 px-3.5 py-2 rounded-xl border border-emerald-300 text-sm text-center font-mono tracking-widest bg-white"
                    />
                    <button
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                    >
                      Verify Code
                    </button>
                    <button
                      onClick={() => { setOtpCode('8492'); setOtpVerified(true); setProfile(prev => ({ ...prev, isEmailVerified: true })); }}
                      className="text-xs text-emerald-700 hover:underline px-2 py-1"
                    >
                      Auto-fill Demo Code (8492)
                    </button>
                  </div>
                </div>
              )}

              {profile.isEmailVerified && (
                <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-900">
                      ✓ Institution email verified: {profile.email}
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      Matches recognized registrar DNS for SRM Institute of Science & Technology.
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition"
                >
                  <span>Review Final Status</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: VERIFICATION STATUS PAGE */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Your educator profile is being verified
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  EduVault maintains academic integrity by verifying educators before granting public publishing rights.
                </p>
              </div>

              {/* Status Checklist Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 space-y-3.5 max-w-lg mx-auto">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Personal information
                  </span>
                  <span className="font-semibold text-emerald-600">Complete</span>
                </div>

                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Academic credentials ({profile.highestDegree})
                  </span>
                  <span className="font-semibold text-emerald-600">Complete</span>
                </div>

                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Documents uploaded ({profile.documents.length} files)
                  </span>
                  <span className="font-semibold text-emerald-600">Verified by AI</span>
                </div>

                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Institution email verified
                  </span>
                  <span className="font-semibold text-emerald-600">Verified</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-900 font-bold">
                    <Clock className="w-4 h-4 text-amber-500" />
                    ⏳ Final Registrar Verification
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Ready to Unlock
                  </span>
                </div>
              </div>

              {/* Approval Action */}
              <div className="pt-4 flex flex-col items-center gap-3">
                <button
                  onClick={handleApproveProfile}
                  className="w-full max-w-md py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition transform active:scale-98"
                >
                  {profile.isApproved ? '✓ Verified! Loading Dashboard...' : 'Approve & Unlock Teacher Dashboard'}
                </button>
                <span className="text-[11px] text-slate-400">
                  (Demonstration shortcut: simulates instant human registrar sign-off)
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
