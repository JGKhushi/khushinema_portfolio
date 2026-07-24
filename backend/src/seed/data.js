/**
 * Canonical portfolio content, sourced from Khushi Nema's résumé.
 * Editing here + `npm run seed:fresh` is the fastest way to update the site.
 */

export const profile = {
  key: 'primary',
  name: 'Khushi Nema',
  headline: 'Software Developer building AI-powered, production-grade web systems',
  roles: [
    'Full-Stack Engineer',
    'Backend Developer',
    'MERN Specialist',
    'Java Developer',
    'AI Integration Engineer',
  ],
  location: 'Bhopal, Madhya Pradesh, India',
  email: 'khushinema22@gmail.com',
  phone: '+91 93992 41821',
  summary:
    'Computer Science graduate with hands-on experience building AI-powered and full-stack applications using MERN, React, TypeScript, Python, FastAPI and PostgreSQL. I ship production APIs, AI-assisted applications and visualization platforms — with a strong foundation in DSA, OOP, DBMS and system design.',
  about: [
    "I write software that has to survive contact with real users. At AskGalore I work across three live products — an e-commerce backend, a Canada-based engineering visualizer, and an AI website assistant — which means my code is judged by uptime, not by how neat the repo looks.",
    'My centre of gravity is the backend: designing REST APIs, modelling data properly, and keeping endpoints simple enough that the next person can extend them. I reach for Node.js, Express and MongoDB on the JavaScript side, and FastAPI with PostgreSQL and SQLAlchemy when the problem is Python-shaped.',
    "I have also spent enough time on the frontend to care about it. React, TypeScript and Tailwind, translated from Figma with real fidelity — because an API nobody can use comfortably isn't finished.",
    'Outside of shipping, I compete: two national hackathon finishes in the top 50 and top 30, and a daily habit on LeetCode, CodeChef and GeeksforGeeks. I also lead a 10-member PR and operations team at my university E-Cell, which taught me more about deadlines than any sprint board.',
  ],
  availability: {
    status: 'open',
    message: 'Open to full-time SDE roles',
  },
  resumeUrl: '/Khushi_Nema_Resume.pdf',
  currentFocus: [
    'Scalable backend architecture & system design',
    'Generative AI integration with Google Gemini',
    'Production-grade REST API design',
    'DSA practice in Java',
  ],
  socials: [
    {
      label: 'GitHub',
      handle: 'JGKhushi',
      url: 'https://github.com/JGKhushi',
      icon: 'github',
      order: 1,
    },
    {
      label: 'LinkedIn',
      handle: 'jgkhushi-nema',
      url: 'https://linkedin.com/in/jgkhushi-nema',
      icon: 'linkedin',
      order: 2,
    },
    {
      label: 'LeetCode',
      handle: 'Khushi_nema_',
      url: 'https://leetcode.com/u/Khushi_nema_',
      icon: 'code',
      order: 3,
    },
    {
      label: 'CodeChef',
      handle: 'khush_i',
      url: 'https://www.codechef.com/users/khush_i',
      icon: 'terminal',
      order: 4,
    },
    {
      label: 'GeeksforGeeks',
      handle: 'khushinsxza',
      url: 'https://www.geeksforgeeks.org/user/khushinsxza/',
      icon: 'braces',
      order: 5,
    },
    {
      label: 'Email',
      handle: 'khushinema22@gmail.com',
      url: 'mailto:khushinema22@gmail.com',
      icon: 'mail',
      order: 6,
    },
  ],
  stats: [
    { label: 'Production sites shipped', value: '3', caption: 'Live, customer-facing' },
    { label: 'CGPA', value: '8.49', caption: 'B.Tech CSBS, RGPV' },
    { label: 'Hackathon finishes', value: 'Top 30', caption: 'Out of 700+ participants' },
    { label: 'Records managed', value: '15K+', caption: 'National Games, Goa' },
  ],
};

