import { EducationalResource, TeacherProfile, StudentProfile, InstitutionProfile, ChallengeQuestion } from '../types';

export const initialTeacherProfile: TeacherProfile = {
  fullName: 'Prof. Rahul Sharma',
  email: 'rahul.sharma@srmist.edu.in',
  phone: '+91 98765 43210',
  country: 'India',
  institution: 'SRM Institute of Science and Technology',
  position: 'Associate Professor',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  highestDegree: 'Doctorate (Ph.D.)',
  degreeName: 'Ph.D. in Computer Science & Engineering',
  degreeInstitution: 'Indian Institute of Technology (IIT) Delhi',
  graduationYear: '2019',
  specialization: 'Distributed Systems & Data Structures',
  teachingSubjects: ['Computer Science', 'Data Structures', 'Operating Systems', 'Algorithms'],
  documents: [
    { name: 'PhD_Degree_IIT_Delhi.pdf', type: 'Degree Certificate', size: '2.4 MB', uploadedAt: '12 Sep 2026', status: 'verified' },
    { name: 'Faculty_ID_Card_SRM.pdf', type: 'Faculty ID', size: '1.1 MB', uploadedAt: '12 Sep 2026', status: 'verified' },
    { name: 'National_Teaching_Fellowship.pdf', type: 'Teaching Certificate', size: '850 KB', uploadedAt: '13 Sep 2026', status: 'verified' }
  ],
  isInstitutionalEmail: true,
  isEmailVerified: true,
  isApproved: true,
  verificationStep: 5
};

export const initialStudentProfile: StudentProfile = {
  fullName: 'Aarav Patel',
  email: 'aarav.patel@student.srm.edu',
  phone: '+91 91234 56789',
  schoolCollege: 'SRM Institute of Science and Technology',
  courseClass: 'B.Tech Computer Science & Engineering',
  yearSemester: '3rd Semester (2nd Year)',
  institutionCode: 'SRM-CSE-2026',
  enrolledClasses: ['CSE-A-DS', 'CSE-A-OS', 'CSE-A-DBMS'],
  xp: 480,
  streakDays: 7,
  completedChallengesCount: 18,
  savedResourceIds: ['res-1', 'res-2']
};

export const initialInstitutionProfile: InstitutionProfile = {
  id: 'inst-srm',
  name: 'SRM Institute of Science & Technology',
  code: 'SRM-CSE-2026',
  type: 'University',
  domain: 'srmist.edu.in',
  teachersCount: 142,
  studentsCount: 3820,
  coursesCount: 28,
  uploadedResourcesCount: 654,
  pendingReviewCount: 12,
  departments: [
    {
      id: 'dept-cse',
      name: 'Computer Science & Engineering',
      courses: [
        {
          id: 'course-btech-cse',
          name: 'B.Tech CSE',
          classes: [
            {
              id: 'CSE-A-DS',
              name: 'CSE-A — Data Structures & Algorithms',
              code: 'CS201-A',
              semester: 'Semester 3',
              teacherName: 'Prof. Rahul Sharma',
              teacherPosition: 'Associate Professor',
              studentsCount: 78,
              resourceIds: ['res-1', 'res-private-1']
            },
            {
              id: 'CSE-A-OS',
              name: 'CSE-A — Operating Systems & Virtualization',
              code: 'CS203-A',
              semester: 'Semester 3',
              teacherName: 'Dr. Elena Vance',
              teacherPosition: 'Professor',
              studentsCount: 74,
              resourceIds: ['res-3']
            },
            {
              id: 'CSE-B-DS',
              name: 'CSE-B — Data Structures',
              code: 'CS201-B',
              semester: 'Semester 3',
              teacherName: 'Prof. Sarah Chen',
              teacherPosition: 'Assistant Professor',
              studentsCount: 82,
              resourceIds: ['res-1']
            }
          ]
        },
        {
          id: 'course-mtech-cse',
          name: 'M.Tech Advanced Computing',
          classes: [
            {
              id: 'MTECH-1-DS',
              name: 'M.Tech CSE — High Performance Algorithms',
              code: 'CS501',
              semester: 'Semester 1',
              teacherName: 'Prof. Rahul Sharma',
              teacherPosition: 'Associate Professor',
              studentsCount: 35,
              resourceIds: ['res-1', 'res-4']
            }
          ]
        }
      ]
    },
    {
      id: 'dept-ece',
      name: 'Electronics & Communication',
      courses: [
        {
          id: 'course-btech-ece',
          name: 'B.Tech ECE',
          classes: [
            {
              id: 'ECE-A-EM',
              name: 'ECE-A — Electromagnetic Theory',
              code: 'EC202',
              semester: 'Semester 3',
              teacherName: 'Dr. Marcus Vance',
              teacherPosition: 'Senior Lecturer',
              studentsCount: 68,
              resourceIds: ['res-5']
            }
          ]
        }
      ]
    }
  ]
};

