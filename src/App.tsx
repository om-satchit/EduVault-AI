/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, EducationalResource, TeacherProfile, StudentProfile, InstitutionProfile, AIVerificationReport } from './types';
import { initialTeacherProfile, initialStudentProfile, initialInstitutionProfile, sampleResources } from './data/mockData';
import { Navbar } from './components/layout/Navbar';
import { LandingScreen } from './components/landing/LandingScreen';
import { LoginPage } from './components/auth/LoginPage';
import { TeacherVerificationFlow } from './components/auth/TeacherVerificationFlow';
import { StudentAuthModal } from './components/auth/StudentAuthModal';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { UploadResourceModal } from './components/teacher/UploadResourceModal';
import { AIVerificationPipelineModal } from './components/teacher/AIVerificationPipelineModal';
import { StudentHome } from './components/student/StudentHome';
import { TopicHierarchyExplorer } from './components/student/TopicHierarchyExplorer';
import { ResourceViewerModal } from './components/student/ResourceViewerModal';
import { EduVaultAITutor } from './components/student/EduVaultAITutor';
import { ChallengeMePage } from './components/student/ChallengeMePage';
import { InstitutionDashboard } from './components/institution/InstitutionDashboard';
import { TrustBadgeInfoModal } from './components/common/TrustBadgeInfoModal';
import { AccessibilityModal } from './components/common/AccessibilityModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { GeminiApiKeyModal } from './components/common/GeminiApiKeyModal';
import { runAIVerification } from './services/aiService';

