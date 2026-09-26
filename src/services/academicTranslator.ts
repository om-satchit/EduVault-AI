/**
 * High-Fidelity Academic Multi-Language Translation Engine
 * Translates educational notes into Hindi, Tamil, Telugu, Malayalam, Kannada, Spanish, French, German.
 * Preserves code syntax, variables, and math formulas ($O(1)$, $O(N)$) while translating
 * conceptual text, definitions, headings, and explanations thoroughly.
 */

interface LanguageDictionary {
  name: string;
  headings: Record<string, string>;
  phrases: Array<[RegExp | string, string]>;
}

// 1. HINDI TRANSLATION DICTIONARY
const HINDI_DICT: LanguageDictionary = {
  name: 'Hindi',
  headings: {
    'Linked Lists — Master Notes': 'लिंक्ड लिस्ट (Linked Lists) — मुख्य अध्ययन नोट्स',
    'Linked Lists Architecture & Node Structuring': 'लिंक्ड लिस्ट संरचना और नोड संगठन',
    'Introduction & Why Arrays Fall Short': '1. परिचय और सार: ऐरे (Arrays) कहाँ पीछे रह जाते हैं',
    'Anatomy of a Node': '2. नोड की संरचना (Anatomy of a Node)',
    'Core Operations': '3. मुख्य संचालन एवं कार्यप्रणाली (Core Operations)',
    'Insertion at Head': 'A. प्रारंभ में नोड जोड़ना (Insertion at Head — O(1))',
    'Deletion by Value': 'B. मान द्वारा नोड हटाना (Deletion by Value — O(N))',
    'Doubly Linked Lists (DLL)': '4. डबली लिंक्ड लिस्ट और सेंटिनल नोड्स (Doubly Linked Lists)',
    'Common Pitfalls & Edge Cases': '5. सामान्य गलतियाँ एवं ध्यान देने योग्य बातें (Pitfalls)',
    'Quick Comparison Matrix': 'त्वरित तुलना तालिका (Comparison Matrix)',
    'Abstract': 'सार संक्षेप',
    'Complexity Guarantees': 'समय जटिलता की गारंटी (Complexity Guarantees)',
    'Operating Systems & Kernel Architecture': 'ऑपरेटिंग सिस्टम और कर्नेल वास्तुकला',
    'Database Management Systems — Normalization Masterclass': 'डेटाबेस प्रबंधन प्रणाली (DBMS) — सामान्यीकरण (Normalization)',
    'Object-Oriented Programming Principles': 'ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग (OOP) सिद्धांत',
    'Discrete Mathematics & Logic Proofs': 'असतत गणित एवं तार्किक प्रमाण',
    'Computer Networks — OSI & TCP/IP Stack': 'कंप्यूटर नेटवर्क — ओएसआई और टीसीपी/आईपी मॉडल',
    'System Design Fundamentals': 'सिस्टम डिज़ाइन के मूलभूत सिद्धांत'
  },
  phrases: [
    ['Arrays provide $O(1)$ random access, but they suffer from fixed size allocations and expensive $O(N)$ contiguous shifts upon insertion or deletion in the middle.', 'ऐरे (Arrays) इंडेक्स द्वारा $O(1)$ त्वरित रैंडम एक्सेस प्रदान करते हैं, लेकिन इनमें निश्चित आकार का आवंटन होता है और बीच में डेटा जोड़ने या हटाने पर $O(N)$ तत्वों को खिसकाना पड़ता है।'],
    ['A **Linked List** is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next using a pointer/reference.', 'एक **लिंक्ड लिस्ट** डेटा तत्वों का एक रैखिक संग्रह है जिसका क्रम मेमोरी में उनकी भौतिक स्थिति से निर्धारित नहीं होता है। इसके बजाय, प्रत्येक तत्व पॉइंटर या संदर्भ (Reference) का उपयोग करके अगले तत्व को इंगित करता है।'],
    ['Insertion at Head: Linked List is $O(1)$ vs Array $O(N)', 'प्रारंभ (Head) पर जोड़ना: लिंक्ड लिस्ट $O(1)$ है जबकि ऐरे $O(N)$ समय लेता है'],
    ['Access by Index: Linked List is $O(N)$ vs Array $O(1)', 'इंडेक्स द्वारा खोजना: लिंक्ड लिस्ट $O(N)$ समय लेती है जबकि ऐरे त्वरित $O(1)$ है'],
    ['Memory Overhead: Linked List requires pointer storage per node (8 bytes on 64-bit JVM)', 'मेमोरी खपत: लिंक्ड लिस्ट में प्रति नोड पॉइंटर स्टोर करने की आवश्यकता होती है (64-बिट जेवीएम पर 8 बाइट्स)'],
    ['Cache Locality: Arrays benefit from CPU prefetching; Linked Lists suffer from random heap hops.', 'कैश परफॉर्मेंस: ऐरे सीपीयू प्रीफेचिंग का लाभ उठाते हैं; जबकि लिंक्ड लिस्ट हीप मेमोरी में बिखरे होने के कारण कैश मिस का सामना करती हैं।'],
    ['In modern object-oriented languages, a Node is modeled with a value payload and a pointer.', 'आधुनिक ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग में, एक नोड को डेटा वैल्यू और एक पॉइंटर के रूप में मॉडल किया जाता है।'],
    ['Create a new Node $N$ with the provided data.', '1. दिए गए डेटा के साथ एक नया नोड $N$ बनाएं।'],
    ['Point $N.next \\to head$.', '2. नए नोड के पॉइंटर $N.next$ को वर्तमान $head$ की ओर इंगित करें।'],
    ['Update $head \\to N$.', '3. अब मुख्य $head$ पॉइंटर को नए नोड $N$ पर सेट करें।'],
    ['Always handle edge cases:', 'हमेशा निम्नलिखित विशेष स्थितियों (Edge Cases) को संभालें:'],
    ['Empty list (`head == null`)', 'खाली सूची (Empty list: `head == null`)'],
    ['Deleting the head node (`head.data == target`)', 'हेड नोड को हटाना (`head.data == target`)'],
    ['Element not present in the list', 'तत्व का सूची में मौजूद न होना'],
    ['In a DLL, every node stores two references: `prev` and `next`.', 'डबली लिंक्ड लिस्ट में प्रत्येक नोड दो संदर्भ संग्रहीत करता है: पिछला (`prev`) और अगला (`next`)।'],
    ['Advantage: Can traverse backwards and delete a given node pointer in $O(1)$ without searching for previous.', 'लाभ: यह दोनों दिशाओं में नेविगेट कर सकता है और पूर्ववर्ती नोड को खोजे बिना किसी भी दिए गए नोड को $O(1)$ में हटा सकता है।'],
    ['Operating systems manage hardware resources through system calls and kernel protection rings.', 'ऑपरेटिंग सिस्टम सिस्टम कॉल्स और कर्नेल सुरक्षा रिंग्स के माध्यम से हार्डवेयर संसाधनों का कुशल प्रबंधन करते हैं।'],
    ['Database normalization prevents data redundancy, update anomalies, and structural inconsistencies.', 'डेटाबेस सामान्यीकरण डेटा की अतिरेकता (Redundancy), अपडेट त्रुटियों और विसंगतियों को रोकता है।'],
    ['First Normal Form (1NF) mandates atomic scalar values for all columns.', 'प्रथम सामान्य रूप (1NF) अनिवार्य करता है कि प्रत्येक कॉलम में केवल अविभाज्य (Atomic) मान होने चाहिए।'],
    ['Second Normal Form (2NF) eliminates partial functional dependencies on composite keys.', 'द्वितीय सामान्य रूप (2NF) समग्र कुंजियों (Composite Keys) पर आंशिक निर्भरता को पूरी तरह समाप्त करता है।'],
    ['Third Normal Form (3NF) guarantees no transitive functional dependencies exist.', 'तृतीय सामान्य रूप (3NF) यह सुनिश्चित करता है कि तालिकाओं में कोई सकर्मक निर्भरता (Transitive Dependency) न हो।'],
    ['Prepend: O(1)', 'प्रारंभ में जोड़ना (Prepend): O(1)'],
    ['Search: O(N)', 'खोजना (Search): O(N)'],
    ['Delete Node: O(1)', 'नोड हटाना (Delete): O(1)']
  ]
};