export const sampleResources: EducationalResource[] = [
  {
    id: 'res-1',
    title: 'Linked Lists Made Easy — Complete Visual Notes',
    description: 'A comprehensive, beginner-friendly guide to Singly, Doubly, and Circular Linked Lists with time-complexity analysis, ASCII memory layouts, and clean Java/Python snippets.',
    subject: 'Computer Science',
    unit: 'Unit 2',
    chapter: 'Linear Data Structures',
    topic: 'Linked Lists',
    difficulty: 'Beginner',
    type: 'notes',
    language: 'English',
    targetClass: 'B.Tech CSE - 2nd Year',
    teacherName: 'Prof. Rahul Sharma',
    teacherRole: 'Associate Professor, IIT Delhi Alum',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    institutionName: 'SRM Institute of Science & Technology',
    isAiVerified: true,
    isFacultyReviewed: true,
    isInstitutionVerified: true,
    lastVerifiedDate: 'September 2026',
    rating: 4.8,
    reviewCount: 142,
    studentsCount: 1240,
    estimatedReadMinutes: 8,
    version: 'v2.1',
    versionHistory: [
      { version: 'v2.1', date: 'Sep 18, 2026', notes: 'Updated memory diagrams and added Circular Linked List benchmark test.', verifiedByAI: true },
      { version: 'v2.0', date: 'Aug 10, 2026', notes: 'Major revision: Refactored Java code samples to modern record types.', verifiedByAI: true },
      { version: 'v1.0', date: 'May 04, 2026', notes: 'Initial publication for Semester 3 cohort.', verifiedByAI: true }
    ],
    outline: [
      '1. Introduction & Array Comparison',
      '2. Memory Representation of a Node',
      '3. Singly Linked List: Insertion & Deletion',
      '4. Traversal & Search Algorithm',
      '5. Doubly Linked Lists & Sentinel Nodes',
      '6. Common Pitfalls & Edge Cases'
    ],
    content: `# Linked Lists — Master Notes

## 1. Introduction & Why Arrays Fall Short
Arrays provide $O(1)$ random access, but they suffer from fixed size allocations and expensive $O(N)$ contiguous shifts upon insertion or deletion in the middle.

A **Linked List** is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next using a pointer/reference.

\`\`\`
[Head: 10 | *] ---> [Data: 20 | *] ---> [Data: 30 | NULL]
\`\`\`

### Quick Comparison Matrix
- **Insertion at Head:** Linked List is $O(1)$ vs Array $O(N)$
- **Access by Index:** Linked List is $O(N)$ vs Array $O(1)$
- **Memory Overhead:** Linked List requires pointer storage per node (8 bytes on 64-bit JVM)
- **Cache Locality:** Arrays benefit from CPU prefetching; Linked Lists suffer from random heap hops.

---

## 2. Anatomy of a Node
In modern object-oriented languages, a Node is modeled with a value payload and a pointer.

\`\`\`java
public class Node<T> {
    public T data;
    public Node<T> next;

    public Node(T data) {
        this.data = data;
        this.next = null;
    }
}
\`\`\`

---

## 3. Core Operations

### A. Insertion at Head ($O(1)$)
1. Create a new Node $N$ with the provided data.
2. Point $N.next \\to head$.
3. Update $head \\to N$.

### B. Deletion by Value ($O(N)$)
Always handle edge cases:
- Empty list (\`head == null\`)
- Deleting the head node (\`head.data == target\`)
- Element not present in the list

\`\`\`python
def delete_node(head, key):
    curr = head
    prev = None
    
    # Target is head
    if curr is not None and curr.data == key:
        return curr.next
        
    while curr is not None and curr.data != key:
        prev = curr
        curr = curr.next
        
    if curr is None:
        return head # Key not found
        
    prev.next = curr.next
    return head
\`\`\`

---

## 4. Doubly Linked Lists (DLL)
In a DLL, every node stores two references: \`prev\` and \`next\`.
- Advantage: Can traverse backwards and delete a given node pointer in $O(1)$ without searching for previous.
- Tradeoff: Extra memory pointer per node.`,
    aiReport: {
      status: 'passed',
      overallScore: 98,
      checkedAt: '2026-09-18T10:14:00Z',
      checks: {
        accuracy: { status: 'pass', details: 'Algorithms match standard asymptotic complexity guarantees ($O(1)$ prepend, $O(N)$ search).' },
        outdatedInfo: { status: 'pass', details: 'Code snippets use modern idiomatic generics and current language specifications.' },
        relevance: { status: 'pass', details: '100% relevant to B.Tech Semester 3 Data Structures syllabus.' },
        quality: { status: 'pass', details: 'High clarity with ASCII diagrams, code snippets, and comparative complexity tables.' },
        sourceGrounding: { status: 'pass', details: 'Cross-verified with CLRS Introduction to Algorithms 4th Edition.' }
      },
      flaggedItems: [
        {
          id: 'flag-1',
          section: 'Section 4 — Memory Footprint',
          severity: 'correct',
          title: 'Accurate pointer size citation',
          description: 'Correctly accounts for 64-bit object references and heap overhead.',
          status: 'fixed'
        }
      ]
    },
    feedbacks: [
      { id: 'fb-1', studentName: 'Priya R.', rating: 5, helpful: true, comment: 'The ASCII memory diagram clicked recursion and pointer linking in 2 minutes!', date: '2 days ago' },
      { id: 'fb-2', studentName: 'Devan S.', rating: 5, helpful: true, comment: 'Used this for my midterm exam. Saved so much time compared to our 800-page textbook.', date: '1 week ago' },
      { id: 'fb-3', studentName: 'Kevin M.', rating: 4, helpful: true, comment: 'Very clear. Would love to see circular linked lists expanded slightly.', date: '2 weeks ago' }
    ]
  },
  {
    id: 'res-private-1',
    title: '[Private CSE-A] Midterm Practice Question Bank & Solutions',
    description: 'Exclusive question bank for SRM CSE-A students covering Linked Lists, Stacks, Queues, and Recursion trees with step-by-step marking rubrics.',
    subject: 'Computer Science',
    unit: 'Unit 2',
    chapter: 'Linear Data Structures',
    topic: 'Linked Lists',
    difficulty: 'Intermediate',
    type: 'question_bank',
    language: 'English',
    targetClass: 'CSE-A — Data Structures',
    teacherName: 'Prof. Rahul Sharma',
    teacherRole: 'Associate Professor',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    institutionName: 'SRM Institute of Science & Technology',
    isAiVerified: true,
    isFacultyReviewed: true,
    isInstitutionVerified: true,
    isPrivateToClass: true,
    classCode: 'CSE-A-DS',
    lastVerifiedDate: 'September 2026',
    rating: 4.9,
    reviewCount: 38,
    studentsCount: 78,
    estimatedReadMinutes: 15,
    version: 'v1.2',
    versionHistory: [
      { version: 'v1.2', date: 'Sep 21, 2026', notes: 'Added solution for Floyd Cycle Detection algorithm.', verifiedByAI: true }
    ],
    outline: [
      'Problem 1: Reverse a Linked List in Groups of K',
      'Problem 2: Detect and Remove Loop (Floyd Algorithm)',
      'Problem 3: Merge Two Sorted Linked Lists In-Place',
      'Problem 4: Flattening a Multilevel Doubly Linked List',
      'Midterm Marking Rubric & Tips'
    ],
    content: `# CSE-A Class Exclusive: Midterm Problem Set

> **Confidentiality Notice:** This resource is restricted to students registered in CSE-A CS201.

## Question 1 (10 Marks): Reverse Linked List in K-Groups
Given a linked list, reverse the nodes of a linked list $k$ at a time and return its modified list. $k$ is a positive integer and is less than or equal to the length of the linked list.

### Solution Approach:
1. Count if at least $k$ nodes exist ahead.
2. Reverse $k$ pointers iteratively using standard 3-pointer technique (\`prev\`, \`curr\`, \`next\`).
3. Connect original head to recursive call on the remaining list.
4. Return new head.

---

## Question 2 (15 Marks): Loop Detection (Hare & Tortoise)
Prove why the slow and fast pointers are guaranteed to meet inside a loop of size $C$ in at most $N$ steps.`,
    aiReport: {
      status: 'passed',
      overallScore: 99,
      checkedAt: '2026-09-21T08:00:00Z',
      checks: {
        accuracy: { status: 'pass', details: 'All mathematical derivations and edge-case proofs verified.' },
        outdatedInfo: { status: 'pass', details: 'Zero deprecated formulations.' },
        relevance: { status: 'pass', details: 'Strictly aligned with CSE-A Midterm exam rubric.' },
        quality: { status: 'pass', details: 'Exam-ready format with marks distribution.' },
        sourceGrounding: { status: 'pass', details: 'Verified against SRM CS201 syllabus.' }
      },
      flaggedItems: []
    },
    feedbacks: [
      { id: 'fb-p1', studentName: 'Aarav Patel', rating: 5, helpful: true, comment: 'Prof. Sharma, this cleared the exact doubt I had on K-group reversal!', date: '3 days ago' }
    ]
  },
  {
    id: 'res-2',
    title: 'Object-Oriented Programming in Java — Constructors & Memory Model',
    description: 'Deep dive into default, parameterized, and copy constructors, constructor chaining via this() and super(), and JVM heap allocation.',
    subject: 'Computer Science',
    unit: 'Unit 1',
    chapter: 'Object-Oriented Principles',
    topic: 'Java OOP — Constructors',
    difficulty: 'Beginner',
    type: 'notes',
    language: 'English',
    targetClass: 'Class 12 / B.Tech 1st Year',
    teacherName: 'Prof. Sarah Chen',
    teacherRole: 'Lead Java Instructor',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    institutionName: 'Stanford Academic Sandbox',
    isAiVerified: true,
    isFacultyReviewed: true,
    isInstitutionVerified: true,
    lastVerifiedDate: 'September 2026',
    rating: 4.9,
    reviewCount: 88,
    studentsCount: 940,
    estimatedReadMinutes: 10,
    version: 'v1.4',
    versionHistory: [
      { version: 'v1.4', date: 'Sep 15, 2026', notes: 'Updated for Java 21 LTS virtual threads compatibility notes.', verifiedByAI: true }
    ],
    outline: [
      '1. What happens during `new MyClass()`?',
      '2. Types of Constructors (Default, Parameterized)',
      '3. Constructor Chaining with `this()` and `super()`',
      '4. Pitfall: Object creation before fields finish initializing',
      '5. Java 21 Records vs Traditional POJO Constructors'
    ],
    content: `# Java OOP — Constructors & JVM Memory Lifecycle

## 1. What happens during \`new MyClass()\`?
When Java executes the \`new\` keyword:
1. Memory is allocated on the Heap for the object instance.
2. Default zero-values are assigned to fields (\`0\`, \`false\`, \`null\`).
3. Explicit field initializers are evaluated in textual order.
4. The corresponding Constructor body executes.
5. The reference pointer is returned.

## 2. Constructor Chaining
\`\`\`java
public class Student {
    private String id;
    private String name;
    private int gpa;

    // Base constructor
    public Student(String id, String name, int gpa) {
        this.id = id;
        this.name = name;
        this.gpa = gpa;
    }

    // Chained constructor: defaults GPA to 0
    public Student(String id, String name) {
        this(id, name, 0); // Must be the first statement!
    }
}
\`\`\`

> **Key Rule:** The call to \`this(...)\` or \`super(...)\` must be the FIRST statement inside a constructor body.`,
    aiReport: {
      status: 'passed',
      overallScore: 97,
      checkedAt: '2026-09-15T14:30:00Z',
      checks: {
        accuracy: { status: 'pass', details: 'Fully accurate regarding JVM class loading and object instantiation order.' },
        outdatedInfo: { status: 'pass', details: 'Incorporates modern Java 21 record patterns.' },
        relevance: { status: 'pass', details: 'Perfect for foundational Java courses.' },
        quality: { status: 'pass', details: 'Clear code samples with compilation rule callouts.' },
        sourceGrounding: { status: 'pass', details: 'Validated against The Java Language Specification (Java SE 21).' }
      },
      flaggedItems: []
    },
    feedbacks: [
      { id: 'fb-4', studentName: 'Rohan K.', rating: 5, helpful: true, comment: 'The JVM 5-step lifecycle diagram is genius.', date: '3 days ago' }
    ]
  },
  {
    id: 'res-3',
    title: 'Operating Systems — Process Scheduling & Synchronization',
    description: 'Process states, PCB structure, CPU scheduling algorithms (FCFS, SJF, Round Robin), and Mutex/Semaphores with deadlock conditions.',
    subject: 'Computer Science',
    unit: 'Unit 3',
    chapter: 'Process Management',
    topic: 'Operating Systems — Processes',
    difficulty: 'Intermediate',
    type: 'ppt',
    language: 'English',
    targetClass: 'B.Tech CSE - 2nd Year',
    teacherName: 'Dr. Elena Vance',
    teacherRole: 'Professor of Systems',
    teacherAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    institutionName: 'SRM Institute of Science & Technology',
    isAiVerified: true,
    isFacultyReviewed: true,
    isInstitutionVerified: true,
    lastVerifiedDate: 'September 2026',
    rating: 4.7,
    reviewCount: 95,
    studentsCount: 890,
    estimatedReadMinutes: 12,
    version: 'v1.1',
    versionHistory: [
      { version: 'v1.1', date: 'Aug 29, 2026', notes: 'Added Linux CFS (Completely Fair Scheduler) overview.', verifiedByAI: true }
    ],
    outline: [
      'Slide 1-5: Process vs Thread & PCB Structure',
      'Slide 6-12: Scheduling Criteria & Gantt Chart Calculations',
      'Slide 13-18: Critical Section Problem & Peterson Solution',
      'Slide 19-24: Coffman 4 Conditions for Deadlock'
    ],
    content: `# Operating Systems: Process Scheduling & Deadlock Prevention

## 1. Process Control Block (PCB)
The PCB is the data structure maintained by the OS kernel for each active task:
- **Process ID (PID)**
- **Program Counter (PC):** Points to next instruction
- **CPU Registers & Stack Pointer**
- **Memory Management Information:** Page tables, segment tables
- **I/O Status Information:** List of open file descriptors

## 2. The 4 Coffman Conditions for Deadlock
A deadlock situation can arise if and only if ALL four of the following conditions hold simultaneously in a system:
1. **Mutual Exclusion:** At least one resource must be held in a non-shareable mode.
2. **Hold and Wait:** A process must be holding at least one resource and requesting additional resources.
3. **No Preemption:** Resources cannot be forcibly preempted from a process.
4. **Circular Wait:** A closed chain of processes exists such that each process holds at least one resource needed by the next.`,
    aiReport: {
      status: 'passed',
      overallScore: 96,
      checkedAt: '2026-08-29T11:00:00Z',
      checks: {
        accuracy: { status: 'pass', details: 'Accurately defines Peterson algorithm limitations on multicore architectures.' },
        outdatedInfo: { status: 'pass', details: 'Updated with contemporary Linux Completely Fair Scheduler (CFS) references.' },
        relevance: { status: 'pass', details: 'Fully corresponds to standard university OS curriculum.' },
        quality: { status: 'pass', details: 'Includes clear Gantt charts and mathematical average turnaround derivations.' },
        sourceGrounding: { status: 'pass', details: 'Silberschatz Operating System Concepts 10th Ed.' }
      },
      flaggedItems: []
    },
    feedbacks: [
      { id: 'fb-5', studentName: 'Meera N.', rating: 5, helpful: true, comment: 'The Coffman conditions memory trick helped our whole study group!', date: '5 days ago' }
    ]
  },
  {
    id: 'res-4',
    title: 'DBMS Normalization: From 1NF to BCNF with Real Schemas',
    description: 'Eliminate data anomalies (Insert, Update, Delete) with clear step-by-step decomposition examples, Armstrong Axioms, and dependency preservation tests.',
    subject: 'Computer Science',
    unit: 'Unit 4',
    chapter: 'Relational Database Design',
    topic: 'DBMS — Normalization',
    difficulty: 'Intermediate',
    type: 'notes',
    language: 'English',
    targetClass: 'B.Tech CSE - 2nd Year',
    teacherName: 'Prof. Rahul Sharma',
    teacherRole: 'Associate Professor',
    teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    institutionName: 'SRM Institute of Science & Technology',
    isAiVerified: true,
    isFacultyReviewed: true,
    isInstitutionVerified: true,
    lastVerifiedDate: 'September 2026',
    rating: 4.8,
    reviewCount: 110,
    studentsCount: 1150,
    estimatedReadMinutes: 11,
    version: 'v2.0',
    versionHistory: [
      { version: 'v2.0', date: 'Sep 02, 2026', notes: 'Added real-world E-commerce normalization walkthrough.', verifiedByAI: true }
    ],
    outline: [
      '1. Why Normalization Matters (Anomalies)',
      '2. Functional Dependencies & Keys',
      '3. First Normal Form (1NF): Atomic Values',
      '4. Second Normal Form (2NF): No Partial Dependencies',
      '5. Third Normal Form (3NF): No Transitive Dependencies',
      '6. Boyce-Codd Normal Form (BCNF): Every Determinant is a Superkey'
    ],
    content: `# Database Normalization: Zero Anomaly Architecture

## Summary of Normal Forms
- **1NF:** Eliminate repeating groups. Every column contains atomic values only.
- **2NF:** Must be in 1NF, AND no non-prime attribute is partially dependent on any candidate key.
- **3NF:** Must be in 2NF, AND no non-prime attribute is transitively dependent on candidate keys ($X \\to Y$ means $X$ is superkey or $Y$ is prime attribute).
- **BCNF:** For every non-trivial functional dependency $X \\to Y$, $X$ MUST be a superkey.`,
    aiReport: {
      status: 'passed',
      overallScore: 99,
      checkedAt: '2026-09-02T09:15:00Z',
      checks: {
        accuracy: { status: 'pass', details: 'Lossless join and dependency preservation verification theorems mathematically sound.' },
        outdatedInfo: { status: 'pass', details: 'Uses current SQL-standard DDL definitions.' },
        relevance: { status: 'pass', details: 'Directly maps to relational database theory.' },
        quality: { status: 'pass', details: 'Practical tables with highlighted anomaly rows.' },
        sourceGrounding: { status: 'pass', details: 'Ramakrishnan & Gehrke Database Management Systems.' }
      },
      flaggedItems: []
    },
    feedbacks: [
      { id: 'fb-6', studentName: 'Vikas T.', rating: 5, helpful: true, comment: 'BCNF vs 3NF finally made total sense with the teacher-student-subject example.', date: '1 week ago' }
    ]
  },
  {
    id: 'res-5',
    title: 'Physics — Electromagnetic Induction & Faraday’s Laws',
    description: 'Visual notes and vector diagrams explaining magnetic flux, Lenz’s Law, motional EMF, eddy currents, and self-inductance.',
    subject: 'Physics',
    unit: 'Unit 3',
    chapter: 'Electrodynamics',
    topic: 'Physics — Electromagnetic Induction',
    difficulty: 'Intermediate',
    type: 'notes',
    language: 'English',
    targetClass: 'Class 12 / B.Tech 1st Year',
    teacherName: 'Dr. Marcus Vance',
    teacherRole: 'Senior Lecturer in Applied Physics',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    institutionName: 'SRM Institute of Science & Technology',
    isAiVerified: true,
    isFacultyReviewed: true,
    isInstitutionVerified: true,
    lastVerifiedDate: 'September 2026',
    rating: 4.9,
    reviewCount: 76,
    studentsCount: 730,
    estimatedReadMinutes: 9,
    version: 'v1.0',
    versionHistory: [
      { version: 'v1.0', date: 'Aug 14, 2026', notes: 'First edition with animated SVG flux diagrams.', verifiedByAI: true }
    ],
    outline: [
      '1. Magnetic Flux Formulation',
      '2. Faraday Law of Induction: $\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$',
      '3. Lenz Law and Conservation of Energy',
      '4. Motional Electromotive Force',
      '5. Applications: Induction Cookers & Regenerative Braking'
    ],
    content: `# Electromagnetic Induction

## 1. Magnetic Flux
Magnetic flux $\\Phi_B$ through a surface of area $A$ in a uniform magnetic field $B$ is:
$$\\Phi_B = \\vec{B} \\cdot \\vec{A} = B A \\cos(\\theta)$$

Where $\\theta$ is the angle between the magnetic field vector and the normal vector to the surface.

## 2. Faraday-Lenz Law
$$\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}$$

The negative sign represents **Lenz's Law**: The direction of the induced electromotive force (and resulting current) always opposes the change in magnetic flux that caused it. This is a direct consequence of the **Conservation of Energy**.`,
    aiReport: {
      status: 'passed',
      overallScore: 98,
      checkedAt: '2026-08-14T16:20:00Z',
      checks: {
        accuracy: { status: 'pass', details: 'All SI units, differential vector calculus forms, and sign conventions are verified.' },
        outdatedInfo: { status: 'pass', details: 'Zero errors.' },
        relevance: { status: 'pass', details: 'Aligned with CBSE, JEE Advanced, and Engineering Physics syllabi.' },
        quality: { status: 'pass', details: 'Clear notation and real-world engineering examples.' },
        sourceGrounding: { status: 'pass', details: 'Halliday, Resnick, Walker Fundamentals of Physics.' }
      },
      flaggedItems: []
    },
    feedbacks: [
      { id: 'fb-7', studentName: 'Ananya S.', rating: 5, helpful: true, comment: 'Lenz law sign derivation is explained so clearly.', date: '4 days ago' }
    ]
  },
  {
    id: 'res-6',
    title: 'Linear Algebra — Eigenvalues, Eigenvectors & Diagonalization',
    description: 'Intuitive geometric understanding of characteristic polynomial, matrix transformations, algebraic vs geometric multiplicity, and spectral decomposition.',
    subject: 'Mathematics',
    unit: 'Unit 1',
    chapter: 'Vector Spaces & Matrices',
    topic: 'Mathematics — Eigenvalues',
    difficulty: 'Advanced',
    type: 'notes',
    language: 'English',
    targetClass: 'B.Tech 1st Year / Data Science',
    teacherName: 'Prof. Sarah Chen',
    teacherRole: 'Applied Mathematics Lead',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    institutionName: 'Stanford Academic Sandbox',
    isAiVerified: true,
    isFacultyReviewed: true,
    isInstitutionVerified: true,
    lastVerifiedDate: 'September 2026',
    rating: 4.8,
    reviewCount: 64,
    studentsCount: 620,
    estimatedReadMinutes: 14,
    version: 'v1.3',
    versionHistory: [
      { version: 'v1.3', date: 'Sep 08, 2026', notes: 'Added 3D transformation visualization guidelines and PCA linkage.', verifiedByAI: true }
    ],
    outline: [
      '1. Geometric Intuition: Directions that do not rotate',
      '2. The Fundamental Equation: $A v = \\lambda v$',
      '3. Characteristic Polynomial: $\\det(A - \\lambda I) = 0$',
      '4. Algebraic vs Geometric Multiplicity',
      '5. Diagonalization: $A = P D P^{-1}$',
      '6. Application in Machine Learning (PCA & PageRank)'
    ],
    content: `# Linear Algebra: Geometric Mastery of Eigenvalues

## 1. What does an Eigenvector really mean?
For almost all vectors $x$, multiplying by a square matrix $A$ changes both its length and its direction.

However, special vectors $v$ exist for which multiplying by $A$ ONLY stretches or shrinks the vector without rotating its line of action:
$$A v = \\lambda v$$

Here:
- $v \\neq 0$ is the **Eigenvector**
- $\\lambda$ is the scalar **Eigenvalue**`,
    aiReport: {
      status: 'passed',
      overallScore: 97,
      checkedAt: '2026-09-08T12:00:00Z',
      checks: {
        accuracy: { status: 'pass', details: 'Full mathematical rigour with proof of linearly independent eigenvectors.' },
        outdatedInfo: { status: 'pass', details: 'Zero errors.' },
        relevance: { status: 'pass', details: 'Foundational for Engineering Mathematics and ML.' },
        quality: { status: 'pass', details: 'Geometric focus prevents mechanical formula memorization.' },
        sourceGrounding: { status: 'pass', details: 'Gilbert Strang Introduction to Linear Algebra.' }
      },
      flaggedItems: []
    },
    feedbacks: [
      { id: 'fb-8', studentName: 'Siddharth M.', rating: 5, helpful: true, comment: 'Connecting this directly to PCA made the whole concept click for my data science course.', date: '1 week ago' }
    ]
  }
];