export default function App() {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState<UserRole | 'landing'>('landing');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Core Data States
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(initialTeacherProfile);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(initialStudentProfile);
  const [institutionProfile, setInstitutionProfile] = useState<InstitutionProfile>(initialInstitutionProfile);
  const [resources, setResources] = useState<EducationalResource[]>(sampleResources);

  // Subject Explorer State
  const [selectedSubject, setSelectedSubject] = useState<string>('Computer Science');
  const [challengeTopic, setChallengeTopic] = useState<string>('Linked Lists');
  const [aiTutorInitialQuery, setAiTutorInitialQuery] = useState<string>('');

  // Modals & Navigation Views
  const [isLoginPageActive, setIsLoginPageActive] = useState(false);
  const [loginCategory, setLoginCategory] = useState<UserRole>('student');
  const [isStudentAuthOpen, setIsStudentAuthOpen] = useState(false);
  const [isTeacherVerificationFlowActive, setIsTeacherVerificationFlowActive] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [activeVerificationReport, setActiveVerificationReport] = useState<AIVerificationReport | null>(null);
  const [pendingDraftResource, setPendingDraftResource] = useState<Partial<EducationalResource> | null>(null);
  const [activeViewerResource, setActiveViewerResource] = useState<EducationalResource | null>(null);
  const [viewerInitialTab, setViewerInitialTab] = useState<'read' | 'diagram' | 'feedback' | 'versions'>('read');
  const [isTrustBadgeModalOpen, setIsTrustBadgeModalOpen] = useState(false);

  const handleOpenViewer = (res: EducationalResource, tab: 'read' | 'diagram' | 'feedback' | 'versions' = 'read') => {
    setViewerInitialTab(tab);
    setActiveViewerResource(res);
  };

  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);

  // Accessibility States
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [dyslexiaFont, setDyslexiaFont] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  // Apply Accessibility Classes to body
  useEffect(() => {
    document.body.className = `font-sans antialiased min-h-screen ${
      fontSize === 'large' ? 'font-large' : fontSize === 'xlarge' ? 'font-xlarge' : ''
    } ${highContrast ? 'high-contrast' : ''} ${dyslexiaFont ? 'dyslexia-font' : ''} ${
      highContrast ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
    }`;
  }, [fontSize, highContrast, dyslexiaFont]);

  // Global Keyboard Shortcut: ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handler: Selecting a role from the landing screen
  const handleSelectRoleFromLanding = (role: UserRole) => {
    handleOpenLogin(role);
  };

  // Open Universal/Category Login Page
  const handleOpenLogin = (category: UserRole = 'student') => {
    setLoginCategory(category);
    setIsLoginPageActive(true);
    setIsStudentAuthOpen(false);
    setIsTeacherVerificationFlowActive(false);
  };

  // Handle Successful Login for any Category
  const handleLoginSuccess = (role: UserRole, profileData?: any) => {
    setIsLoginPageActive(false);
    setCurrentRole(role);
    if (role === 'student') {
      if (profileData) setStudentProfile(profileData);
      setActiveTab('home');
    } else if (role === 'teacher') {
      if (profileData) setTeacherProfile(profileData);
      setActiveTab('dashboard');
    } else if (role === 'institution') {
      if (profileData) setInstitutionProfile(profileData);
      setActiveTab('overview');
    }
  };

  // Switch to 5-Step Teacher Verification
  const handleStartTeacherVerification = () => {
    setIsLoginPageActive(false);
    setIsTeacherVerificationFlowActive(true);
  };

  // Direct demo login shortcuts
  const handleDirectLogin = (role: UserRole) => {
    setIsLoginPageActive(false);
    setCurrentRole(role);
    if (role === 'student') setActiveTab('home');
    if (role === 'teacher') setActiveTab('dashboard');
    if (role === 'institution') setActiveTab('overview');
  };

  // Student Onboarding Complete
  const handleStudentAuthComplete = (profile: StudentProfile) => {
    setStudentProfile(profile);
    setIsStudentAuthOpen(false);
    setCurrentRole('student');
    setActiveTab('home');
  };

  // Teacher Verification Complete
  const handleTeacherVerificationComplete = (profile: TeacherProfile) => {
    setTeacherProfile(profile);
    setIsTeacherVerificationFlowActive(false);
    setCurrentRole('teacher');
    setActiveTab('dashboard');
  };

  // Start Upload & AI Verification Pipeline
  const handleSubmitForVerification = async (draft: Partial<EducationalResource>) => {
    setPendingDraftResource(draft);
    setIsUploadModalOpen(false);
    setIsPipelineModalOpen(true);

    const report = await runAIVerification({
      title: draft.title || '',
      subject: draft.subject || 'Computer Science',
      unit: draft.unit || 'Unit 2',
      chapter: draft.chapter || 'Linear Data Structures',
      topic: draft.topic || 'Linked Lists',
      difficulty: draft.difficulty || 'Beginner',
      content: draft.content || ''
    });

    setActiveVerificationReport(report);
  };

  // Complete Upload & Publish
  const handlePublishVerifiedResource = (finalReport: AIVerificationReport) => {
    if (!pendingDraftResource) return;

    const newResource: EducationalResource = {
      id: `res-${Date.now()}`,
      title: pendingDraftResource.title || 'Untitled Resource',
      description: pendingDraftResource.description || '',
      subject: pendingDraftResource.subject || 'Computer Science',
      unit: pendingDraftResource.unit || 'Unit 2',
      chapter: pendingDraftResource.chapter || 'General',
      topic: pendingDraftResource.topic || 'General',
      difficulty: pendingDraftResource.difficulty || 'Beginner',
      type: pendingDraftResource.type || 'notes',
      language: pendingDraftResource.language || 'English',
      targetClass: pendingDraftResource.targetClass || 'B.Tech CSE',
      teacherName: teacherProfile.fullName,
      teacherRole: teacherProfile.position,
      teacherAvatar: teacherProfile.avatarUrl,
      institutionName: teacherProfile.institution,
      isAiVerified: true,
      isFacultyReviewed: true,
      isInstitutionVerified: teacherProfile.isInstitutionalEmail,
      lastVerifiedDate: 'September 2026',
      rating: 5.0,
      reviewCount: 1,
      studentsCount: 1,
      isPrivateToClass: pendingDraftResource.isPrivateToClass,
      classCode: pendingDraftResource.classCode,
      version: 'v1.0',
      versionHistory: [
        { version: 'v1.0', date: 'Sep 25, 2026', notes: 'Initial AI-audited publication.', verifiedByAI: true }
      ],
      outline: pendingDraftResource.outline || ['1. Introduction', '2. Detailed Analysis'],
      content: pendingDraftResource.content || '',
      aiReport: finalReport,
      feedbacks: []
    };

    setResources([newResource, ...resources]);
    setIsPipelineModalOpen(false);
    setPendingDraftResource(null);
  };

  // Handler: Add student feedback
  const handleAddFeedback = (resourceId: string, feedback: any) => {
    setResources(prev => prev.map(r => {
      if (r.id === resourceId) {
        const newFeedbacks = [feedback, ...r.feedbacks];
        const newAvg = Number((newFeedbacks.reduce((acc, f) => acc + f.rating, 0) / newFeedbacks.length).toFixed(1));
        return {
          ...r,
          feedbacks: newFeedbacks,
          rating: newAvg,
          reviewCount: newFeedbacks.length
        };
      }
      return r;
    }));
  };

  // Routing from Search / Subject clicks
  const handleSearchSubmit = (query: string) => {
    setAiTutorInitialQuery(query);
    setActiveTab('tutor');
  };

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    setActiveTab('explore');
  };

  const handleLaunchChallenge = (topicName: string) => {
    setChallengeTopic(topicName);
    setActiveViewerResource(null);
    setActiveTab('challenges');
  };

  // RENDER: Teacher Verification Multi-Step Portal
  if (isTeacherVerificationFlowActive) {
    return (
      <TeacherVerificationFlow
        initialProfile={teacherProfile}
        onComplete={handleTeacherVerificationComplete}
        onCancel={() => setIsTeacherVerificationFlowActive(false)}
      />
    );
  }

  // RENDER: Category Login Page
  if (isLoginPageActive) {
    return (
      <LoginPage
        initialCategory={loginCategory}
        onLoginSuccess={handleLoginSuccess}
        onStartTeacherVerification={handleStartTeacherVerification}
        onBackToLanding={() => {
          setIsLoginPageActive(false);
          setCurrentRole('landing');
        }}
      />
    );
  }

  // RENDER: 1. Landing Screen
  if (currentRole === 'landing') {
    return (
      <>
        <LandingScreen
          onSelectRole={handleSelectRoleFromLanding}
          onDirectLogin={handleDirectLogin}
          onOpenLogin={handleOpenLogin}
          onOpenGeminiKey={() => setIsGeminiModalOpen(true)}
          currentLanguage={currentLanguage}
          onChangeLanguage={setCurrentLanguage}
        />
        {/* Student Onboarding Modal */}
        <StudentAuthModal
          initialProfile={studentProfile}
          isOpen={isStudentAuthOpen}
          onClose={() => setIsStudentAuthOpen(false)}
          onLogin={handleStudentAuthComplete}
        />
        {/* Gemini API Key Modal */}
        <GeminiApiKeyModal
          isOpen={isGeminiModalOpen}
          onClose={() => setIsGeminiModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={(r) => {
          setCurrentRole(r);
          if (r === 'student') setActiveTab('home');
          if (r === 'teacher') setActiveTab('dashboard');
          if (r === 'institution') setActiveTab('overview');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentProfile={studentProfile}
        teacherProfile={teacherProfile}
        onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
        onOpenTrustModal={() => setIsTrustBadgeModalOpen(true)}
        onOpenSearch={() => setIsGlobalSearchOpen(true)}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        onResetToLanding={() => setCurrentRole('landing')}
        onOpenLogin={handleOpenLogin}
        onOpenGeminiKey={() => setIsGeminiModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        
        {/* STUDENT PERSPECTIVE */}
        {currentRole === 'student' && (
          <>
            {activeTab === 'home' && (
              <StudentHome
                studentProfile={studentProfile}
                resources={resources}
                onSelectSubject={handleSelectSubject}
                onSearchSubmit={handleSearchSubmit}
                onOpenResource={(r, tab) => handleOpenViewer(r, tab || 'read')}
                onNavigateToChallenges={() => setActiveTab('challenges')}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'explore' && (
              <TopicHierarchyExplorer
                resources={resources}
                selectedSubject={selectedSubject}
                onSelectSubject={setSelectedSubject}
                onOpenResource={(r) => handleOpenViewer(r, 'read')}
                onOpenTrustModal={() => setIsTrustBadgeModalOpen(true)}
              />
            )}

            {activeTab === 'tutor' && (
              <EduVaultAITutor
                resources={resources}
                onOpenResource={(r) => handleOpenViewer(r, 'read')}
                initialQuery={aiTutorInitialQuery}
              />
            )}


            {activeTab === 'challenges' && (
              <ChallengeMePage
                studentProfile={studentProfile}
                onUpdateProfile={(updated) => setStudentProfile(prev => ({ ...prev, ...updated }))}
                presetTopic={challengeTopic}
              />
            )}

            {activeTab === 'classes' && (
              <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
                <div className="p-6 rounded-3xl bg-indigo-900 text-white flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">My Enrolled Campus Classes</h2>
                    <p className="text-xs text-indigo-200 mt-1">
                      SRM Institute of Science & Technology • Code: {studentProfile.institutionCode}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-mono">
                    3 Classes Connected
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {resources.filter(r => r.isPrivateToClass).map((res) => (
                    <div 
                      key={res.id}
                      onClick={() => setActiveViewerResource(res)}
                      className="p-5 rounded-3xl bg-white border border-indigo-200 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          Class Exclusive
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm mt-2">{res.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{res.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>by {res.teacherName}</span>
                        <span className="font-bold text-indigo-600">Open Note →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* TEACHER PERSPECTIVE */}
        {currentRole === 'teacher' && (
          <TeacherDashboard
            teacherProfile={teacherProfile}
            resources={resources}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenResource={(r) => setActiveViewerResource(r)}
            onOpenVerificationReport={(r) => {
              setActiveVerificationReport(r.aiReport || null);
              setPendingDraftResource(r);
              setIsPipelineModalOpen(true);
            }}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        )}

        {/* INSTITUTION PERSPECTIVE */}
        {currentRole === 'institution' && (
          <InstitutionDashboard
            institution={institutionProfile}
            resources={resources}
            onOpenResource={(r) => setActiveViewerResource(r)}
            onUpdateInstitution={setInstitutionProfile}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        )}

      </main>

      {/* Bottom Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 flex items-center justify-around text-xs font-semibold">
        {currentRole === 'student' && (
          <>
            <button onClick={() => setActiveTab('home')} className={`p-1.5 ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-500'}`}>
              Home
            </button>
            <button onClick={() => setActiveTab('explore')} className={`p-1.5 ${activeTab === 'explore' ? 'text-indigo-600' : 'text-slate-500'}`}>
              Explore
            </button>
            <button onClick={() => setActiveTab('tutor')} className={`p-1.5 ${activeTab === 'tutor' ? 'text-indigo-600' : 'text-slate-500'}`}>
              AI Tutor
            </button>
            <button onClick={() => setActiveTab('challenges')} className={`p-1.5 ${activeTab === 'challenges' ? 'text-indigo-600' : 'text-slate-500'}`}>
              Challenges
            </button>
          </>
        )}
        {currentRole === 'teacher' && (
          <>
            <button onClick={() => setActiveTab('dashboard')} className={`p-1.5 ${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-500'}`}>
              Dashboard
            </button>
            <button onClick={() => setIsUploadModalOpen(true)} className="p-1.5 text-emerald-600 font-bold">
              + Upload
            </button>
          </>
        )}
        {currentRole === 'institution' && (
          <>
            <button onClick={() => setActiveTab('overview')} className={`p-1.5 ${activeTab === 'overview' ? 'text-amber-600' : 'text-slate-500'}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab('departments')} className={`p-1.5 ${activeTab === 'departments' ? 'text-amber-600' : 'text-slate-500'}`}>
              Classes
            </button>
          </>
        )}
      </div>

      {/* MODALS */}
      {/* 1. Distraction-Free Resource Viewer */}
      <ResourceViewerModal
        resource={activeViewerResource}
        isOpen={Boolean(activeViewerResource)}
        onClose={() => setActiveViewerResource(null)}
        onAddFeedback={handleAddFeedback}
        onLaunchChallenge={handleLaunchChallenge}
        currentLanguage={currentLanguage}
        initialTab={viewerInitialTab}
      />


      {/* 2. Upload Resource Modal */}
      <UploadResourceModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmitForVerification={handleSubmitForVerification}
      />

      {/* 3. AI Verification Animated Pipeline & Report Modal */}
      <AIVerificationPipelineModal
        isOpen={isPipelineModalOpen}
        resourceTitle={pendingDraftResource?.title || 'Educational Resource Draft'}
        topicName={pendingDraftResource?.topic || 'Curriculum Node'}
        report={activeVerificationReport}
        onClose={() => setIsPipelineModalOpen(false)}
        onPublishResource={handlePublishVerifiedResource}
      />

      {/* 4. Trust Badges Explanation Modal */}
      <TrustBadgeInfoModal
        isOpen={isTrustBadgeModalOpen}
        onClose={() => setIsTrustBadgeModalOpen(false)}
      />

      {/* 5. Accessibility Modal */}
      <AccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        fontSize={fontSize}
        onSetFontSize={setFontSize}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        dyslexiaFont={dyslexiaFont}
        onToggleDyslexiaFont={() => setDyslexiaFont(!dyslexiaFont)}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
      />

      {/* 6. Global Search Modal (⌘K) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        resources={resources}
        onOpenResource={(r, tab) => handleOpenViewer(r, tab || 'read')}
        onAskAI={handleSearchSubmit}
      />


      {/* 7. Gemini AI Key Setup Modal */}
      <GeminiApiKeyModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
      />

    </div>
  );
}