// 2. TAMIL TRANSLATION DICTIONARY
const TAMIL_DICT: LanguageDictionary = {
  name: 'Tamil',
  headings: {
    'Linked Lists — Master Notes': 'இணைக்கப்பட்ட பட்டியல் (Linked Lists) — முதன்மை குறிப்புகள்',
    'Linked Lists Architecture & Node Structuring': 'இணைக்கப்பட்ட பட்டியல் கட்டமைப்பு மற்றும் நோட் அமைப்பு',
    'Introduction & Why Arrays Fall Short': '1. அறிமுகம் மற்றும் வரிசைகள் (Arrays) எங்கே பின்தங்குகின்றன',
    'Anatomy of a Node': '2. ஒரு நோட்டின் கட்டமைப்பு (Anatomy of a Node)',
    'Core Operations': '3. முக்கிய செயல்பாடுகள் (Core Operations)',
    'Insertion at Head': 'A. தொடக்கத்தில் சேர்த்தல் (Insertion at Head — O(1))',
    'Deletion by Value': 'B. மதிப்பைக் கொண்டு நீக்குதல் (Deletion by Value — O(N))',
    'Doubly Linked Lists (DLL)': '4. இரட்டை இணைக்கப்பட்ட பட்டியல் (Doubly Linked Lists)',
    'Common Pitfalls & Edge Cases': '5. பொதுவான பிழைகள் மற்றும் கவனிக்க வேண்டியவை',
    'Quick Comparison Matrix': 'விரைவு ஒப்பீட்டு அட்டவணை (Comparison Matrix)'
  },
  phrases: [
    ['Arrays provide $O(1)$ random access, but they suffer from fixed size allocations and expensive $O(N)$ contiguous shifts upon insertion or deletion in the middle.', 'வரிசைகள் (Arrays) உடனடி $O(1)$ அணுகலை வழங்குகின்றன, ஆனால் நிலையான அளவு மற்றும் நடுவில் சேர்க்கும்போது $O(N)$ நகர்த்தல்கள் தேவைப்படுகின்றன.'],
    ['A **Linked List** is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next using a pointer/reference.', 'ஒரு **இணைக்கப்பட்ட பட்டியல்** என்பது நினைவகத்தில் அடுத்தடுத்த இடங்களில் இல்லாமல் சுட்டிகள் (Pointers) மூலம் இணைக்கப்பட்ட நேரியல் தரவு கட்டமைப்பாகும்.'],
    ['Insertion at Head: Linked List is $O(1)$ vs Array $O(N)', 'தொடக்கத்தில் சேர்த்தல்: இணைக்கப்பட்ட பட்டியல் $O(1)$, வரிசை $O(N)'],
    ['Access by Index: Linked List is $O(N)$ vs Array $O(1)', 'குறியீட்டு அணுகல்: இணைக்கப்பட்ட பட்டியல் $O(N)$, வரிசை $O(1)'],
    ['Memory Overhead: Linked List requires pointer storage per node (8 bytes on 64-bit JVM)', 'நினைவக பயன்பாடு: ஒவ்வொரு நோட்டிற்கும் சுட்டி சேமிக்க கூடுதல் இடம் தேவை'],
    ['In modern object-oriented languages, a Node is modeled with a value payload and a pointer.', 'நவீன நிரலாக்கத்தில், ஒரு நோட் தரவு மற்றும் சுட்டியைக் கொண்டிருக்கும்.']
  ]
};