export const experience = [
  {
    role: 'Full Stack Web Developer Intern',
    company: 'AskGalore',
    companyUrl: 'https://askgalore.com',
    location: 'Bhopal, India',
    type: 'internship',
    startDate: 'Feb 2026',
    endDate: 'Present',
    current: true,
    summary:
      'Building and maintaining three production products across e-commerce, engineering visualization and AI assistants — from Strapi backends to FastAPI geometry pipelines.',
    workstreams: [
      {
        name: 'Sublime House of Tea',
        url: 'https://sublimehouseoftea.com/',
        summary:
          'Engineered and maintained backend features for a production e-commerce platform using Strapi (headless CMS) and TypeScript, directly supporting live customer-facing operations. Designed scalable RESTful APIs following OOP and DBMS best practices, reducing endpoint complexity and improving backend maintainability across modules.',
      },
      {
        name: 'Heethr Snow Melt Layout Visualizer',
        url: 'https://visualizer.heethr.com/',
        summary:
          'A Canada-based full-stack application for visualizing snow melting cable layouts. Validated React frontend and FastAPI backend workflows including API testing, PostgreSQL models, SQLAlchemy, OpenCV and geometric calculations using Shapely. Assisted in Google Gemini AI integration and validation of AI-powered workflows.',
      },
      {
        name: 'Machine Avatars',
        url: 'https://machineavatars.com/',
        summary:
          'An AI-powered website assistant that understands website content and returns contextual responses using configurable prompts and guardrails. Redesigned UI/UX for key user flows and created automated end-to-end testing workflows with Playwright for critical application scenarios.',
      },
    ],
    achievements: [
      'Identified and resolved critical bugs across multiple production websites, preventing potential revenue-impacting downtime.',
      'Collaborated with cross-functional teams (design, product, QA) in Agile sprints, consistently delivering features within planned sprint cycles.',
      'Improved interface consistency and usability across inspection, submission and approval modules.',
    ],
    stack: [
      'TypeScript',
      'Strapi',
      'React',
      'FastAPI',
      'PostgreSQL',
      'SQLAlchemy',
      'OpenCV',
      'Shapely',
      'Google Gemini',
      'Playwright',
    ],
    order: 1,
  },
  {
    role: 'Data Manager (Freelance)',
    company: 'Thomas Cook India · National Games, Goa',
    location: 'Goa, India',
    type: 'freelance',
    startDate: 'Oct 2023',
    endDate: 'Nov 2023',
    current: false,
    summary:
      'Owned accommodation data for a national multi-sport event where a single allocation clash would strand an athlete.',
    achievements: [
      'Structured and managed accommodation data for 15,000+ event participants, ensuring zero allocation conflicts during a large-scale national event.',
      'Optimized hotel allocation logic, eliminating redundant bookings and reducing operational overhead across multiple venue sites.',
    ],
    stack: ['Data Modelling', 'Excel', 'Google Autocrat', 'Process Design'],
    order: 2,
  },
  {
    role: 'Web Developer',
    company: 'Agile Startup (Early-Stage Team)',
    location: 'Bhopal, India',
    type: 'contract',
    startDate: 'Dec 2022',
    endDate: 'Feb 2023',
    current: false,
    summary:
      'First professional engineering role — turning Figma files into shipping interfaces during a product launch.',
    achievements: [
      'Built pixel-accurate responsive UIs in React.js + Tailwind CSS by converting Figma designs into functional web interfaces, achieving full design-to-code fidelity.',
      "Contributed to bug triage, feature development and UI enhancements in an Agile team setting during the product's initial launch phase.",
    ],
    stack: ['React.js', 'Tailwind CSS', 'JavaScript', 'Figma', 'Git'],
    order: 3,
  },
];

