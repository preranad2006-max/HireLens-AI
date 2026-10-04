import type { JobDescription, CandidateResume } from '../types/hirelens';

export const DEMO_JOB_DESCRIPTION: JobDescription = {
  id: 'jd_demo_fullstack_ai',
  title: 'Senior Full-Stack & AI Systems Engineer',
  rawText: `Job Title: Senior Full-Stack & AI Systems Engineer
Location: Remote / Hybrid
Department: Core Platform & AI Innovation

About the Role:
We are seeking an exceptional Senior Full-Stack & AI Systems Engineer to architect and build our next-generation intelligent applications. You will spearhead end-to-end development, from slick and responsive user interfaces to resilient backend APIs and AI retrieval pipelines.

Key Requirements:
- 5+ years of professional software engineering experience building scalable web applications.
- Strong proficiency in modern frontend development using React and TypeScript.
- Deep expertise in backend engineering with Node.js and Python.
- Proven experience with relational databases, specifically PostgreSQL, schema design, and query optimization.
- Robust knowledge of REST API architecture, HTTP specifications, and microservice integration.

Preferred Qualifications (Bonus):
- Hands-on experience with Docker containerization and CI/CD automation.
- Cloud deployment and architecture experience on AWS or GCP.
- Practical experience with LLM & Generative AI integration, vector databases, or LangChain.
- In-memory caching and message queuing using Redis.

Education:
- Bachelor's or Master's degree in Computer Science, Software Engineering, or equivalent practical experience.

Responsibilities:
- Build high-performance frontend interfaces with React, TypeScript, and modern state workflows.
- Architect robust backend services and microservices using Node.js and Python.
- Integrate GenAI / LLM services, semantic search, and streaming response pipelines.
- Ensure 99.9% uptime, comprehensive unit testing, and performant database indexing.`,
  requiredSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'REST API'],
  preferredSkills: ['Docker', 'AWS', 'LLM & Generative AI', 'Redis'],
  requiredExperienceYears: 5,
  seniorityLevel: 'Senior',
  requiredEducation: [
    'Bachelor\'s or Master\'s degree in Computer Science, Software Engineering, or equivalent practical experience'
  ],
  responsibilities: [
    'Build high-performance frontend interfaces with React and TypeScript',
    'Architect robust backend services and microservices using Node.js and Python',
    'Integrate GenAI / LLM services and streaming response pipelines',
    'Design database schemas and optimize PostgreSQL queries'
  ],
  extracted: true
};