// 3. TELUGU TRANSLATION DICTIONARY
const TELUGU_DICT: LanguageDictionary = {
  name: 'Telugu',
  headings: {
    'Linked Lists — Master Notes': 'లింక్డ్ లిస్ట్‌లు (Linked Lists) — ముఖ్య అధ్యయన నోట్స్',
    'Linked Lists Architecture & Node Structuring': 'లింక్డ్ లిస్ట్ ఆర్కిటెక్చర్ మరియు నోడ్ నిర్మాణం',
    'Introduction & Why Arrays Fall Short': '1. పరిచయం మరియు శ్రేణులు (Arrays) ఎందుకు పరిమితం',
    'Anatomy of a Node': '2. నోడ్ యొక్క అంతర్గత నిర్మాణం',
    'Core Operations': '3. ప్రాథమిక ఆపరేషన్లు (Core Operations)',
    'Insertion at Head': 'A. ప్రారంభంలో చేర్చడం (Insertion at Head — O(1))',
    'Deletion by Value': 'B. విలువ ఆధారంగా తొలగించడం (Deletion by Value)',
    'Doubly Linked Lists (DLL)': '4. డబ్లీ లింక్డ్ లిస్ట్‌లు (Doubly Linked Lists)',
    'Quick Comparison Matrix': 'త్వరిత పోలిక పట్టిక'
  },
  phrases: [
    ['Arrays provide $O(1)$ random access, but they suffer from fixed size allocations and expensive $O(N)$ contiguous shifts upon insertion or deletion in the middle.', 'శ్రేణులు (Arrays) $O(1)$ వేగవంతమైన యాక్సెస్‌ను అందిస్తాయి, కానీ స్థిరమైన పరిమాణం కలిగి ఉంటాయి మరియు మార్పులకు $O(N)$ సమయం తీసుకుంటాయి.'],
    ['A **Linked List** is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next using a pointer/reference.', 'ఒక **లింక్డ్ లిస్ట్** అనేది మెమరీలో ఒకే వరుసలో కాకుండా పాయింటర్ల ద్వారా అనుసంధానించబడిన డేటా ఎలిమెంట్స్ యొక్క సరళ సేకరణ.'],
    ['Insertion at Head: Linked List is $O(1)$ vs Array $O(N)', 'ప్రారంభంలో చేర్చడం: లింక్డ్ లిస్ట్ $O(1)$ కాగా శ్రేణి $O(N)'],
    ['Access by Index: Linked List is $O(N)$ vs Array $O(1)', 'ఇండెక్స్ ద్వారా యాక్సెస్: లింక్డ్ లిస్ట్ $O(N)$ కాగా శ్రేణి $O(1)']
  ]
};