export const projects = [
  {
    title: 'SafeFlame',
    slug: 'safeflame',
    tagline: 'Fire monitoring & NOC automation, end to end',
    category: 'full-stack',
    accent: '#f97316',
    year: '2025',
    role: 'Full-stack developer',
    featured: true,
    status: 'shipped',
    order: 1,
    description:
      'A MERN application that replaces the manual, paper-based fire NOC (No Objection Certificate) process with a digitized inspection tracking system — covering submission, inspection, and approval in one auditable flow.',
    problem:
      'Fire safety NOCs were processed on paper: applications lost between desks, no status visibility for applicants, and inspection records that could not be audited after the fact.',
    solution:
      'A role-based MERN system where applicants submit digitally, inspectors record findings against a structured schema, and approvals are tracked with a full status history. A chatbot handles the repetitive "where is my application" questions that dominated support load.',
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'REST APIs', 'Chatbot'],
    highlights: [
      {
        text: 'Replaced a manual paper-based NOC workflow with a digitized inspection tracking system, cutting processing friction significantly.',
      },
      {
        text: 'Integrated a chatbot for automated query resolution.',
        metric: '~40% fewer manual support interactions',
      },
      {
        text: 'Redesigned UI/UX for key user flows, improving consistency across inspection, submission and approval modules.',
      },
    ],
    links: { github: 'https://github.com/JGKhushi' },
  },
  {
    title: 'ZeroBite',
    slug: 'zerobite',
    tagline: 'Food surplus, routed to the people who need it',
    category: 'full-stack',
    accent: '#22c55e',
    year: '2025',
    role: 'Full-stack developer',
    featured: true,
    status: 'shipped',
    order: 2,
    description:
      'A food waste management and redistribution platform connecting donors with NGOs and recipients, enabling real-time coordination of surplus food before it spoils.',
    problem:
      'Edible surplus food is discarded daily while nearby NGOs go unserved — the bottleneck is not supply, it is the absence of a real-time matching layer between donors and recipients.',
    solution:
      'A React + Node platform with Prisma-modelled PostgreSQL data, where donors post surplus and NGOs claim it live. A recipe suggestion layer helps recipients actually use what arrives, rather than receiving ingredients they cannot combine.',
    stack: ['React', 'Node.js', 'Prisma', 'PostgreSQL', 'REST APIs'],
    highlights: [
      {
        text: 'Built real-time surplus coordination between donors, NGOs and recipients.',
      },
      {
        text: 'Optimized PostgreSQL queries via Prisma ORM.',
        metric: '~25% faster average API response under load',
      },
      {
        text: 'Added recipe suggestions so recipients can make full use of donated food.',
      },
    ],
    links: { github: 'https://github.com/JGKhushi' },
  },
  {
    title: 'Sugarcane Production Analysis',
    slug: 'sugarcane-production-analysis',
    tagline: 'Exploratory data analysis on agricultural yield',
    category: 'data',
    accent: '#06b6d4',
    year: '2024',
    role: 'Data analyst',
    featured: false,
    status: 'shipped',
    order: 3,
    description:
      'End-to-end exploratory data analysis on agricultural datasets, extracting actionable insight on yield trends, regional land usage and production efficiency.',
    problem:
      'Raw agricultural production data is published widely but rarely interpreted — the trends that matter to planning are buried in undifferentiated tables.',
    solution:
      'A Pandas-driven EDA pipeline with cleaning, aggregation and Matplotlib visual storytelling, surfacing regional and temporal patterns in production efficiency.',
    stack: ['Python', 'Pandas', 'Matplotlib', 'NumPy', 'Jupyter'],
    highlights: [
      { text: 'Extracted actionable insights on yield trends, regional land usage and production efficiency.' },
      { text: 'Produced clear visuals to communicate data-driven findings to a non-technical audience.' },
    ],
    links: { github: 'https://github.com/JGKhushi' },
  },
  {
    title: 'Heethr Snow Melt Visualizer',
    slug: 'heethr-snow-melt-visualizer',
    tagline: 'Geometric cable layout planning for Canadian winters',
    category: 'ai',
    accent: '#6366f1',
    year: '2026',
    role: 'Full-stack contributor (AskGalore)',
    featured: true,
    status: 'shipped',
    order: 4,
    description:
      'A production full-stack application for visualizing snow melting cable layouts, combining a React frontend with a FastAPI backend that performs real geometric computation over site plans.',
    problem:
      'Planning snow-melt cable layouts by hand is slow and error-prone — spacing, coverage and total cable length all have to satisfy geometric constraints across an irregular surface.',
    solution:
      'A React interface over a FastAPI service that models sites in PostgreSQL via SQLAlchemy, uses OpenCV and Shapely for geometry, and layers Google Gemini for AI-assisted workflow steps. My work covered API testing, data models and validation of the AI-powered flows.',
    stack: [
      'React',
      'FastAPI',
      'PostgreSQL',
      'SQLAlchemy',
      'OpenCV',
      'Shapely',
      'Google Gemini',
      'Python',
    ],
    highlights: [
      { text: 'Validated React frontend and FastAPI backend workflows including API and regression testing.' },
      { text: 'Worked across PostgreSQL models, SQLAlchemy and Shapely-based geometric calculations.' },
      { text: 'Assisted Google Gemini integration and validation of AI-powered workflows.' },
    ],
    links: { live: 'https://visualizer.heethr.com/' },
  },
  {
    title: 'Machine Avatars',
    slug: 'machine-avatars',
    tagline: 'An AI assistant that actually reads the website',
    category: 'ai',
    accent: '#a855f7',
    year: '2026',
    role: 'Frontend & QA contributor (AskGalore)',
    featured: false,
    status: 'shipped',
    order: 5,
    description:
      'An AI-powered website assistant that understands site content and provides contextual responses through configurable prompts and guardrails.',
    problem:
      'Generic chatbots answer confidently about things the site never said. The hard part is grounding responses in actual page content while keeping the model inside safe boundaries.',
    solution:
      'A configurable prompt-and-guardrail layer over website content. I redesigned key user flows for consistency and built automated end-to-end Playwright coverage for the critical scenarios.',
    stack: ['React', 'TypeScript', 'Generative AI', 'Playwright', 'Prompt Engineering'],
    highlights: [
      { text: 'Redesigned UI/UX for key user flows, improving interface consistency and usability.' },
      { text: 'Created automated end-to-end testing workflows using Playwright for critical scenarios.' },
    ],
    links: { live: 'https://machineavatars.com/' },
  },
  {
    title: 'Sublime House of Tea',
    slug: 'sublime-house-of-tea',
    tagline: 'Production e-commerce backend on Strapi',
    category: 'backend',
    accent: '#eab308',
    year: '2026',
    role: 'Backend contributor (AskGalore)',
    featured: false,
    status: 'shipped',
    order: 6,
    description:
      'Backend engineering for a live e-commerce platform, built on Strapi as a headless CMS with TypeScript, directly supporting customer-facing operations.',
    problem:
      'A growing storefront needed backend modules that non-engineers could operate, without the API surface sprawling into something unmaintainable.',
    solution:
      'Strapi content modelling plus scalable RESTful APIs designed around OOP and DBMS best practice — reducing endpoint complexity and improving maintainability across modules.',
    stack: ['Strapi', 'TypeScript', 'Node.js', 'REST APIs', 'E-commerce'],
    highlights: [
      { text: 'Engineered and maintained backend features for a live, revenue-generating platform.' },
      { text: 'Designed scalable REST APIs that reduced endpoint complexity across modules.' },
    ],
    links: { live: 'https://sublimehouseoftea.com/' },
  },
];

