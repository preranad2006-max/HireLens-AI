import type { JobDescription, CandidateResume, MatchAnalysis } from '../types/hirelens';
import { evaluateCandidate } from './matcherEngine';

export interface GeminiConfig {
  apiKey?: string;
  model?: string;
}

/**
 * Evaluates candidate using Gemini AI if key is available,
 * otherwise gracefully falls back to local high-precision matching engine.
 */
export async function evaluateCandidateWithFallback(
  candidate: CandidateResume,
  jd: JobDescription,
  config?: GeminiConfig
): Promise<{ analysis: MatchAnalysis; usedAI: boolean; error?: string }> {
  const apiKey = config?.apiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    // Local deterministic engine
    const analysis = evaluateCandidate(candidate, jd);
    return { analysis, usedAI: false };
  }

  try {
    const model = config?.model || 'gemini-2.5-flash';
    const prompt = `You are HireLens AI, an objective, rigorous, and unbiased technical talent scoring engine.
Compare the Candidate Resume against the Job Description.

SCORING RULES (Strict 0-100 total):
1. Required skills: 40% (max 40 pts)
2. Experience: 25% (max 25 pts)
3. Projects & achievements: 15% (max 15 pts)
4. Preferred skills: 10% (max 10 pts)
5. Education & certifications: 10% (max 10 pts)

IMPORTANT FAIRNESS & COMPLIANCE:
- NEVER use sensitive attributes (gender, religion, caste, race, nationality, disability, age, photograph) for scoring.
- DO NOT invent or hallucinate information that is not in the resume.
- Distinguish between Exact skill matches and Related skill matches (e.g. Postgres is related to SQL/databases).

JOB DESCRIPTION:
Title: ${jd.title}
Required Experience: ${jd.requiredExperienceYears} years (${jd.seniorityLevel})
Required Skills: ${jd.requiredSkills.join(', ')}
Preferred Skills: ${jd.preferredSkills.join(', ')}
Required Education: ${jd.requiredEducation.join('; ')}
Description: ${jd.rawText}

CANDIDATE RESUME:
Name: ${candidate.name}
Experience: ${candidate.experienceYears} years
Skills: ${candidate.skills.join(', ')}
Projects: ${JSON.stringify(candidate.projects)}
Education: ${JSON.stringify(candidate.education)}
Certifications: ${candidate.certifications.join(', ')}
Resume Text: ${candidate.rawText}

Respond ONLY with a valid JSON object matching this structure:
{
  "scores": {
    "requiredSkillsScore": number,
    "experienceScore": number,
    "projectsScore": number,
    "preferredSkillsScore": number,
    "educationScore": number,
    "totalScore": number
  },
  "matchTier": "Top Match" | "Strong Match" | "Good Match" | "Fair Match" | "Low Match",
  "explanation": {
    "summary": "string explaining overall score",
    "requiredSkillsExplanation": "string",
    "experienceExplanation": "string",
    "projectsExplanation": "string",
    "preferredSkillsExplanation": "string",
    "educationExplanation": "string"
  },
  "exactMatches": ["string"],
  "relatedMatches": [{"required": "string", "candidateHas": "string", "relevance": "string"}],
  "missingRequiredSkills": ["string"],
  "missingPreferredSkills": ["string"],
  "matchedPreferredSkills": ["string"],
  "experienceMatch": {
    "requiredYears": number,
    "candidateYears": number,
    "status": "exceeds" | "meets" | "below",
    "details": "string"
  },
  "projectRelevance": {
    "rating": "High" | "Moderate" | "Low",
    "highlightedProjects": ["string"],
    "details": "string"
  },
  "educationMatch": {
    "matched": boolean,
    "details": "string"
  }
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(rawContent);

    // Merge and validate
    const analysis: MatchAnalysis = {
      candidateId: candidate.id,
      candidateName: candidate.name,
      rank: 1,
      scores: {
        requiredSkillsScore: Number(parsed.scores?.requiredSkillsScore ?? 0),
        experienceScore: Number(parsed.scores?.experienceScore ?? 0),
        projectsScore: Number(parsed.scores?.projectsScore ?? 0),
        preferredSkillsScore: Number(parsed.scores?.preferredSkillsScore ?? 0),
        educationScore: Number(parsed.scores?.educationScore ?? 0),
        totalScore: Number(parsed.scores?.totalScore ?? 0),
      },
      matchTier: parsed.matchTier || 'Good Match',
      explanation: parsed.explanation || {
        summary: `${candidate.name} scored ${parsed.scores?.totalScore}/100.`,
        requiredSkillsExplanation: '',
        experienceExplanation: '',
        projectsExplanation: '',
        preferredSkillsExplanation: '',
        educationExplanation: ''
      },
      exactMatches: parsed.exactMatches || [],
      relatedMatches: parsed.relatedMatches || [],
      missingRequiredSkills: parsed.missingRequiredSkills || [],
      missingPreferredSkills: parsed.missingPreferredSkills || [],
      matchedPreferredSkills: parsed.matchedPreferredSkills || [],
      experienceMatch: parsed.experienceMatch || {
        requiredYears: jd.requiredExperienceYears,
        candidateYears: candidate.experienceYears,
        status: candidate.experienceYears >= jd.requiredExperienceYears ? 'meets' : 'below',
        details: `${candidate.experienceYears} yrs experience`
      },
      projectRelevance: parsed.projectRelevance || {
        rating: 'Moderate',
        highlightedProjects: [],
        details: 'Evaluated project portfolio'
      },
      educationMatch: parsed.educationMatch || {
        matched: true,
        details: 'Educational background reviewed'
      }
    };

    return { analysis, usedAI: true };
  } catch (err: any) {
    console.warn('Gemini AI call failed, falling back to local matching engine:', err.message);
    const analysis = evaluateCandidate(candidate, jd);
    return { analysis, usedAI: false, error: err.message };
  }
}