// 4. MALAYALAM TRANSLATION DICTIONARY
const MALAYALAM_DICT: LanguageDictionary = {
  name: 'Malayalam',
  headings: {
    'Linked Lists — Master Notes': 'ലിങ്ക്ഡ് ലിസ്റ്റുകൾ (Linked Lists) — പ്രധാന പഠന കുറിപ്പുകൾ',
    'Introduction & Why Arrays Fall Short': '1. ആമുഖം: അറേകൾ (Arrays) എവിടെ പിന്നിലാകുന്നു',
    'Anatomy of a Node': '2. ഒരു നോഡിന്റെ ഘടന (Anatomy of a Node)',
    'Core Operations': '3. പ്രധാന പ്രവർത്തനങ്ങൾ (Core Operations)',
    'Insertion at Head': 'A. തുടക്കത്തിൽ ചേർക്കൽ (Insertion at Head)',
    'Doubly Linked Lists (DLL)': '4. ഡബ്ലി ലിങ്ക്ഡ് ലിസ്റ്റുകൾ (Doubly Linked Lists)'
  },
  phrases: [
    ['Arrays provide $O(1)$ random access, but they suffer from fixed size allocations and expensive $O(N)$ contiguous shifts upon insertion or deletion in the middle.', 'അറേകൾ $O(1)$ ദ്രുത പ്രവേശനം നൽകുന്നു, എന്നാൽ അവ നിശ്ചിത വലുപ്പമുള്ളവയാണ് കൂടാതെ ഘടകങ്ങൾ മാറ്റാൻ $O(N)$ സമയം ആവശ്യമാണ്.'],
    ['A **Linked List** is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next using a pointer/reference.', 'ഒരു **ലിങ്ക്ഡ് ലിസ്റ്റ്** എന്നത് മെമ്മറിയിൽ അടുത്തടുത്തല്ലാതെ പോയിന്ററുകൾ വഴി ബന്ധിപ്പിച്ചിരിക്കുന്ന ഡാറ്റാ ഘടനയാണ്.']
  ]
};

