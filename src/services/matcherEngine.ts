import type { JobDescription, CandidateResume, MatchAnalysis, ScoreBreakdown } from '../types/hirelens';
import { SKILL_TAXONOMY } from './localExtractor';

/**
 * Checks if a candidate skill is related to a required skill via the skill taxonomy.
 */
function findRelatedSkill(requiredSkill: string, candidateSkills: string[]): { candidateHas: string; relevance: string } | null {
  const reqLower = requiredSkill.toLowerCase();
  const taxEntry = SKILL_TAXONOMY.find(
    t => t.name.toLowerCase() === reqLower || t.aliases.some(a => a.toLowerCase() === reqLower)
  );

  if (!taxEntry) return null;

  for (const candSkill of candidateSkills) {
    const candLower = candSkill.toLowerCase();
    
    // Check if directly related
    const isDirectlyRelated = taxEntry.relatedSkills.some(
      r => r.toLowerCase() === candLower
    );
    if (isDirectlyRelated) {
      return {
        candidateHas: candSkill,
        relevance: `Directly related within ${taxEntry.category} ecosystem`
      };
    }

    // Check if candidate skill taxonomy lists required skill
    const candTax = SKILL_TAXONOMY.find(
      t => t.name.toLowerCase() === candLower || t.aliases.some(a => a.toLowerCase() === candLower)
    );
    if (candTax && candTax.relatedSkills.some(r => r.toLowerCase() === reqLower)) {
      return {
        candidateHas: candSkill,
        relevance: `Complementary skill within ${candTax.category}`
      };
    }

    // Same category match (e.g. both are 'Database' or both 'Cloud')
    if (candTax && candTax.category === taxEntry.category && candTax.category !== 'Languages') {
      return {
        candidateHas: candSkill,
        relevance: `Alternative ${taxEntry.category} technology`
      };
    }
  }

  return null;
}

/**
 * Evaluates a candidate resume against a job description.
 * Adheres strictly to:
 * - 40% Required skills
 * - 25% Experience
 * - 15% Projects & achievements
 * - 10% Preferred skills
 * - 10% Education & certifications
 * - Fair, non-sensitive scoring
 * - Evidence-grounded explainability
 */