export const DEMO_CANDIDATES: CandidateResume[] = [
  {
    id: 'cand_alex_rivera',
    fileName: 'Alex_Rivera_Senior_FullStack_AI_Resume.pdf',
    fileSize: '184 KB',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    summary: 'Senior Full-Stack & AI Engineer with 6.5+ years of experience engineering high-scale distributed applications, reactive web platforms, and LLM-powered RAG systems.',
    skills: [
      'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL',
      'REST API', 'Docker', 'AWS', 'LLM & Generative AI', 'Redis',
      'Git', 'Unit Testing & TDD', 'Microservices'
    ],
    experienceYears: 6.5,
    experienceHistory: [
      {
        role: 'Staff / Senior Full Stack Engineer',
        company: 'Synthetix AI Labs',
        duration: '2022 - Present (2.5 yrs)',
        description: 'Led a squad of 8 engineers building enterprise multi-tenant GenAI copilots. Architected React/TypeScript frontend and Python FastAPI/Node.js backend processing 4M+ daily API requests with sub-100ms latency.'
      },
      {
        role: 'Senior Software Engineer',
        company: 'CloudMatrix Technologies',
        duration: '2019 - 2022 (3 yrs)',
        description: 'Engineered reactive dashboard modules with React, Node.js microservices, and PostgreSQL. Automated AWS ECS container deployments with Docker and CI/CD pipelines.'
      },
      {
        role: 'Software Engineer',
        company: 'Nexus Digital',
        duration: '2018 - 2019 (1 yr)',
        description: 'Developed RESTful services and relational database migrations with PostgreSQL and Redis caching layers.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2018'
      }
    ],
    projects: [
      {
        title: 'Enterprise Semantic RAG Knowledge Engine',
        techStack: ['React', 'TypeScript', 'Python', 'PostgreSQL', 'LLM & Generative AI', 'Redis'],
        description: 'Designed an enterprise-grade document search and retrieval system featuring vector indexing, live streaming responses, and granular RBAC security.'
      },
      {
        title: 'High-Throughput Distributed Event Pipeline',
        techStack: ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Redis'],
        description: 'Architected async event processing ingestion pipeline handling 100k events/sec with automated dead-letter queues and failover.'
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect - Associate',
      'CKA (Certified Kubernetes Administrator)'
    ],
    extracted: true,
    status: 'ready',
    rawText: `Alex Rivera - Senior Full Stack & AI Systems Engineer
alex.rivera@example.com | San Francisco, CA | linkedin.com/in/alexrivera-ai

SUMMARY
Senior Full-Stack & AI Engineer with 6.5 years experience delivering production web platforms, reactive frontend user experiences, and scalable cloud backends with GenAI integration.

SKILLS
Frontend: React, TypeScript, JavaScript, Next.js, HTML/CSS, Tailwind CSS
Backend: Node.js, Python, FastAPI, Express, REST API, GraphQL
Databases: PostgreSQL, Redis, DynamoDB, SQL
Cloud/DevOps: Docker, AWS, Kubernetes, CI/CD, Git
AI/ML: LLM & Generative AI, LangChain, Vector Search, PyTorch
Testing: Unit Testing & TDD, Jest, PyTest

EXPERIENCE
Synthetix AI Labs — Senior Full Stack Engineer (2022 - Present)
- Architected enterprise React and TypeScript web clients paired with Node.js and Python microservices.
- Deployed PostgreSQL database clusters with pgvector extension and Redis caching.
- Integrated generative AI models with streaming responses and rigorous automated testing.

CloudMatrix Technologies — Software Engineer (2019 - 2022)
- Built resilient customer portals using React, TypeScript, and REST APIs.
- Maintained Dockerized services deployed on AWS ECS.

EDUCATION
B.S. in Computer Science - University of California, Berkeley (2018)

CERTIFICATIONS
- AWS Certified Solutions Architect`
  },
  {
    id: 'cand_maya_chen',
    fileName: 'Maya_Chen_Resume_2026.pdf',
    fileSize: '162 KB',
    name: 'Maya Chen',
    email: 'maya.chen@techdev.org',
    summary: 'Full-Stack Developer with 4.5 years experience specializing in modern React interfaces, TypeScript applications, and Python FastAPI/Django backend systems.',
    skills: [
      'React', 'TypeScript', 'JavaScript', 'Python', 'FastAPI',
      'PostgreSQL', 'REST API', 'HTML/CSS', 'Tailwind CSS', 'Docker',
      'Git', 'Unit Testing & TDD'
    ],
    experienceYears: 4.5,
    experienceHistory: [
      {
        role: 'Full Stack Software Engineer',
        company: 'Veloce Data Systems',
        duration: '2021 - Present (3.5 yrs)',
        description: 'Built complex data visualization workspaces with React, TypeScript, and Tailwind CSS. Implemented asynchronous REST APIs and relational migrations using Python and PostgreSQL.'
      },
      {
        role: 'Frontend Developer',
        company: 'PixelCraft Interactive',
        duration: '2020 - 2021 (1 yr)',
        description: 'Engineered component libraries and single-page applications with React and JavaScript.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Software Engineering',
        institution: 'University of Washington',
        year: '2020'
      }
    ],
    projects: [
      {
        title: 'Real-Time Financial Analytics Dashboard',
        techStack: ['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL'],
        description: 'Interactive dashboard rendering streaming charts, websocket order books, and CSV export utilities.'
      },
      {
        title: 'Cloud Document Collaborator',
        techStack: ['React', 'TypeScript', 'Docker', 'REST API'],
        description: 'Collaborative markdown editor with real-time sync and containerized deployment.'
      }
    ],
    certifications: [
      'AWS Certified Developer - Associate'
    ],
    extracted: true,
    status: 'ready',
    rawText: `Maya Chen - Full Stack Software Engineer
maya.chen@techdev.org | Seattle, WA

EXPERIENCE
Veloce Data Systems — Full Stack Software Engineer (2021 - Present, 3.5 yrs)
- Led frontend architecture using React, TypeScript, and Tailwind CSS.
- Developed backend microservices using Python, FastAPI, and PostgreSQL.
- Authored automated integration and unit tests using Jest and Pytest.

PixelCraft Interactive — Frontend Engineer (2020 - 2021, 1 yr)
- Built interactive user interfaces in React, HTML5, and CSS3.

SKILLS
React, TypeScript, JavaScript, Python, FastAPI, PostgreSQL, REST API, Docker, Git, Unit Testing & TDD

EDUCATION
B.S. in Software Engineering, University of Washington (2020)

CERTIFICATIONS
AWS Certified Developer`
  },
  {
    id: 'cand_david_kim',
    fileName: 'David_Kim_Backend_Cloud_Resume.pdf',
    fileSize: '210 KB',
    name: 'David Kim',
    email: 'david.kim@backendops.net',
    summary: 'Senior Backend & Distributed Systems Engineer with 6 years experience in Node.js, Python, PostgreSQL, AWS infrastructure, and Dockerized microservices.',
    skills: [
      'Node.js', 'Python', 'PostgreSQL', 'REST API', 'Docker',
      'AWS', 'Redis', 'Go', 'Kubernetes', 'Microservices',
      'System Design', 'Git'
    ],
    experienceYears: 6.0,
    experienceHistory: [
      {
        role: 'Senior Backend Engineer',
        company: 'HyperScale Networks',
        duration: '2021 - Present (3 yrs)',
        description: 'Architected distributed backend pipelines using Node.js, Go, and Python. Tuned PostgreSQL database queries and configured Redis caching clusters.'
      },
      {
        role: 'Cloud Infrastructure & Backend Engineer',
        company: 'AeroCloud Solutions',
        duration: '2018 - 2021 (3 yrs)',
        description: 'Maintained microservice APIs on AWS and Docker. Implemented automated monitoring and zero-downtime database migrations.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Georgia Institute of Technology',
        year: '2018'
      }
    ],
    projects: [
      {
        title: 'Distributed Transaction Processing Engine',
        techStack: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
        description: 'Engineered fault-tolerant transaction broker processing 25,000 requests/sec with idempotency guarantees.'
      },
      {
        title: 'Kubernetes Multi-Cluster Orchestrator',
        techStack: ['Go', 'Docker', 'Kubernetes', 'AWS'],
        description: 'Automated cluster scaling and load balancing across 3 cloud regions.'
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'CKA (Certified Kubernetes Administrator)'
    ],
    extracted: true,
    status: 'ready',
    rawText: `David Kim - Senior Backend & DevOps Engineer
david.kim@backendops.net | Austin, TX

SUMMARY
Senior Engineer with 6 years experience building distributed backends with Node.js, Python, and PostgreSQL.

SKILLS
Node.js, Python, Go, PostgreSQL, Redis, REST API, Docker, Kubernetes, AWS, Microservices, System Design, Git

EXPERIENCE
HyperScale Networks — Senior Backend Engineer (2021 - Present, 3 yrs)
- Engineered scalable REST APIs using Node.js and Python.
- Managed PostgreSQL clusters with partition pruning and Redis replication.

AeroCloud Solutions — Backend Engineer (2018 - 2021, 3 yrs)
- Built containerized microservices in Docker and AWS ECS.

EDUCATION
B.S. in Computer Science - Georgia Institute of Technology (2018)`
  },
  {
    id: 'cand_elena_rostova',
    fileName: 'Elena_Rostova_Resume.pdf',
    fileSize: '140 KB',
    name: 'Elena Rostova',
    email: 'elena.rostova@devmail.io',
    summary: 'Junior Frontend & Web Developer with 1.5 years experience developing clean web interfaces with React, JavaScript, HTML5, and RESTful APIs.',
    skills: [
      'React', 'JavaScript', 'HTML/CSS', 'REST API', 'Git',
      'MySQL'
    ],
    experienceYears: 1.5,
    experienceHistory: [
      {
        role: 'Junior Web Developer',
        company: 'BrightSpark Digital',
        duration: '2023 - Present (1.5 yrs)',
        description: 'Created responsive user interfaces using React, JavaScript, and HTML/CSS. Integrated customer-facing components with backend REST APIs.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Information Systems',
        institution: 'Ohio State University',
        year: '2023'
      }
    ],
    projects: [
      {
        title: 'Community Bookstore Web Application',
        techStack: ['React', 'JavaScript', 'HTML/CSS', 'REST API'],
        description: 'Single-page responsive catalog application allowing users to search, filter, and review books.'
      }
    ],
    certifications: [],
    extracted: true,
    status: 'ready',
    rawText: `Elena Rostova - Junior Web Developer
elena.rostova@devmail.io | Columbus, OH

EXPERIENCE
BrightSpark Digital — Junior Web Developer (2023 - Present, 1.5 yrs)
- Developed responsive UI components using React, JavaScript, HTML5, and CSS3.
- Integrated REST APIs for user registration, checkout, and inventory views.
- Maintained code repositories using Git and GitHub.

SKILLS
React, JavaScript, HTML/CSS, REST API, Git, MySQL

EDUCATION
B.S. in Information Systems, Ohio State University (2023)`
  },
  {
    id: 'cand_marcus_brody',
    fileName: 'Marcus_Brody_Data_Analyst.pdf',
    fileSize: '155 KB',
    name: 'Marcus Brody',
    email: 'm.brody@analyticsgroup.com',
    summary: 'Data Analyst & SQL Specialist with 3 years experience building business intelligence dashboards, ETL automation scripts, and relational SQL reports.',
    skills: [
      'SQL', 'Data Analysis', 'Python', 'MySQL', 'Git'
    ],
    experienceYears: 3.0,
    experienceHistory: [
      {
        role: 'Business Intelligence & Data Analyst',
        company: 'MetricPulse Analytics',
        duration: '2021 - Present (3 yrs)',
        description: 'Engineered automated SQL reporting models and Tableau dashboards. Automated weekly data cleansing workflows using Python scripts.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Economics & Business Analytics',
        institution: 'University of Illinois',
        year: '2021'
      }
    ],
    projects: [
      {
        title: 'Executive Financial Metric Dashboard',
        techStack: ['SQL', 'Data Analysis', 'Python'],
        description: 'Aggregated company KPIs and recurring revenue forecasts into interactive data dashboards.'
      }
    ],
    certifications: [
      'Google Data Analytics Professional Certificate'
    ],
    extracted: true,
    status: 'ready',
    rawText: `Marcus Brody - Data & BI Analyst
m.brody@analyticsgroup.com | Chicago, IL

EXPERIENCE
MetricPulse Analytics — Business Intelligence Analyst (2021 - Present, 3 yrs)
- Created complex SQL queries and relational views for executive reporting.
- Wrote Python automation scripts using Pandas for data extraction and cleansing.

SKILLS
SQL, Data Analysis, Python, MySQL, Git

EDUCATION
B.S. in Economics & Business Analytics, University of Illinois (2021)`
  }
];

export const ALTERNATE_JOB_PRESETS: { title: string; jd: JobDescription }[] = [
  {
    title: 'Senior Full-Stack & AI Systems Engineer',
    jd: DEMO_JOB_DESCRIPTION
  },
  {
    title: 'Cloud DevOps & Infrastructure Lead',
    jd: {
      id: 'jd_devops_lead',
      title: 'Senior Cloud DevOps & Infrastructure Engineer',
      rawText: `Job Title: Senior Cloud DevOps & Infrastructure Engineer
Location: Remote
Required Experience: 5+ years

We are looking for a Senior Cloud DevOps Engineer to lead our infrastructure automation, Kubernetes orchestration, and cloud reliability engineering.

Requirements:
- 5+ years of experience in DevOps, Cloud Architecture, or Site Reliability Engineering.
- Deep expertise with Docker and Kubernetes container orchestration.
- Proven mastery of AWS or GCP cloud environments.
- Strong knowledge of CI/CD pipelines (GitHub Actions, GitLab CI), Terraform, and Git.
- Experience with Python or Go scripting for infrastructure automation.

Preferred:
- CKA or AWS Solutions Architect certification.
- Microservices, Kafka, Redis caching, and Prometheus/Grafana monitoring.

Education:
- Bachelor's degree in Computer Science or equivalent engineering experience.`,
      requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Python'],
      preferredSkills: ['Go', 'Microservices', 'Redis', 'Kafka'],
      requiredExperienceYears: 5,
      seniorityLevel: 'Senior',
      requiredEducation: ['Bachelor\'s degree in Computer Science or related field'],
      responsibilities: [
        'Maintain multi-region Kubernetes clusters on AWS',
        'Build automated CI/CD deployment pipelines',
        'Implement Infrastructure as Code using Terraform',
        'Ensure system reliability and proactive observability'
      ],
      extracted: true
    }
  },
  {
    title: 'Lead Frontend / React Platform Architect',
    jd: {
      id: 'jd_frontend_lead',
      title: 'Lead Frontend / React Platform Architect',
      rawText: `Job Title: Lead Frontend / React Platform Architect
Location: Remote / New York, NY
Required Experience: 6+ years

Join us to lead our web application architecture and design systems.

Core Requirements:
- 6+ years of specialized web frontend engineering.
- Mastery of React, TypeScript, Next.js, and modern state architectures.
- Deep knowledge of HTML/CSS, Tailwind CSS, accessibility, and Core Web Vitals.
- Experience consuming REST API and GraphQL endpoints.
- Dedication to Unit Testing & TDD (Jest, Cypress, Playwright).

Preferred:
- Node.js backend integration experience.
- Docker and microfrontend architecture.

Education:
- B.S. in CS or related degree.`,
      requiredSkills: ['React', 'TypeScript', 'Next.js', 'HTML/CSS', 'Tailwind CSS', 'REST API', 'Unit Testing & TDD'],
      preferredSkills: ['GraphQL', 'Node.js', 'Docker', 'Microservices'],
      requiredExperienceYears: 6,
      seniorityLevel: 'Lead',
      requiredEducation: ['Bachelor\'s degree in Computer Science or equivalent'],
      responsibilities: [
        'Lead frontend architecture across core enterprise applications',
        'Build modular, accessible UI design system components',
        'Optimize Core Web Vitals, page latency, and rendering performance'
      ],
      extracted: true
    }
  }
];