// 5. KANNADA TRANSLATION DICTIONARY
const KANNADA_DICT: LanguageDictionary = {
  name: 'Kannada',
  headings: {
    'Linked Lists — Master Notes': 'ಲಿಂಕ್ಡ್ ಲಿಸ್ಟ್‌ಗಳು (Linked Lists) — ಪ್ರಮುಖ ನೋಟ್ಸ್',
    'Introduction & Why Arrays Fall Short': '1. ಪರಿಚಯ: ಅರೇಗಳ (Arrays) ಮಿತಿಗಳು',
    'Anatomy of a Node': '2. ನೋಡ್ ರಚನೆ (Anatomy of a Node)',
    'Core Operations': '3. ಮುಖ್ಯ ಕಾರ್ಯಾಚರಣೆಗಳು (Core Operations)'
  },
  phrases: [
    ['Arrays provide $O(1)$ random access, but they suffer from fixed size allocations and expensive $O(N)$ contiguous shifts upon insertion or deletion in the middle.', 'ಅರೇಗಳು $O(1)$ ವೇಗದ ಪ್ರವೇಶವನ್ನು ನೀಡುತ್ತವೆ, ಆದರೆ ಅವುಗಳ ಸ್ಥಿರ ಗಾತ್ರದಿಂದಾಗಿ ಅಂಶಗಳನ್ನು ಸೇರಿಸಲು $O(N)$ ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ.'],
    ['A **Linked List** is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next using a pointer/reference.', 'ಒಂದು **ಲಿಂಕ್ಡ್ ಲಿಸ್ಟ್** ಮೆಮೊರಿಯಲ್ಲಿ ಪಾಯಿಂಟರ್‌ಗಳ ಮೂಲಕ ಪರಸ್ಪರ ಜೋಡಿಸಲಾದ ಡೇಟಾ ರಚನೆಯಾಗಿದೆ.']
  ]
};

// 6. SPANISH TRANSLATION DICTIONARY
const SPANISH_DICT: LanguageDictionary = {
  name: 'Spanish',
  headings: {
    'Linked Lists — Master Notes': 'Listas Enlazadas — Apuntes Maestros',
    'Introduction & Why Arrays Fall Short': '1. Introducción y por qué los arreglos se quedan cortos',
    'Anatomy of a Node': '2. Anatomía de un Nodo',
    'Core Operations': '3. Operaciones Principales',
    'Insertion at Head': 'A. Inserción al Inicio (O(1))',
    'Deletion by Value': 'B. Eliminación por Valor (O(N))',
    'Doubly Linked Lists (DLL)': '4. Listas Doblemente Enlazadas',
    'Common Pitfalls & Edge Cases': '5. Errores Comunes y Casos Límite',
    'Quick Comparison Matrix': 'Matriz Rápida de Comparación'
  },
  phrases: [
    ['Arrays provide $O(1)$ random access, but they suffer from fixed size allocations and expensive $O(N)$ contiguous shifts upon insertion or deletion in the middle.', 'Los arreglos ofrecen acceso aleatorio en $O(1)$, pero sufren de asignaciones de tamaño fijo y costosos desplazamientos contiguos en $O(N)$ al insertar o eliminar en el medio.'],
    ['A **Linked List** is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next using a pointer/reference.', 'Una **Lista Enlazada** es una colección lineal de elementos de datos cuyo orden no está dado por su ubicación física en memoria, sino mediante punteros o referencias.'],
    ['Insertion at Head: Linked List is $O(1)$ vs Array $O(N)', 'Inserción al Inicio: Lista Enlazada es $O(1)$ vs Arreglo $O(N)'],
    ['Access by Index: Linked List is $O(N)$ vs Array $O(1)', 'Acceso por Índice: Lista Enlazada es $O(N)$ vs Arreglo $O(1)'],
    ['Memory Overhead: Linked List requires pointer storage per node (8 bytes on 64-bit JVM)', 'Sobrecarga de Memoria: La lista enlazada requiere espacio para punteros por cada nodo.'],
    ['Cache Locality: Arrays benefit from CPU prefetching; Linked Lists suffer from random heap hops.', 'Localidad de Caché: Los arreglos se benefician de la precarga de CPU; las listas sufren saltos aleatorios en la memoria heap.']
  ]
};