export const sampleChallenges: ChallengeQuestion[] = [
  {
    id: 'ch-1',
    topic: 'Linked Lists',
    subject: 'Computer Science',
    title: 'Find the Middle Node of a Singly Linked List',
    description: 'Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node.',
    difficulty: 'Easy',
    starterCode: `// Java Solution Starter
public class Solution {
    public ListNode middleNode(ListNode head) {
        // Use two pointers: slow and fast
        // Write your solution here:
        
    }
}`,
    language: 'java',
    hints: [
      'Think about two runners on a track where one runs twice as fast as the other.',
      'When the fast pointer reaches the end (null or fast.next == null), where will the slow pointer be?',
      'Initialize slow = head and fast = head, then advance slow by 1 and fast by 2 in a loop.'
    ],
    explanation: 'By moving slow pointer 1 step and fast pointer 2 steps in each iteration, when fast pointer reaches the end, slow pointer is guaranteed to be at the exact midpoint in $O(N)$ time and $O(1)$ extra space.',
    xpReward: 30
  },
  {
    id: 'ch-2',
    topic: 'Arrays',
    subject: 'Computer Science',
    title: 'Find the Second Largest Element in an Array',
    description: 'Given an array of integers with at least 2 distinct numbers, return the second largest value in a single traversal without sorting.',
    difficulty: 'Easy',
    starterCode: `// Java Solution Starter
public class Solution {
    public int findSecondLargest(int[] arr) {
        // Implement single-pass O(N) solution
        int largest = Integer.MIN_VALUE;
        int secondLargest = Integer.MIN_VALUE;
        
        // Write logic:
        
        return secondLargest;
    }
}`,
    language: 'java',
    hints: [
      'Do not use Arrays.sort() because sorting takes O(N log N) time.',
      'Maintain two variables: largest and secondLargest initialized to min value.',
      'If current num > largest: update secondLargest = largest, then largest = num. Else if current num > secondLargest and num != largest: update secondLargest.'
    ],
    explanation: 'A single pass through the array keeps track of the peak and the runner-up in $O(N)$ time complexity and $O(1)$ auxiliary space.',
    xpReward: 25
  },
  {
    id: 'ch-3',
    topic: 'Operating Systems — Processes',
    subject: 'Computer Science',
    title: 'Identify the Deadlock Vulnerability',
    description: 'Process A holds Resource R1 and requests Resource R2. Process B holds Resource R2 and requests Resource R1. Which of the 4 Coffman conditions is broken if an OS allows preempting R1 from Process A?',
    difficulty: 'Medium',
    quizOptions: [
      'Mutual Exclusion',
      'Hold and Wait',
      'No Preemption',
      'Circular Wait'
    ],
    correctOptionIndex: 2,
    hints: [
      'Look at the action being taken: "preempting R1 from Process A".',
      'Preemption means taking away an allocated resource before the process voluntarily releases it.'
    ],
    explanation: 'By definition, allowing the operating system to forcefully take away an allocated resource from Process A breaks the "No Preemption" condition, thereby eliminating one of the four mandatory prerequisites for deadlock.',
    xpReward: 40
  },
  {
    id: 'ch-4',
    topic: 'Linked Lists',
    subject: 'Computer Science',
    title: 'Detect Cycle in Linked List (Floyd Cycle Detection)',
    description: 'Determine if a linked list contains a cycle. Can you solve it without modifying the original node values or allocating a hash set?',
    difficulty: 'Medium',
    starterCode: `// Java Solution Starter
public class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) return false;
        // Apply Floyd's Tortoise and Hare
        
    }
}`,
    language: 'java',
    hints: [
      'If a circle exists, a faster runner must eventually lap and collide with a slower runner.',
      'Advance slow = slow.next and fast = fast.next.next.',
      'If slow == fast at any point, a cycle exists. If fast reaches null, no cycle exists.'
    ],
    explanation: 'Floyd\'s Cycle Finding Algorithm runs in $O(N)$ time and $O(1)$ memory by tracking slow and fast pointers. If a loop of length $L$ exists, the relative gap shrinks by 1 in each step.',
    xpReward: 45
  },
  {
    id: 'ch-5',
    topic: 'Java OOP — Constructors',
    subject: 'Computer Science',
    title: 'Constructor Execution Order Under Inheritance',
    description: 'In a class hierarchy where Child extends Parent, what is the precise order of constructor execution when `new Child()` is called?',
    difficulty: 'Easy',
    quizOptions: [
      'Child constructor body runs, then Parent constructor body runs',
      'Parent constructor runs completely before Child constructor body runs',
      'Both run concurrently on separate threads',
      'Only the Child constructor runs unless super() is typed manually'
    ],
    correctOptionIndex: 1,
    hints: [
      'Java automatically inserts an implicit super() call as the first statement in a constructor if omitted.',
      'A child object cannot be safely initialized before its parent base is fully constructed.'
    ],
    explanation: 'The JVM enforces that a superclass must be properly initialized before its subclass constructor body runs. Even without an explicit super(), Java inserts a zero-argument super() call at the start.',
    xpReward: 30
  }
];