export function evaluateCandidate(candidate: CandidateResume, jd: JobDescription): MatchAnalysis {
  const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase());

  // 1. Evaluate Required Skills (40% weight)
  const exactMatches: string[] = [];
  const relatedMatches: { required: string; candidateHas: string; relevance: string }[] = [];
  const missingRequiredSkills: string[] = [];

  let requiredWeightedScore = 0;
  const totalReq = jd.requiredSkills.length || 1;

  for (const reqSkill of jd.requiredSkills) {
    const reqLower = reqSkill.toLowerCase();
    // Check exact match (or alias)
    const isExact = candidateSkillsLower.includes(reqLower) ||
      candidate.skills.some(cs => {
        const tax = SKILL_TAXONOMY.find(t => t.name.toLowerCase() === reqLower);
        return tax ? tax.aliases.some(a => a.toLowerCase() === cs.toLowerCase()) : false;
      });

    if (isExact) {
      exactMatches.push(reqSkill);
      requiredWeightedScore += 1.0;
    } else {
      // Check related match
      const related = findRelatedSkill(reqSkill, candidate.skills);
      if (related) {
        relatedMatches.push({
          required: reqSkill,
          candidateHas: related.candidateHas,
          relevance: related.relevance
        });
        requiredWeightedScore += 0.65; // 65% credit for strong related skill
      } else {
        missingRequiredSkills.push(reqSkill);
      }
    }
  }

  const requiredSkillsScore = Math.min(40, Math.round((requiredWeightedScore / totalReq) * 40 * 10) / 10);

  // 2. Evaluate Preferred Skills (10% weight)
  const matchedPreferredSkills: string[] = [];
  const missingPreferredSkills: string[] = [];
  let preferredWeightedScore = 0;
  const totalPref = jd.preferredSkills.length;

  if (totalPref > 0) {
    for (const prefSkill of jd.preferredSkills) {
      const prefLower = prefSkill.toLowerCase();
      if (candidateSkillsLower.includes(prefLower)) {
        matchedPreferredSkills.push(prefSkill);
        preferredWeightedScore += 1.0;
      } else {
        const related = findRelatedSkill(prefSkill, candidate.skills);
        if (related) {
          matchedPreferredSkills.push(`${prefSkill} (via ${related.candidateHas})`);
          preferredWeightedScore += 0.6;
        } else {
          missingPreferredSkills.push(prefSkill);
        }
      }
    }
  }

  const preferredSkillsScore = totalPref > 0
    ? Math.min(10, Math.round((preferredWeightedScore / totalPref) * 10 * 10) / 10)
    : 10; // If no preferred skills specified, award full weight

  // 3. Evaluate Experience (25% weight)
  const requiredExp = jd.requiredExperienceYears || 1;
  const candExp = candidate.experienceYears || 0;
  let experienceScore = 0;
  let expStatus: 'exceeds' | 'meets' | 'below' = 'meets';
  let expDetails = '';

  if (candExp >= requiredExp) {
    const surplus = candExp - requiredExp;
    if (surplus >= 1) {
      expStatus = 'exceeds';
      experienceScore = 25;
      expDetails = `${candExp} years of verified experience exceeds the required ${requiredExp} years benchmark.`;
    } else {
      expStatus = 'meets';
      experienceScore = 24.5;
      expDetails = `${candExp} years of verified experience meets the ${requiredExp} years requirement.`;
    }
  } else {
    expStatus = 'below';
    const ratio = Math.max(0.1, candExp / requiredExp);
    experienceScore = Math.round(ratio * 25 * 10) / 10;
    const deficit = Math.round((requiredExp - candExp) * 10) / 10;
    expDetails = `${candExp} years of experience is ${deficit} year(s) below the target ${requiredExp} years for this ${jd.seniorityLevel} level role.`;
  }

  // 4. Evaluate Projects & Achievements (15% weight)
  let projectsScore = 0;
  let projectRating: 'High' | 'Moderate' | 'Low' = 'Moderate';
  const highlightedProjects: string[] = [];
  let projectDetails = '';

  const allJdSkills = [...jd.requiredSkills, ...jd.preferredSkills].map(s => s.toLowerCase());

  let totalProjectSkillHits = 0;
  for (const proj of candidate.projects) {
    const projTech = (proj.techStack || []).map(t => t.toLowerCase());
    const projDesc = proj.description.toLowerCase();
    
    // Count tech overlaps
    const overlaps = allJdSkills.filter(js => projTech.includes(js) || projDesc.includes(js));
    if (overlaps.length > 0) {
      totalProjectSkillHits += overlaps.length;
      highlightedProjects.push(`${proj.title} (demonstrates ${overlaps.slice(0, 3).join(', ')})`);
    }
  }

  if (candidate.projects.length >= 2 && totalProjectSkillHits >= 4) {
    projectsScore = 14.5;
    projectRating = 'High';
    projectDetails = `Strong evidence of domain delivery across ${candidate.projects.length} projects incorporating key requirements (${highlightedProjects.length} matching initiatives).`;
  } else if (candidate.projects.length >= 1 && totalProjectSkillHits >= 1) {
    projectsScore = 11;
    projectRating = 'Moderate';
    projectDetails = `Relevant project portfolio showcasing practical application of core tools with ${highlightedProjects.length} directly applicable projects.`;
  } else if (candidate.projects.length > 0) {
    projectsScore = 7.5;
    projectRating = 'Moderate';
    projectDetails = `Projects documented in profile, though with limited direct overlap with the targeted technical specifications.`;
  } else {
    projectsScore = 4;
    projectRating = 'Low';
    projectDetails = `Limited concrete project or architectural achievement details extracted from resume text.`;
  }

  // 5. Evaluate Education & Certifications (10% weight)
  let educationScore = 0;
  let eduMatched = false;
  let eduDetails = '';

  const hasDegree = candidate.education.some(e =>
    /bachelor|master|ph\.?d|b\.?s|m\.?s|b\.?tech|computer science|engineering/i.test(e.degree)
  );
  const certCount = candidate.certifications.length;

  if (hasDegree) {
    eduMatched = true;
    educationScore += 7.5;
    const highestDegree = candidate.education[0]?.degree || 'BS in Technical Field';
    eduDetails = `Holds ${highestDegree}, fulfilling academic baseline.`;
  } else if (candidate.education.length > 0) {
    educationScore += 5;
    eduDetails = `Has professional educational background (${candidate.education[0]?.degree || 'Higher Education'}).`;
  } else {
    educationScore += 3.5;
    eduDetails = `Non-traditional / practical experience pathway without formal academic degree listed.`;
  }

  if (certCount > 0) {
    const certBonus = Math.min(2.5, certCount * 1.5);
    educationScore = Math.min(10, educationScore + certBonus);
    eduDetails += ` Validated with ${certCount} industry certification(s): ${candidate.certifications.join(', ')}.`;
  }

  // Calculate Total Score (0 - 100)
  const totalScore = Math.min(100, Math.round(
    requiredSkillsScore + experienceScore + projectsScore + preferredSkillsScore + educationScore
  ));

  // Determine Match Tier
  let matchTier: 'Top Match' | 'Strong Match' | 'Good Match' | 'Fair Match' | 'Low Match' = 'Fair Match';
  if (totalScore >= 85) matchTier = 'Top Match';
  else if (totalScore >= 72) matchTier = 'Strong Match';
  else if (totalScore >= 58) matchTier = 'Good Match';
  else if (totalScore >= 42) matchTier = 'Fair Match';
  else matchTier = 'Low Match';

  // Construct Explainable Narrative
  const summary = `${candidate.name} scored ${totalScore}/100 (${matchTier}). ` +
    `Shows ${exactMatches.length}/${jd.requiredSkills.length} exact required skills` +
    (relatedMatches.length > 0 ? ` and ${relatedMatches.length} complementary skill(s)` : '') +
    `, with ${candExp} years experience vs ${requiredExp} required. ` +
    (missingRequiredSkills.length > 0 ? `Primary gap: missing ${missingRequiredSkills.slice(0, 3).join(', ')}.` : 'Comprehensive coverage of core technical stack.');

  const scores: ScoreBreakdown = {
    requiredSkillsScore,
    experienceScore,
    projectsScore,
    preferredSkillsScore,
    educationScore,
    totalScore
  };

  return {
    candidateId: candidate.id,
    candidateName: candidate.name,
    rank: 1, // will be sorted later
    scores,
    matchTier,
    explanation: {
      summary,
      requiredSkillsExplanation: `${requiredSkillsScore}/40 pts - Matched ${exactMatches.length} exact required skills (${exactMatches.join(', ') || 'none'}). ` +
        (relatedMatches.length > 0 ? `Credited ${relatedMatches.length} related capabilities (${relatedMatches.map(r => `${r.candidateHas} for ${r.required}`).join(', ')}). ` : '') +
        (missingRequiredSkills.length > 0 ? `Missing: ${missingRequiredSkills.join(', ')}.` : 'No critical skill gaps.'),
      experienceExplanation: `${experienceScore}/25 pts - ${expDetails}`,
      projectsExplanation: `${projectsScore}/15 pts - ${projectDetails}`,
      preferredSkillsExplanation: `${preferredSkillsScore}/10 pts - Matched ${matchedPreferredSkills.length}/${jd.preferredSkills.length || 1} preferred skills` +
        (matchedPreferredSkills.length > 0 ? ` (${matchedPreferredSkills.join(', ')})` : '') +
        (missingPreferredSkills.length > 0 ? `. Missing: ${missingPreferredSkills.join(', ')}` : '.'),
      educationExplanation: `${educationScore}/10 pts - ${eduDetails}`
    },
    exactMatches,
    relatedMatches,
    missingRequiredSkills,
    missingPreferredSkills,
    matchedPreferredSkills,
    experienceMatch: {
      requiredYears: requiredExp,
      candidateYears: candExp,
      status: expStatus,
      details: expDetails
    },
    projectRelevance: {
      rating: projectRating,
      highlightedProjects,
      details: projectDetails
    },
    educationMatch: {
      matched: eduMatched,
      details: eduDetails
    }
  };
}