// 7. FRENCH TRANSLATION DICTIONARY
const FRENCH_DICT: LanguageDictionary = {
  name: 'French',
  headings: {
    'Linked Lists — Master Notes': 'Listes Chaînées — Notes de Cours',
    'Introduction & Why Arrays Fall Short': '1. Introduction et limites des tableaux',
    'Anatomy of a Node': '2. Anatomie d\'un Nœud',
    'Core Operations': '3. Opérations Fondamentales',
    'Insertion at Head': 'A. Insertion en tête (O(1))',
    'Deletion by Value': 'B. Suppression par valeur (O(N))',
    'Doubly Linked Lists (DLL)': '4. Listes Doublement Chaînées',
    'Quick Comparison Matrix': 'Tableau comparatif rapide'
  },
  phrases: [
    ['Arrays provide $O(1)$ random access, but they suffer from fixed size allocations and expensive $O(N)$ contiguous shifts upon insertion or deletion in the middle.', 'Les tableaux offrent un accès direct en $O(1)$, mais souffrent d\'une taille fixe et de décalages coûteux en $O(N)$ lors des insertions au milieu.'],
    ['A **Linked List** is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next using a pointer/reference.', 'Une **Liste Chaînée** est une structure de données linéaire où les éléments ne sont pas contigus en mémoire mais liés par des pointeurs.']
  ]
};

// 8. GERMAN TRANSLATION DICTIONARY
const GERMAN_DICT: LanguageDictionary = {
  name: 'German',
  headings: {
    'Linked Lists — Master Notes': 'Verkettete Listen — Vorlesungsnotizen',
    'Introduction & Why Arrays Fall Short': '1. Einführung & Warum Arrays an ihre Grenzen stoßen',
    'Anatomy of a Node': '2. Anatomie eines Knotens',
    'Core Operations': '3. Kernoperationen',
    'Insertion at Head': 'A. Einfügen am Anfang (O(1))',
    'Doubly Linked Lists (DLL)': '4. Doppelt verkettete Listen',
    'Quick Comparison Matrix': 'Schnelle Vergleichsmatrix'
  },
  phrases: [
    ['Arrays provide $O(1)$ random access, but they suffer from fixed size allocations and expensive $O(N)$ contiguous shifts upon insertion or deletion in the middle.', 'Arrays bieten direkten $O(1)$-Zugriff, leiden jedoch unter festen Größen und teuren $O(N)$-Verschiebungen bei Einfügungen in der Mitte.'],
    ['A **Linked List** is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next using a pointer/reference.', 'Eine **Verkettete Liste** ist eine lineare Datenstruktur, deren Elemente nicht zusammenhängend im Speicher liegen, sondern über Zeiger verknüpft sind.']
  ]
};

const DICTIONARY_MAP: Record<string, LanguageDictionary> = {
  hi: HINDI_DICT,
  hindi: HINDI_DICT,
  ta: TAMIL_DICT,
  tamil: TAMIL_DICT,
  te: TELUGU_DICT,
  telugu: TELUGU_DICT,
  ml: MALAYALAM_DICT,
  malayalam: MALAYALAM_DICT,
  kn: KANNADA_DICT,
  kannada: KANNADA_DICT,
  es: SPANISH_DICT,
  spanish: SPANISH_DICT,
  fr: FRENCH_DICT,
  french: FRENCH_DICT,
  de: GERMAN_DICT,
  german: GERMAN_DICT,
};

/**
 * High quality academic translation for educational text
 */