export const skills = [
  {
    category: 'Languages',
    icon: 'code',
    accent: '#6366f1',
    description: 'What I think in.',
    order: 1,
    skills: [
      { name: 'Java', level: 88, note: 'OOP & DSA' },
      { name: 'JavaScript', level: 90 },
      { name: 'TypeScript', level: 82 },
      { name: 'Python', level: 85 },
      { name: 'SQL', level: 80 },
    ],
  },
  {
    category: 'Backend',
    icon: 'server',
    accent: '#22c55e',
    description: 'Where I spend most of my time.',
    order: 2,
    skills: [
      { name: 'Node.js', level: 88 },
      { name: 'Express.js', level: 88 },
      { name: 'FastAPI', level: 82 },
      { name: 'REST API Design', level: 90 },
      { name: 'Strapi', level: 78 },
      { name: 'SQLAlchemy', level: 75 },
    ],
  },
  {
    category: 'Frontend',
    icon: 'layout',
    accent: '#06b6d4',
    description: 'Interfaces that survive real users.',
    order: 3,
    skills: [
      { name: 'React.js', level: 90 },
      { name: 'Redux Toolkit', level: 78 },
      { name: 'Tailwind CSS', level: 88 },
      { name: 'Vite', level: 82 },
      { name: 'Bootstrap', level: 75 },
    ],
  },
  {
    category: 'Databases',
    icon: 'database',
    accent: '#f97316',
    description: 'Modelled properly, indexed deliberately.',
    order: 4,
    skills: [
      { name: 'MongoDB', level: 86 },
      { name: 'PostgreSQL', level: 84 },
      { name: 'Prisma', level: 80 },
      { name: 'Mongoose', level: 85 },
    ],
  },
  {
    category: 'AI / GenAI',
    icon: 'sparkles',
    accent: '#a855f7',
    description: 'Shipped into production, not just prototyped.',
    order: 5,
    skills: [
      { name: 'Google Gemini API', level: 82 },
      { name: 'Prompt Engineering', level: 85 },
      { name: 'AI-assisted Applications', level: 80 },
      { name: 'ML Fundamentals', level: 70 },
      { name: 'NLP Fundamentals', level: 68 },
    ],
  },
  {
    category: 'Computer Vision & Data',
    icon: 'scan',
    accent: '#14b8a6',
    description: 'Geometry and analysis, from the Heethr work.',
    order: 6,
    skills: [
      { name: 'OpenCV', level: 75 },
      { name: 'Shapely', level: 74 },
      { name: 'NumPy', level: 82 },
      { name: 'Pandas', level: 84 },
      { name: 'Matplotlib', level: 80 },
    ],
  },
  {
    category: 'Testing & Tooling',
    icon: 'flask',
    accent: '#ec4899',
    description: 'Because "works on my machine" is not a status.',
    order: 7,
    skills: [
      { name: 'Playwright', level: 82 },
      { name: 'API & Regression Testing', level: 85 },
      { name: 'Postman', level: 88 },
      { name: 'Git & GitHub', level: 90 },
      { name: 'Azure Blob Storage', level: 70 },
    ],
  },
  {
    category: 'Core CS',
    icon: 'cpu',
    accent: '#eab308',
    description: 'The part that does not go out of date.',
    order: 8,
    skills: [
      { name: 'Data Structures & Algorithms', level: 88 },
      { name: 'OOP', level: 90 },
      { name: 'DBMS', level: 86 },
      { name: 'Operating Systems', level: 80 },
      { name: 'Computer Networks', level: 78 },
      { name: 'System Design', level: 76 },
    ],
  },
];

