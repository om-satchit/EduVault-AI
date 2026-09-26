export type UserRole = 'student' | 'teacher' | 'institution';

export type ResourceType = 
  | 'video' 
  | 'ppt' 
  | 'notes' 
  | 'textbook' 
  | 'question_bank' 
  | 'quiz' 
  | 'external';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface FlaggedVerificationItem {
  id: string;
  section: string;
  severity: 'correct' | 'warning' | 'error';
  title: string;
  description: string;
  suggestedFix?: string;
  status: 'pending' | 'fixed' | 'ignored';
}

export interface AIVerificationReport {
  status: 'passed' | 'review_required' | 'rejected' | 'pending';
  overallScore: number;
  checkedAt: string;
  checks: {
    accuracy: { status: 'pass' | 'warning' | 'error'; details: string };
    outdatedInfo: { status: 'pass' | 'warning' | 'error'; details: string; itemsFound?: string[] };
    relevance: { status: 'pass' | 'warning' | 'error'; details: string };
    quality: { status: 'pass' | 'warning' | 'error'; details: string };
    sourceGrounding: { status: 'pass' | 'warning' | 'error'; details: string };
  };
  flaggedItems: FlaggedVerificationItem[];
}

export interface ResourceFeedback {
  id: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  helpful: boolean;
  comment?: string;
  date: string;
}

export interface ResourceVersion {
  version: string;
  date: string;
  notes: string;
  verifiedByAI: boolean;
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  subject: string;
  unit: string;
  chapter: string;
  topic: string;
  difficulty: DifficultyLevel;
  type: ResourceType;
  language: string;
  targetClass: string;
  teacherName: string;
  teacherRole: string;
  teacherAvatar?: string;
  institutionName: string;
  isAiVerified: boolean;
  isFacultyReviewed: boolean;
  isInstitutionVerified: boolean;
  lastVerifiedDate: string;
  rating: number;
  reviewCount: number;
  studentsCount: number;
  isPrivateToClass?: boolean;
  classCode?: string;
  version: string;
  versionHistory: ResourceVersion[];
  content: string;
  outline: string[];
  aiReport?: AIVerificationReport;
  feedbacks: ResourceFeedback[];
  externalUrl?: string;
  estimatedReadMinutes?: number;
}

export interface TeacherProfile {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  institution: string;
  position: string;
  avatarUrl: string;
  highestDegree: string;
  degreeName: string;
  degreeInstitution: string;
  graduationYear: string;
  specialization: string;
  teachingSubjects: string[];
  documents: {
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
    status: 'verified' | 'flagged' | 'uploaded';
  }[];
  isInstitutionalEmail: boolean;
  isEmailVerified: boolean;
  isApproved: boolean;
  verificationStep: number;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  phone: string;
  schoolCollege: string;
  courseClass: string;
  yearSemester: string;
  institutionCode?: string;
  enrolledClasses: string[];
  xp: number;
  streakDays: number;
  completedChallengesCount: number;
  savedResourceIds: string[];
}

export interface InstitutionClass {
  id: string;
  name: string;
  code: string;
  semester: string;
  teacherName: string;
  teacherPosition: string;
  studentsCount: number;
  resourceIds: string[];
}

export interface InstitutionCourse {
  id: string;
  name: string;
  classes: InstitutionClass[];
}

export interface InstitutionDepartment {
  id: string;
  name: string;
  courses: InstitutionCourse[];
}

export interface InstitutionProfile {
  id: string;
  name: string;
  code: string;
  type: 'University' | 'College' | 'School' | 'Institute';
  domain: string;
  adminEmail?: string;
  departments: InstitutionDepartment[];
  teachersCount: number;
  studentsCount: number;
  coursesCount: number;
  uploadedResourcesCount: number;
  pendingReviewCount: number;
}

export interface ChallengeQuestion {
  id: string;
  topic: string;
  subject: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starterCode?: string;
  language?: string;
  hints: string[];
  explanation: string;
  testCases?: { input: string; output: string }[];
  quizOptions?: string[];
  correctOptionIndex?: number;
  xpReward: number;
}

export interface AISearchSuggestion {
  id: string;
  query: string;
  category: string;
  type: 'concept' | 'diagram' | 'exam_question' | 'resource';
  subtitle: string;
  hasDiagram?: boolean;
  relatedResourceId?: string;
}

