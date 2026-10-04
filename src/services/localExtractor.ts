import type { JobDescription, CandidateResume } from '../types/hirelens';

// Canonical Skills Dictionary with Category & Aliases
export const SKILL_TAXONOMY: {
  name: string;
  category: string;
  aliases: string[];
  relatedSkills: string[];
}[] = [
  // Frontend
  { name: 'React', category: 'Frontend', aliases: ['reactjs', 'react.js', 'react native'], relatedSkills: ['Next.js', 'Redux', 'JavaScript', 'TypeScript', 'Vue.js'] },
  { name: 'TypeScript', category: 'Languages', aliases: ['ts'], relatedSkills: ['JavaScript', 'React', 'Node.js'] },
  { name: 'JavaScript', category: 'Languages', aliases: ['js', 'es6', 'ecmascript'], relatedSkills: ['TypeScript', 'HTML/CSS', 'React', 'Node.js'] },
  { name: 'Next.js', category: 'Frontend', aliases: ['nextjs', 'next'], relatedSkills: ['React', 'TypeScript', 'Node.js'] },
  { name: 'Vue.js', category: 'Frontend', aliases: ['vue', 'vuejs', 'nuxt'], relatedSkills: ['React', 'JavaScript', 'HTML/CSS'] },
  { name: 'Angular', category: 'Frontend', aliases: ['angularjs', 'angular 2+'], relatedSkills: ['TypeScript', 'RxJS', 'HTML/CSS'] },
  { name: 'HTML/CSS', category: 'Frontend', aliases: ['html', 'css', 'html5', 'css3', 'sass', 'scss'], relatedSkills: ['JavaScript', 'Tailwind CSS'] },
  { name: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwind', 'tailwindcss'], relatedSkills: ['HTML/CSS', 'React'] },

  // Backend
  { name: 'Node.js', category: 'Backend', aliases: ['node', 'nodejs', 'express', 'express.js', 'nestjs'], relatedSkills: ['JavaScript', 'TypeScript', 'FastAPI', 'Backend Architecture'] },
  { name: 'Python', category: 'Languages', aliases: ['python3', 'py'], relatedSkills: ['Django', 'FastAPI', 'Flask', 'Machine Learning', 'Data Science'] },
  { name: 'FastAPI', category: 'Backend', aliases: ['fast api'], relatedSkills: ['Python', 'Django', 'Flask', 'REST API'] },
  { name: 'Django', category: 'Backend', aliases: ['django rest framework', 'drf'], relatedSkills: ['Python', 'FastAPI', 'PostgreSQL'] },
  { name: 'Java', category: 'Languages', aliases: ['core java', 'java 8', 'java 17'], relatedSkills: ['Spring Boot', 'Spring', 'Microservices'] },
  { name: 'Spring Boot', category: 'Backend', aliases: ['spring', 'springboot'], relatedSkills: ['Java', 'Microservices', 'Hibernate'] },
  { name: 'Go', category: 'Languages', aliases: ['golang'], relatedSkills: ['Microservices', 'Docker', 'Kubernetes', 'Distributed Systems'] },
  { name: 'C#', category: 'Languages', aliases: ['c-sharp', '.net', 'asp.net', 'dotnet', '.net core'], relatedSkills: ['SQL Server', 'Azure'] },
  { name: 'REST API', category: 'Backend', aliases: ['restful apis', 'restful api', 'rest', 'api development'], relatedSkills: ['GraphQL', 'Node.js', 'FastAPI'] },
  { name: 'GraphQL', category: 'Backend', aliases: ['apollo graphql', 'apollo'], relatedSkills: ['REST API', 'Node.js', 'React'] },

  // Databases
  { name: 'PostgreSQL', category: 'Database', aliases: ['postgres', 'psql'], relatedSkills: ['SQL', 'MySQL', 'Database Design'] },
  { name: 'MySQL', category: 'Database', aliases: ['mariadb'], relatedSkills: ['SQL', 'PostgreSQL'] },
  { name: 'MongoDB', category: 'Database', aliases: ['mongo', 'nosql'], relatedSkills: ['Node.js', 'PostgreSQL', 'Redis'] },
  { name: 'Redis', category: 'Database', aliases: ['redis cache', 'in-memory db'], relatedSkills: ['PostgreSQL', 'Caching', 'Message Queue'] },
  { name: 'SQL', category: 'Database', aliases: ['relational databases', 'rdbms'], relatedSkills: ['PostgreSQL', 'MySQL', 'Database Design'] },

  // Cloud & DevOps
  { name: 'Docker', category: 'DevOps', aliases: ['docker containers', 'containerization'], relatedSkills: ['Kubernetes', 'CI/CD', 'Linux'] },
  { name: 'Kubernetes', category: 'DevOps', aliases: ['k8s'], relatedSkills: ['Docker', 'Cloud Infrastructure', 'Helm'] },
  { name: 'AWS', category: 'Cloud', aliases: ['amazon web services', 'ec2', 's3', 'lambda', 'aws cloud'], relatedSkills: ['GCP', 'Azure', 'Cloud Architecture', 'Terraform'] },
  { name: 'GCP', category: 'Cloud', aliases: ['google cloud platform', 'google cloud', 'bigquery'], relatedSkills: ['AWS', 'Cloud Architecture'] },
  { name: 'Azure', category: 'Cloud', aliases: ['microsoft azure'], relatedSkills: ['AWS', 'C#'] },
  { name: 'CI/CD', category: 'DevOps', aliases: ['continuous integration', 'github actions', 'gitlab ci', 'jenkins'], relatedSkills: ['Docker', 'Git'] },
  { name: 'Git', category: 'DevOps', aliases: ['github', 'gitlab', 'version control'], relatedSkills: ['CI/CD'] },
  { name: 'Terraform', category: 'DevOps', aliases: ['infrastructure as code', 'iac'], relatedSkills: ['AWS', 'Kubernetes'] },

  // AI & ML
  { name: 'Machine Learning', category: 'AI & Data', aliases: ['ml', 'deep learning'], relatedSkills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science'] },
  { name: 'PyTorch', category: 'AI & Data', aliases: ['torch'], relatedSkills: ['Machine Learning', 'TensorFlow', 'Python'] },
  { name: 'TensorFlow', category: 'AI & Data', aliases: ['tf', 'keras'], relatedSkills: ['Machine Learning', 'PyTorch', 'Python'] },
  { name: 'LLM & Generative AI', category: 'AI & Data', aliases: ['llm', 'large language models', 'generative ai', 'genai', 'langchain', 'llamaindex', 'rag', 'vector search', 'openai', 'gemini'], relatedSkills: ['Python', 'Machine Learning', 'Vector Databases'] },
  { name: 'Data Analysis', category: 'AI & Data', aliases: ['pandas', 'numpy', 'data analytics', 'tableau', 'power bi'], relatedSkills: ['Python', 'SQL', 'Machine Learning'] },

  // Architecture & Engineering
  { name: 'Microservices', category: 'Architecture', aliases: ['microservice architecture', 'distributed systems'], relatedSkills: ['Docker', 'Kubernetes', 'REST API', 'Kafka'] },
  { name: 'System Design', category: 'Architecture', aliases: ['software architecture', 'scalable systems', 'high availability'], relatedSkills: ['Microservices', 'Distributed Systems'] },
  { name: 'Kafka', category: 'Architecture', aliases: ['apache kafka', 'message queue', 'event-driven'], relatedSkills: ['Distributed Systems', 'RabbitMQ'] },
  { name: 'Unit Testing & TDD', category: 'Engineering', aliases: ['jest', 'cypress', 'pytest', 'unit testing', 'tdd', 'integration testing'], relatedSkills: ['Software Quality'] }
];

/**
 * Extracts normalized skills from arbitrary text.
 */
export function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const matched = new Set<string>();

  for (const entry of SKILL_TAXONOMY) {
    // Check main name
    const mainRegex = new RegExp(`\\b${escapeRegExp(entry.name.toLowerCase())}\\b`, 'i');
    if (mainRegex.test(lower)) {
      matched.add(entry.name);
      continue;
    }

    // Check aliases
    for (const alias of entry.aliases) {
      const aliasRegex = new RegExp(`\\b${escapeRegExp(alias.toLowerCase())}\\b`, 'i');
      if (aliasRegex.test(lower)) {
        matched.add(entry.name);
        break;
      }
    }
  }

  return Array.from(matched);
}

/**
 * Parses years of experience from text using robust regex patterns.
 */
export function extractYearsOfExperience(text: string): number {
  const patterns = [
    /(\d+(?:\.\d+)?)\+?\s*(?:to\s*\d+\+?)?\s*(?:years?|yrs?)(?:\s+of)?(?:\s+experience)?/gi,
    /experience\s*:\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/gi,
    /(\d+(?:\.\d+)?)\s*yr(?:s)?/gi,
  ];

  let maxYears = 0;
  for (const pat of patterns) {
    let match;
    while ((match = pat.exec(text)) !== null) {
      const val = parseFloat(match[1]);
      if (!isNaN(val) && val < 40) {
        if (val > maxYears) maxYears = val;
      }
    }
  }

  // Also check for date ranges like "2019 - Present" or "2018 - 2024"
  const dateRangePattern = /(?:20\d{2}|19\d{2})\s*(?:-|–|to)\s*(?:present|current|now|20\d{2})/gi;
  const dateRanges = text.match(dateRangePattern);
  if (dateRanges && dateRanges.length > 0) {
    const currentYear = new Date().getFullYear();
    let calculatedYears = 0;
    for (const range of dateRanges) {
      const parts = range.split(/-|–|to/i).map(s => s.trim().toLowerCase());
      const startYear = parseInt(parts[0]);
      let endYear = currentYear;
      if (parts[1] && !parts[1].includes('present') && !parts[1].includes('current') && !parts[1].includes('now')) {
        const parsedEnd = parseInt(parts[1]);
        if (!isNaN(parsedEnd)) endYear = parsedEnd;
      }
      if (startYear > 1980 && endYear >= startYear) {
        calculatedYears += (endYear - startYear);
      }
    }
    if (calculatedYears > maxYears && calculatedYears < 35) {
      maxYears = calculatedYears;
    }
  }

  return Math.min(Math.round(maxYears * 10) / 10, 30);
}

/**
 * Extracts candidate name from resume header.
 */
export function extractCandidateName(text: string, fallbackFileName: string): string {
  const lines = text.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Common header noise to ignore
  const ignoredPatterns = [
    /resume/i,
    /curriculum\s+vitae/i,
    /cv/i,
    /profile/i,
    /contact/i,
    /page\s+\d+/i,
    /@/,
    /https?:\/\//i,
    /linkedin/i,
    /github/i,
    /phone/i,
    /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/
  ];

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    // Check if line is clean name (typically 2-4 words, letters and spaces only, 3-35 chars)
    if (line.length >= 3 && line.length <= 35 && /^[A-Z][a-zA-Z\s.'-]+$/.test(line)) {
      const isIgnored = ignoredPatterns.some(p => p.test(line));
      if (!isIgnored) {
        const wordCount = line.split(/\s+/).length;
        if (wordCount >= 2 && wordCount <= 4) {
          return line;
        }
      }
    }
  }

  // Fallback to file name cleaning (e.g., "Alex_Rivera_Resume.pdf" -> "Alex Rivera")
  const cleanBase = fallbackFileName
    .replace(/\.pdf$/i, '')
    .replace(/\.txt$/i, '')
    .replace(/[_-]/g, ' ')
    .replace(/resume|cv|profile|latest|v\d+/gi, '')
    .trim();

  if (cleanBase.length > 2) {
    return cleanBase
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  return 'Candidate ' + Math.floor(100 + Math.random() * 900);
}

/**
 * Extracts education entries from resume.
 */
export function extractEducation(text: string): { degree: string; institution: string; year?: string }[] {
  const degrees: { degree: string; institution: string; year?: string }[] = [];
  const degreeKeywords = [
    { regex: /(?:bachelor(?:'s)?|b\.?s\.?|b\.?tech|b\.?e\.?|undergraduate)\s*(?:in|of)?\s*([a-zA-Z\s&]+)/i, label: 'Bachelor\'s Degree' },
    { regex: /(?:master(?:'s)?|m\.?s\.?|m\.?tech|m\.?e\.?|graduate)\s*(?:in|of)?\s*([a-zA-Z\s&]+)/i, label: 'Master\'s Degree' },
    { regex: /(?:ph\.?d\.?|doctorate)\s*(?:in|of)?\s*([a-zA-Z\s&]+)/i, label: 'Ph.D.' },
    { regex: /(?:associate(?:'s)?)\s*(?:in|of)?\s*([a-zA-Z\s&]+)/i, label: 'Associate Degree' },
    { regex: /(?:bootcamp|nanodegree|diploma)\s*(?:in)?\s*([a-zA-Z\s&]+)/i, label: 'Professional Diploma / Bootcamp' },
  ];

  for (const dk of degreeKeywords) {
    const match = text.match(dk.regex);
    if (match) {
      const field = match[1] ? match[1].slice(0, 30).trim() : 'Computer Science';
      degrees.push({
        degree: `${dk.label} in ${field}`,
        institution: extractInstitution(text) || 'Accredited University',
      });
      break;
    }
  }

  if (degrees.length === 0 && /university|college|institute|polytechnic/i.test(text)) {
    degrees.push({
      degree: 'B.S. in Computer Science or Related Field',
      institution: extractInstitution(text) || 'University',
    });
  }

  return degrees;
}

function extractInstitution(text: string): string | null {
  const instMatch = text.match(/(?:at|from|,)?\s*([A-Z][a-zA-Z\s]+(?:University|Institute of Technology|College|Academy))/);
  if (instMatch && instMatch[1]) {
    return instMatch[1].trim();
  }
  return null;
}

/**
 * Extracts projects and achievements from resume.
 */
export function extractProjects(text: string): { title: string; techStack: string[]; description: string }[] {
  const projects: { title: string; techStack: string[]; description: string }[] = [];
  
  // Look for "Projects" or "Key Projects" section
  const projectSectionMatch = text.match(/(?:projects|key projects|selected projects|personal projects)([\s\S]*?)(?:experience|work history|education|skills|certifications|$)/i);
  const targetText = projectSectionMatch ? projectSectionMatch[1] : text;

  const lines = targetText.split('\n').map(l => l.trim()).filter(Boolean);
  let currentProject: { title: string; techStack: string[]; description: string } | null = null;

  for (const line of lines) {
    // Project title candidate
    if ((line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) && line.length > 20) {
      if (currentProject) {
        currentProject.description += ' ' + line.replace(/^[•\-*]\s*/, '');
      }
    } else if (line.length > 5 && line.length < 60 && !line.includes('@') && !line.includes('http')) {
      if (currentProject && currentProject.description.length > 15) {
        projects.push(currentProject);
      }
      const extractedTech = extractSkillsFromText(line);
      currentProject = {
        title: line.replace(/^[•\-*]\s*/, ''),
        techStack: extractedTech,
        description: ''
      };
    } else if (currentProject) {
      currentProject.description += ' ' + line;
      const foundSkills = extractSkillsFromText(line);
      for (const s of foundSkills) {
        if (!currentProject.techStack.includes(s)) currentProject.techStack.push(s);
      }
    }
  }

  if (currentProject && currentProject.description.length > 15) {
    projects.push(currentProject);
  }

  // If no structured projects detected, find bullet points referencing built/designed/implemented
  if (projects.length === 0) {
    const actionBullets = text.match(/(?:built|architected|developed|created|deployed|implemented)\s+([^.\n]+)/gi);
    if (actionBullets) {
      actionBullets.slice(0, 3).forEach((item, idx) => {
        projects.push({
          title: `Project Highlight #${idx + 1}`,
          techStack: extractSkillsFromText(item),
          description: item.trim()
        });
      });
    }
  }

  return projects.slice(0, 5);
}

/**
 * Extracts work experience roles & history.
 */
export function extractExperienceHistory(text: string): { role: string; company: string; duration?: string; description: string }[] {
  const history: { role: string; company: string; duration?: string; description: string }[] = [];
  const commonRoles = [
    'Senior Software Engineer', 'Software Engineer', 'Full Stack Developer',
    'Frontend Engineer', 'Backend Engineer', 'DevOps Engineer', 'AI Engineer',
    'Machine Learning Engineer', 'Tech Lead', 'Data Engineer', 'Software Developer'
  ];

  for (const role of commonRoles) {
    const roleRegex = new RegExp(`(${escapeRegExp(role)})\\s*(?:at|-|\\|)?\\s*([A-Za-z0-9\\s&]+)?`, 'i');
    const match = text.match(roleRegex);
    if (match) {
      history.push({
        role: match[1],
        company: (match[2] || 'Tech Enterprise').slice(0, 30).trim(),
        description: `Experienced with core system delivery, team collaboration, and feature engineering.`
      });
      if (history.length >= 3) break;
    }
  }

  return history;
}

/**
 * Extracts certifications.
 */
export function extractCertifications(text: string): string[] {
  const certs: string[] = [];
  const certKeywords = [
    'AWS Certified Solutions Architect', 'AWS Certified Developer', 'AWS Certified Cloud Practitioner',
    'Google Cloud Certified Professional', 'Microsoft Azure Fundamentals', 'CKA (Certified Kubernetes Administrator)',
    'TensorFlow Developer Certificate', 'Certified Scrum Master', 'PMP'
  ];

  for (const c of certKeywords) {
    if (new RegExp(escapeRegExp(c), 'i').test(text)) {
      certs.push(c);
    }
  }

  // Also catch generic "Certified X"
  const genericCertMatch = text.match(/certified\s+([A-Za-z\s]+)(?:certification|credential)?/gi);
  if (genericCertMatch) {
    for (const g of genericCertMatch.slice(0, 3)) {
      const clean = g.trim();
      if (!certs.includes(clean) && clean.length < 40) {
        certs.push(clean);
      }
    }
  }

  return certs;
}

/**
 * Full parsing of a Candidate Resume from raw text.
 */
export function parseResumeLocal(rawText: string, fileName: string): CandidateResume {
  const skills = extractSkillsFromText(rawText);
  const experienceYears = extractYearsOfExperience(rawText);
  const name = extractCandidateName(rawText, fileName);
  const education = extractEducation(rawText);
  const projects = extractProjects(rawText);
  const experienceHistory = extractExperienceHistory(rawText);
  const certifications = extractCertifications(rawText);

  return {
    id: 'cand_' + Math.random().toString(36).substring(2, 9),
    fileName,
    rawText,
    name,
    skills,
    experienceYears,
    experienceHistory,
    education,
    projects,
    certifications,
    extracted: true,
    status: 'ready'
  };
}

/**
 * Parses and extracts structured requirements from a Job Description text.
 */
export function parseJobDescriptionLocal(rawText: string, titleFallback = 'Senior Software Engineer'): JobDescription {
  const allSkills = extractSkillsFromText(rawText);

  // Divide into required vs preferred based on headings or context
  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];

  const requiredSectionMatch = rawText.match(/(?:required|must have|requirements|qualifications|core skills)([\s\S]*?)(?:preferred|nice to have|bonus|plus|responsibilities|$)/i);
  const preferredSectionMatch = rawText.match(/(?:preferred|nice to have|bonus|plus|good to have)([\s\S]*?)(?:requirements|responsibilities|$)/i);

  if (requiredSectionMatch) {
    const reqText = requiredSectionMatch[1];
    const reqSkills = extractSkillsFromText(reqText);
    requiredSkills.push(...reqSkills);
  }

  if (preferredSectionMatch) {
    const prefText = preferredSectionMatch[1];
    const prefSkills = extractSkillsFromText(prefText);
    preferredSkills.push(...prefSkills);
  }

  // If no explicit division detected, partition intelligently
  if (requiredSkills.length === 0 && preferredSkills.length === 0) {
    // 70% first skills as required, remainder as preferred
    const splitPoint = Math.max(3, Math.ceil(allSkills.length * 0.65));
    requiredSkills.push(...allSkills.slice(0, splitPoint));
    preferredSkills.push(...allSkills.slice(splitPoint));
  } else if (requiredSkills.length === 0) {
    requiredSkills.push(...allSkills.filter(s => !preferredSkills.includes(s)));
  }

  // Fallback defaults if very few skills in JD
  if (requiredSkills.length === 0) {
    requiredSkills.push('JavaScript', 'React', 'Node.js');
  }

  const expYears = extractYearsOfExperience(rawText) || 4;
  let seniority: 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive' = 'Mid';
  if (/senior|lead|principal|architect|staff/i.test(rawText)) seniority = 'Senior';
  else if (/junior|entry|associate|graduate/i.test(rawText)) seniority = 'Junior';
  else if (/lead|head|manager/i.test(rawText)) seniority = 'Lead';

  // Extract education requirements
  const requiredEducation: string[] = [];
  if (/bachelor|degree|b\.?s|b\.?tech/i.test(rawText)) {
    requiredEducation.push('Bachelor\'s degree in Computer Science, Software Engineering, or related technical field');
  }
  if (/master|m\.?s/i.test(rawText)) {
    requiredEducation.push('Master\'s degree preferred');
  }

  // Title extraction
  const firstLine = rawText.split('\n')[0]?.trim();
  const title = (firstLine && firstLine.length < 60 && !firstLine.includes('http'))
    ? firstLine.replace(/job description:?/i, '').trim()
    : titleFallback;

  return {
    id: 'jd_' + Math.random().toString(36).substring(2, 9),
    title: title || 'Software Engineer',
    rawText,
    requiredSkills: Array.from(new Set(requiredSkills)),
    preferredSkills: Array.from(new Set(preferredSkills)),
    requiredExperienceYears: expYears,
    seniorityLevel: seniority,
    requiredEducation: requiredEducation.length > 0 ? requiredEducation : ['Bachelor\'s degree in CS or equivalent practical experience'],
    responsibilities: [
      'Design, build, and deploy reliable software services and APIs',
      'Collaborate with cross-functional teams to deliver scalable features',
      'Conduct code reviews and champion engineering best practices'
    ],
    extracted: true
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
