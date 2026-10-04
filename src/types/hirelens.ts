export interface JobDescription {
  id: string;
  title: string;
  rawText: string;
  requiredSkills: string[];
  preferredSkills: string[];
  requiredExperienceYears: number;
  seniorityLevel: 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  requiredEducation: string[];
  responsibilities: string[];
  extracted?: boolean;
}

export interface CandidateResume {
  id: string;
  fileName: string;
  fileSize?: string;
  rawText: string;
  name: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experienceYears: number;
  experienceHistory: {
    role: string;
    company: string;
    duration?: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year?: string;
  }[];
  projects: {
    title: string;
    techStack: string[];
    description: string;
  }[];
  certifications: string[];
  extracted: boolean;
  status: 'pending' | 'parsing' | 'ready' | 'error';
  errorMessage?: string;
}

export interface SkillMatch {
  skill: string;
  type: 'exact' | 'related' | 'missing';
  matchedWith?: string; // what candidate skill matched this
  reason?: string;
}

export interface ScoreBreakdown {
  requiredSkillsScore: number;    // 0 - 40
  experienceScore: number;        // 0 - 25
  projectsScore: number;          // 0 - 15
  preferredSkillsScore: number;   // 0 - 10
  educationScore: number;         // 0 - 10
  totalScore: number;             // 0 - 100
}

export interface MatchAnalysis {
  candidateId: string;
  candidateName: string;
  rank: number;
  scores: ScoreBreakdown;
  matchTier: 'Top Match' | 'Strong Match' | 'Good Match' | 'Fair Match' | 'Low Match';
  explanation: {
    summary: string;
    requiredSkillsExplanation: string;
    experienceExplanation: string;
    projectsExplanation: string;
    preferredSkillsExplanation: string;
    educationExplanation: string;
  };
  exactMatches: string[];
  relatedMatches: { required: string; candidateHas: string; relevance: string }[];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  matchedPreferredSkills: string[];
  experienceMatch: {
    requiredYears: number;
    candidateYears: number;
    status: 'exceeds' | 'meets' | 'below';
    details: string;
  };
  projectRelevance: {
    rating: 'High' | 'Moderate' | 'Low';
    highlightedProjects: string[];
    details: string;
  };
  educationMatch: {
    matched: boolean;
    details: string;
  };
}

/** User-adjustable scoring weight allocation. All 5 values must sum to 100. */
export interface ScoringWeights {
  requiredSkills: number;   // default 40
  experience: number;       // default 25
  projects: number;         // default 15
  preferredSkills: number;  // default 10
  education: number;        // default 10
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  requiredSkills: 40,
  experience: 25,
  projects: 15,
  preferredSkills: 10,
  education: 10,
};

/** Per-candidate what-if result showing new score, rank, and rank delta */
export interface WhatIfResult {
  candidateId: string;
  candidateName: string;
  /** Normalised [0–1] ratios computed from the base engine, then scaled by custom weights */
  baseRatios: {
    requiredSkills: number;
    experience: number;
    projects: number;
    preferredSkills: number;
    education: number;
  };
  newScore: number;
  newRank: number;
  originalRank: number;
  rankDelta: number;       // positive = improved, negative = fell
  changeReason: string;
}