/**
 * Ranks all candidates evaluated against a job description from highest to lowest score.
 */
export function rankCandidates(candidates: CandidateResume[], jd: JobDescription): MatchAnalysis[] {
  const analyses = candidates.map(c => evaluateCandidate(c, jd));
  // Sort descending by total score, then by requiredSkillsScore
  analyses.sort((a, b) => {
    if (b.scores.totalScore !== a.scores.totalScore) {
      return b.scores.totalScore - a.scores.totalScore;
    }
    return b.scores.requiredSkillsScore - a.scores.requiredSkillsScore;
  });

  // Assign 1-indexed ranks
  analyses.forEach((analysis, idx) => {
    analysis.rank = idx + 1;
  });

  return analyses;
}

/**
 * Derive per-category [0-1] performance ratios from an existing MatchAnalysis.
 * These ratios are weight-agnostic — they capture how well a candidate performed
 * relative to each category's max cap, regardless of the original weight.
 */
export function extractBaseRatios(analysis: MatchAnalysis) {
  return {
    requiredSkills: Math.min(1, analysis.scores.requiredSkillsScore / 40),
    experience:     Math.min(1, analysis.scores.experienceScore     / 25),
    projects:       Math.min(1, analysis.scores.projectsScore       / 15),
    preferredSkills:Math.min(1, analysis.scores.preferredSkillsScore/ 10),
    education:      Math.min(1, analysis.scores.educationScore      / 10),
  };
}