export const education = [
  {
    degree: 'B.Tech — Computer Science and Business Systems',
    institution: 'School of Information Technology, RGPV',
    location: 'Bhopal, India',
    score: 'GPA 8.49 / 10',
    startDate: 'Oct 2022',
    endDate: 'May 2026',
    coursework: [
      'Data Structures & Algorithms',
      'DBMS',
      'Operating Systems',
      'Object-Oriented Programming',
      'Computer Networks',
      'System Design',
      'Software Engineering',
    ],
    order: 1,
  },
  {
    degree: 'Higher Secondary (Class 12)',
    institution: 'KRB School, Kareli',
    score: '93.8%',
    startDate: '2021',
    endDate: '2022',
    coursework: [],
    order: 2,
  },
  {
    degree: 'Secondary (Class 10)',
    institution: 'PDS School, Kareli',
    score: '90.2%',
    startDate: '2019',
    endDate: '2020',
    coursework: [],
    order: 3,
  },
];

export const achievements = [
  {
    title: 'Prayatna 2.0 Hackathon',
    detail: 'Finished in the top 50 of a national-level competition.',
    metric: 'Top 50 / 1,400+',
    type: 'hackathon',
    period: '2024',
    order: 1,
  },
  {
    title: 'Kriyeta 4.0 Hackathon',
    detail: 'Finished in the top 30 against a field of 700+ participants.',
    metric: 'Top 30 / 700+',
    type: 'hackathon',
    period: '2024',
    order: 2,
  },
  {
    title: 'Head — PR & Operations, E-Cell RGPV',
    detail:
      'Led a 10-member team, grew LinkedIn reach through targeted campaigns, and organized large-scale events with industry speakers and sponsors.',
    metric: '~25% reach growth',
    type: 'leadership',
    period: 'Dec 2022 – Present',
    order: 3,
  },
  {
    title: 'Competitive Programming',
    detail:
      'Active problem solver on LeetCode, with ongoing practice on CodeChef and GeeksforGeeks.',
    metric: 'Daily practice',
    type: 'coding',
    period: 'Ongoing',
    url: 'https://leetcode.com/u/Khushi_nema_',
    order: 4,
  },
];
