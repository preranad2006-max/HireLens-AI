import { Award, CheckCircle2, AlertTriangle, ArrowRight, Layers, Sparkles, Link2 } from 'lucide-react';
import type { MatchAnalysis, CandidateResume } from '../types/hirelens';
import { ScoreDial } from './ScoreDial';

interface CandidateCardProps {
  analysis: MatchAnalysis;
  candidate?: CandidateResume;
  onOpenDetails: (candidateId: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  analysis,
  candidate,
  onOpenDetails,
}) => {
  const { rank, scores, matchTier, explanation, exactMatches, relatedMatches, missingRequiredSkills, experienceMatch, projectRelevance } = analysis;

  // Rank styling
  let rankClass = 'rank-default';
  if (rank === 1) rankClass = 'rank-gold';
  else if (rank === 2) rankClass = 'rank-silver';
  else if (rank === 3) rankClass = 'rank-bronze';

  // Tier badge styling
  let tierClass = 'tier-neutral';
  if (matchTier === 'Top Match') tierClass = 'tier-emerald';
  else if (matchTier === 'Strong Match') tierClass = 'tier-cyan';
  else if (matchTier === 'Good Match') tierClass = 'tier-blue';
  else if (matchTier === 'Fair Match') tierClass = 'tier-amber';
  else tierClass = 'tier-rose';

  return (
    <div className={`candidate-card ${rank === 1 ? 'featured-card' : ''}`}>
      {/* Top Banner / Rank & Tier */}
      <div className="card-top-bar">
        <div className="rank-and-name">
          <div className={`rank-badge ${rankClass}`}>
            <Award size={14} />
            <span>#{rank}</span>
          </div>
          <div>
            <h3 className="candidate-name">{analysis.candidateName}</h3>
            <div className="candidate-meta-row">
              <span className={`tier-badge ${tierClass}`}>{matchTier}</span>
              <span className="meta-separator">•</span>
              <span className="meta-text">{experienceMatch.candidateYears} Yrs Exp</span>
              {candidate?.fileName && (
                <>
                  <span className="meta-separator">•</span>
                  <span className="meta-text text-muted truncate">{candidate.fileName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Score Dial */}
        <div className="card-dial-wrap">
          <ScoreDial score={scores.totalScore} size={70} strokeWidth={6} />
        </div>
      </div>

      {/* Narrative Explainability Snippet */}
      <div className="card-narrative">
        <p className="narrative-text">{explanation.summary}</p>
      </div>

      {/* Weighted Score Breakdown Bars */}
      <div className="score-bars-container">
        <div className="score-bar-item">
          <div className="score-bar-header">
            <span className="score-label">Required (40%)</span>
            <span className="score-val">{scores.requiredSkillsScore}/40</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill fill-emerald"
              style={{ width: `${(scores.requiredSkillsScore / 40) * 100}%` }}
            />
          </div>
        </div>

        <div className="score-bar-item">
          <div className="score-bar-header">
            <span className="score-label">Experience (25%)</span>
            <span className="score-val">{scores.experienceScore}/25</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill fill-cyan"
              style={{ width: `${(scores.experienceScore / 25) * 100}%` }}
            />
          </div>
        </div>

        <div className="score-bar-item">
          <div className="score-bar-header">
            <span className="score-label">Projects (15%)</span>
            <span className="score-val">{scores.projectsScore}/15</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill fill-purple"
              style={{ width: `${(scores.projectsScore / 15) * 100}%` }}
            />
          </div>
        </div>

        <div className="score-bar-item">
          <div className="score-bar-header">
            <span className="score-label">Preferred (10%)</span>
            <span className="score-val">{scores.preferredSkillsScore}/10</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill fill-blue"
              style={{ width: `${(scores.preferredSkillsScore / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="score-bar-item">
          <div className="score-bar-header">
            <span className="score-label">Edu/Cert (10%)</span>
            <span className="score-val">{scores.educationScore}/10</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill fill-amber"
              style={{ width: `${(scores.educationScore / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Skill Match Badges Row */}
      <div className="card-skills-overview">
        {/* Exact Matches */}
        {exactMatches.length > 0 && (
          <div className="skill-group-mini">
            <span className="mini-group-label text-emerald">
              <CheckCircle2 size={11} />
              Exact Match ({exactMatches.length}):
            </span>
            <div className="tags-flex">
              {exactMatches.slice(0, 4).map((s, i) => (
                <span key={i} className="skill-tag tag-exact-mini">
                  {s}
                </span>
              ))}
              {exactMatches.length > 4 && (
                <span className="tag-more">+{exactMatches.length - 4} more</span>
              )}
            </div>
          </div>
        )}

        {/* Related Matches */}
        {relatedMatches.length > 0 && (
          <div className="skill-group-mini">
            <span className="mini-group-label text-purple">
              <Link2 size={11} />
              Related Match ({relatedMatches.length}):
            </span>
            <div className="tags-flex">
              {relatedMatches.slice(0, 2).map((r, i) => (
                <span key={i} className="skill-tag tag-related-mini" title={r.relevance}>
                  {r.candidateHas} ↔ {r.required}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {missingRequiredSkills.length > 0 && (
          <div className="skill-group-mini">
            <span className="mini-group-label text-rose">
              <AlertTriangle size={11} />
              Missing Skills ({missingRequiredSkills.length}):
            </span>
            <div className="tags-flex">
              {missingRequiredSkills.slice(0, 3).map((s, i) => (
                <span key={i} className="skill-tag tag-missing-mini">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with Details button */}
      <div className="candidate-card-footer">
        <div className="footer-highlights">
          <span className="highlight-pill" title={experienceMatch.details}>
            <Layers size={12} />
            {experienceMatch.status === 'exceeds' ? 'Exceeds Exp Req' : experienceMatch.status === 'meets' ? 'Meets Exp Req' : 'Exp Gap'}
          </span>
          <span className="highlight-pill" title={projectRelevance.details}>
            <Sparkles size={12} />
            {projectRelevance.rating} Project Relevance
          </span>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => onOpenDetails(analysis.candidateId)}
          id={`view-details-${analysis.rank}`}
        >
          <span>Detailed Profile</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