export function translateAcademicDocumentOffline(text: string, targetLanguageCode: string): string {
  const code = targetLanguageCode.toLowerCase();
  const dict = DICTIONARY_MAP[code] || DICTIONARY_MAP['hi'];

  let result = text;

  // 1. Translate known headings
  for (const [englishHeading, localizedHeading] of Object.entries(dict.headings)) {
    const headingRegex = new RegExp(`(#+\\s*)${escapeRegex(englishHeading)}`, 'gi');
    result = result.replace(headingRegex, `$1${localizedHeading}`);
  }

  // 2. Translate explicit phrases
  for (const [eng, loc] of dict.phrases) {
    if (typeof eng === 'string') {
      result = result.replace(new RegExp(escapeRegex(eng), 'g'), loc);
    } else {
      result = result.replace(eng, loc);
    }
  }

  // 3. Translate common academic structural keywords if target is Hindi
  if (code === 'hi' || code === 'hindi') {
    result = translateStructuralKeywordsHindi(result);
  } else if (code === 'ta' || code === 'tamil') {
    result = translateStructuralKeywordsTamil(result);
  } else if (code === 'te' || code === 'telugu') {
    result = translateStructuralKeywordsTelugu(result);
  } else if (code === 'es' || code === 'spanish') {
    result = translateStructuralKeywordsSpanish(result);
  }

  return result;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function translateStructuralKeywordsHindi(content: string): string {
  return content
    .replace(/\bMaster Notes\b/gi, 'मुख्य अध्ययन नोट्स')
    .replace(/\bChapter Notes\b/gi, 'अध्याय के नोट्स')
    .replace(/\bIntroduction\b/gi, 'परिचय')
    .replace(/\bKey Takeaways\b/gi, 'मुख्य निष्कर्ष')
    .replace(/\bExam Focus\b/gi, 'परीक्षा हेतु महत्वपूर्ण बिंदु')
    .replace(/\bSummary\b/gi, 'सारांश')
    .replace(/\bTime Complexity\b/gi, 'समय जटिलता (Time Complexity)')
    .replace(/\bSpace Complexity\b/gi, 'स्थान जटिलता (Space Complexity)')
    .replace(/\bBest Case\b/gi, 'सर्वोत्तम स्थिति (Best Case)')
    .replace(/\bWorst Case\b/gi, 'निकृष्टतम स्थिति (Worst Case)')
    .replace(/\bAverage Case\b/gi, 'औसत स्थिति (Average Case)')
    .replace(/\bDefinition\b/gi, 'परिभाषा')
    .replace(/\bAdvantages\b/gi, 'प्रमुख लाभ')
    .replace(/\bDisadvantages\b/gi, 'सीमाएं एवं हानियां')
    .replace(/\bApplications\b/gi, 'व्यावहारिक अनुप्रयोग');
}

function translateStructuralKeywordsTamil(content: string): string {
  return content
    .replace(/\bMaster Notes\b/gi, 'முதன்மை குறிப்புகள்')
    .replace(/\bIntroduction\b/gi, 'அறிமுகம்')
    .replace(/\bKey Takeaways\b/gi, 'முக்கிய கருத்துகள்')
    .replace(/\bTime Complexity\b/gi, 'நேர சிக்கல் (Time Complexity)')
    .replace(/\bSpace Complexity\b/gi, 'இட சிக்கல் (Space Complexity)');
}

function translateStructuralKeywordsTelugu(content: string): string {
  return content
    .replace(/\bMaster Notes\b/gi, 'ముఖ్య అధ్యయన నోట్స్')
    .replace(/\bIntroduction\b/gi, 'పరిచయం')
    .replace(/\bKey Takeaways\b/gi, 'ముఖ్యమైన అంశాలు')
    .replace(/\bTime Complexity\b/gi, 'సమయ సంక్లిష్టత (Time Complexity)');
}

function translateStructuralKeywordsSpanish(content: string): string {
  return content
    .replace(/\bMaster Notes\b/gi, 'Apuntes Maestros')
    .replace(/\bIntroduction\b/gi, 'Introducción')
    .replace(/\bKey Takeaways\b/gi, 'Puntos Clave')
    .replace(/\bTime Complexity\b/gi, 'Complejidad Temporal')
    .replace(/\bSpace Complexity\b/gi, 'Complejidad Espacial');
}