/**
 * Given the existing ranked analyses and new user-defined weights (must sum to 100),
 * instantly re-score each candidate and return WhatIfResult[] sorted by new score.
 */
export function computeWhatIfRankings(
  originalRankings: MatchAnalysis[],
  weights: { requiredSkills: number; experience: number; projects: number; preferredSkills: number; education: number }
): import('../types/hirelens').WhatIfResult[] {
  // Score each candidate with the new weights
  const scored = originalRankings.map(analysis => {
    const ratios = extractBaseRatios(analysis);
    const newScore = Math.min(100, Math.round(
      ratios.requiredSkills  * weights.requiredSkills  +
      ratios.experience      * weights.experience      +
      ratios.projects        * weights.projects        +
      ratios.preferredSkills * weights.preferredSkills +
      ratios.education       * weights.education
    ));
    return { analysis, ratios, newScore };
  });

  // Sort descending by new score
  scored.sort((a, b) => b.newScore - a.newScore);

  return scored.map(({ analysis, ratios, newScore }, idx) => {
    const newRank = idx + 1;
    const originalRank = analysis.rank;
    const rankDelta = originalRank - newRank; // positive = moved up

    // Build a concise human-readable reason
    let changeReason = '';
    if (rankDelta === 0) {
      changeReason = 'No rank change with current weight settings.';
    } else {
      // Find the two highest-weight categories to explain why
      const entries = [
        { label: 'Required Skills', w: weights.requiredSkills, r: ratios.requiredSkills },
        { label: 'Experience',      w: weights.experience,      r: ratios.experience },
        { label: 'Projects',        w: weights.projects,        r: ratios.projects },
        { label: 'Preferred Skills',w: weights.preferredSkills, r: ratios.preferredSkills },
        { label: 'Education',       w: weights.education,       r: ratios.education },
      ].sort((a, b) => b.w - a.w);

      const strongest = entries.filter(e => e.r >= 0.8).map(e => e.label);
      const weakest   = entries.filter(e => e.r <= 0.4).map(e => e.label);

      if (rankDelta > 0) {
        changeReason = `Moved up ${rankDelta} position${rankDelta > 1 ? 's' : ''}.` +
          (strongest.length ? ` Strong in ${strongest.slice(0,2).join(' & ')} (now weighted higher).` : '');
      } else {
        changeReason = `Dropped ${Math.abs(rankDelta)} position${Math.abs(rankDelta) > 1 ? 's' : ''}.` +
          (weakest.length ? ` Gap in ${weakest.slice(0,2).join(' & ')} now penalised more.` : '');
      }
    }

    return {
      candidateId:   analysis.candidateId,
      candidateName: analysis.candidateName,
      baseRatios:    ratios,
      newScore,
      newRank,
      originalRank,
      rankDelta,
      changeReason,
    };
  });
}