export const SUBJECT_HIERARCHY: Record<string, {
  icon: string;
  color: string;
  gradient: string;
  description: string;
  units: Record<string, {
    name: string;
    chapters: Record<string, {
      name: string;
      topics: string[];
    }>;
  }>;
}> = {
  'Computer Science': {
    icon: '💻',
    color: 'indigo',
    gradient: 'from-indigo-500 to-blue-600',
    description: 'Data Structures, Algorithms, OS, DBMS, OOP & Computer Networks',
    units: {
      'Unit 1': {
        name: 'Unit 1: Object-Oriented Programming & Principles',
        chapters: {
          'Chapter 1': {
            name: 'Object-Oriented Principles',
            topics: ['Java OOP — Constructors', 'Inheritance & Polymorphism', 'Encapsulation & Abstraction', 'Interfaces & Abstract Classes']
          }
        }
      },
      'Unit 2': {
        name: 'Unit 2: Linear Data Structures',
        chapters: {
          'Chapter 1': {
            name: 'Linear Data Structures',
            topics: ['Linked Lists', 'Arrays & Dynamic Vectors', 'Stacks & Expression Parsing', 'Queues & Deques']
          }
        }
      },
      'Unit 3': {
        name: 'Unit 3: Operating Systems Architecture',
        chapters: {
          'Chapter 1': {
            name: 'Process Management',
            topics: ['Operating Systems — Processes', 'CPU Scheduling Algorithms', 'Deadlocks & Coffman Conditions', 'Memory Virtualization & Paging']
          }
        }
      },
      'Unit 4': {
        name: 'Unit 4: Database Systems & Theory',
        chapters: {
          'Chapter 1': {
            name: 'Relational Database Design',
            topics: ['DBMS — Normalization', 'Relational Algebra & SQL', 'ACID Transactions & Concurrency', 'Indexing & B+ Trees']
          }
        }
      }
    }
  },
  'Mathematics': {
    icon: '📐',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Linear Algebra, Calculus, Discrete Math, Differential Equations',
    units: {
      'Unit 1': {
        name: 'Unit 1: Linear Algebra & Matrix Calculus',
        chapters: {
          'Chapter 1': {
            name: 'Vector Spaces & Matrices',
            topics: ['Mathematics — Eigenvalues', 'Matrix Decomposition (SVD)', 'Linear Transformations', 'Determinants & Inverses']
          }
        }
      },
      'Unit 2': {
        name: 'Unit 2: Multivariable Calculus',
        chapters: {
          'Chapter 1': {
            name: 'Differential & Integral Calculus',
            topics: ['Partial Derivatives & Gradients', 'Multiple Integrals', 'Vector Fields & Stokes Theorem']
          }
        }
      }
    }
  },
  'Physics': {
    icon: '⚛️',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    description: 'Electrodynamics, Classical Mechanics, Quantum Mechanics, Optics',
    units: {
      'Unit 1': {
        name: 'Unit 1: Electromagnetism & Field Theory',
        chapters: {
          'Chapter 1': {
            name: 'Electrodynamics',
            topics: ['Physics — Electromagnetic Induction', 'Maxwell Equations', 'Coulomb Law & Gauss Law', 'Magnetic Fields & Biot-Savart']
          }
        }
      },
      'Unit 2': {
        name: 'Unit 2: Quantum Physics',
        chapters: {
          'Chapter 1': {
            name: 'Wave Mechanics',
            topics: ['Wave-Particle Duality', 'Schrodinger Equation', 'Heisenberg Uncertainty Principle']
          }
        }
      }
    }
  },
  'Chemistry': {
    icon: '🧪',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    description: 'Organic Mechanisms, Thermodynamics, Chemical Kinetics & Bonding',
    units: {
      'Unit 1': {
        name: 'Unit 1: Chemical Kinetics & Catalysis',
        chapters: {
          'Chapter 1': {
            name: 'Reaction Dynamics',
            topics: ['Rate Laws & Arrhenius Equation', 'Enzyme Catalysis', 'Activation Energy']
          }
        }
      }
    }
  },
  'Statistics': {
    icon: '📊',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-600',
    description: 'Probability Distributions, Hypothesis Testing, Bayesian Inference',
    units: {
      'Unit 1': {
        name: 'Unit 1: Probability & Random Variables',
        chapters: {
          'Chapter 1': {
            name: 'Distributions',
            topics: ['Normal & Poisson Distributions', 'Central Limit Theorem', 'Bayes Theorem & Conditional Probability']
          }
        }
      }
    }
  },
  'Biology': {
    icon: '🧬',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    description: 'Molecular Genetics, Cellular Biology, Biotechnology & Ecology',
    units: {
      'Unit 1': {
        name: 'Unit 1: Molecular Genetics',
        chapters: {
          'Chapter 1': {
            name: 'DNA & Protein Synthesis',
            topics: ['DNA Replication & Polymerase', 'Transcription & Translation', 'CRISPR Gene Editing Foundations']
          }
        }
      }
    }
  }
};
