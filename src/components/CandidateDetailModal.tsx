import React, { useState } from 'react';
import {
  X, CheckCircle2, AlertTriangle, Link2, Briefcase, Award,
  BookOpen, Sparkles, FileText, BookmarkCheck, Copy, Check,
  Layers, ShieldAlert
} from 'lucide-react';
import type { MatchAnalysis, CandidateResume, JobDescription } from '../types/hirelens';
import { ScoreDial } from './ScoreDial';

interface CandidateDetailModalProps {
  analysis: MatchAnalysis;
  candidate?: CandidateResume;
  jobDescription?: JobDescription;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (candidateId: string) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  analysis,
  candidate,
  onClose,
  isShortlisted,
  onToggleShortlist,
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'experience' | 'projects' | 'rawText'>('analysis');
  const [copied, setCopied] = useState(false);

  const { scores, rank, matchTier, explanation, exactMatches, relatedMatches, missingRequiredSkills, missingPreferredSkills, matchedPreferredSkills, experienceMatch, projectRelevance } = analysis;

  const handleCopySummary = () => {
    const textToCopy = `HireLens AI Candidate Assessment
Candidate: ${analysis.candidateName} (Rank #${rank})
Overall Score: ${scores.totalScore}/100 (${matchTier})

Executive Summary:
${explanation.summary}

Score Breakdown:
- Required Skills: ${scores.requiredSkillsScore}/40
- Experience: ${scores.experienceScore}/25
- Projects: ${scores.projectsScore}/15
- Preferred Skills: ${scores.preferredSkillsScore}/10
- Education & Certs: ${scores.educationScore}/10

Exact Matches: ${exactMatches.join(', ') || 'None'}
Related Matches: ${relatedMatches.map(r => `${r.candidateHas} (${r.required})`).join(', ') || 'None'}
Missing Critical Skills: ${missingRequiredSkills.join(', ') || 'None'}
Experience: ${experienceMatch.details}
Project Relevance: ${projectRelevance.rating} - ${projectRelevance.details}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-rank-pill">
              <Award size={16} />
              <span>Rank #{rank}</span>
            </div>
            <div>
              <h2 className="modal-candidate-name">{analysis.candidateName}</h2>
              <div className="modal-meta-row">
                <span className="modal-tier-badge">{matchTier}</span>
                <span className="meta-separator">•</span>
                <span>{candidate?.fileName || 'Resume Document'}</span>
                {candidate?.email && (
                  <>
                    <span className="meta-separator">•</span>
                    <span>{candidate.email}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="modal-header-right">
            <ScoreDial score={scores.totalScore} size={84} strokeWidth={7} />
            <button
              className={`btn btn-sm ${isShortlisted ? 'btn-shortlisted' : 'btn-secondary'}`}
              onClick={() => onToggleShortlist(analysis.candidateId)}
              title="Shortlist this candidate for interview"
            >
              <BookmarkCheck size={15} />
              <span>{isShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}</span>
            </button>
            <button
              className="btn btn-ghost icon-btn"
              onClick={handleCopySummary}
              title="Copy Assessment Summary"
            >
              {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
            </button>
            <button
              className="btn btn-ghost icon-btn modal-close-btn"
              onClick={onClose}
              title="Close modal (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <Sparkles size={14} />
            <span>Match & Explainability</span>
          </button>
          <button
            className={`modal-tab ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            <Briefcase size={14} />
            <span>Experience & Career ({candidate?.experienceHistory?.length || 0})</span>
          </button>
          <button
            className={`modal-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <Layers size={14} />
            <span>Projects & Portfolio ({candidate?.projects?.length || 0})</span>
          </button>
          <button
            className={`modal-tab ${activeTab === 'rawText' ? 'active' : ''}`}
            onClick={() => setActiveTab('rawText')}
          >
            <FileText size={14} />
            <span>Raw Extracted Evidence</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'analysis' && (
            <div className="analysis-tab-content">
              {/* Executive Explainability Card */}
              <div className="explainability-hero">
                <div className="explainability-hero-header">
                  <Sparkles size={16} className="text-cyan" />
                  <h4>Why {analysis.candidateName} Received {scores.totalScore}/100</h4>
                </div>
                <p className="explainability-summary-text">{explanation.summary}</p>
                <div className="fairness-disclaimer">
                  <ShieldAlert size={13} className="text-emerald" />
                  <span>
                    HireLens AI Guarantee: Evaluated strictly on technical competencies, verifiable experience, and project delivery. Demographic and sensitive traits are completely excluded.
                  </span>
                </div>
              </div>

              {/* Scoring Weights Matrix Table */}
              <div className="detail-section">
                <h4 className="section-title">Weighted Score Breakdown</h4>
                <div className="score-matrix-grid">
                  {/* Required Skills */}
                  <div className="matrix-card">
                    <div className="matrix-card-top">
                      <span className="matrix-label">Required Skills (40%)</span>
                      <span className="matrix-points text-emerald">{scores.requiredSkillsScore} / 40</span>
                    </div>
                    <div className="matrix-progress">
                      <div className="matrix-fill fill-emerald" style={{ width: `${(scores.requiredSkillsScore / 40) * 100}%` }} />
                    </div>
                    <p className="matrix-desc">{explanation.requiredSkillsExplanation}</p>
                  </div>

                  {/* Experience */}
                  <div className="matrix-card">
                    <div className="matrix-card-top">
                      <span className="matrix-label">Experience Depth (25%)</span>
                      <span className="matrix-points text-cyan">{scores.experienceScore} / 25</span>
                    </div>
                    <div className="matrix-progress">
                      <div className="matrix-fill fill-cyan" style={{ width: `${(scores.experienceScore / 25) * 100}%` }} />
                    </div>
                    <p className="matrix-desc">{explanation.experienceExplanation}</p>
                  </div>

                  {/* Projects */}
                  <div className="matrix-card">
                    <div className="matrix-card-top">
                      <span className="matrix-label">Projects & Impact (15%)</span>
                      <span className="matrix-points text-purple">{scores.projectsScore} / 15</span>
                    </div>
                    <div className="matrix-progress">
                      <div className="matrix-fill fill-purple" style={{ width: `${(scores.projectsScore / 15) * 100}%` }} />
                    </div>
                    <p className="matrix-desc">{explanation.projectsExplanation}</p>
                  </div>

                  {/* Preferred Skills */}
                  <div className="matrix-card">
                    <div className="matrix-card-top">
                      <span className="matrix-label">Preferred Skills (10%)</span>
                      <span className="matrix-points text-blue">{scores.preferredSkillsScore} / 10</span>
                    </div>
                    <div className="matrix-progress">
                      <div className="matrix-fill fill-blue" style={{ width: `${(scores.preferredSkillsScore / 10) * 100}%` }} />
                    </div>
                    <p className="matrix-desc">{explanation.preferredSkillsExplanation}</p>
                  </div>

                  {/* Education & Certs */}
                  <div className="matrix-card">
                    <div className="matrix-card-top">
                      <span className="matrix-label">Education & Certs (10%)</span>
                      <span className="matrix-points text-amber">{scores.educationScore} / 10</span>
                    </div>
                    <div className="matrix-progress">
                      <div className="matrix-fill fill-amber" style={{ width: `${(scores.educationScore / 10) * 100}%` }} />
                    </div>
                    <p className="matrix-desc">{explanation.educationExplanation}</p>
                  </div>
                </div>
              </div>

              {/* Skill Match Deep Dive */}
              <div className="detail-section">
                <h4 className="section-title">Skill Match Diagnostics</h4>
                <div className="skill-diagnostics-grid">
                  {/* Exact Matches */}
                  <div className="diagnostic-box box-emerald">
                    <div className="diagnostic-box-header">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>Strong / Exact Matches ({exactMatches.length})</span>
                    </div>
                    <p className="diagnostic-sub">Direct match with job description requirements</p>
                    <div className="tags-flex">
                      {exactMatches.length > 0 ? (
                        exactMatches.map((s, i) => (
                          <span key={i} className="skill-tag tag-exact">
                            <CheckCircle2 size={12} />
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-sm">No exact required skills identified</span>
                      )}
                    </div>
                  </div>

                  {/* Related / Semantic Matches */}
                  <div className="diagnostic-box box-purple">
                    <div className="diagnostic-box-header">
                      <Link2 size={16} className="text-purple" />
                      <span>Related / Semantic Matches ({relatedMatches.length})</span>
                    </div>
                    <p className="diagnostic-sub">Equivalent or complementary competencies credited</p>
                    <div className="related-matches-list">
                      {relatedMatches.length > 0 ? (
                        relatedMatches.map((r, i) => (
                          <div key={i} className="related-match-row">
                            <span className="skill-tag tag-candidate-has">{r.candidateHas}</span>
                            <span className="related-arrow">➔</span>
                            <span className="skill-tag tag-required-target">{r.required}</span>
                            <span className="related-reason">({r.relevance})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-sm">No related skill mappings required</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Required Skills */}
                  <div className="diagnostic-box box-rose">
                    <div className="diagnostic-box-header">
                      <AlertTriangle size={16} className="text-rose" />
                      <span>Missing Required Skills ({missingRequiredSkills.length})</span>
                    </div>
                    <p className="diagnostic-sub">Core job requirements not evidenced in candidate profile</p>
                    <div className="tags-flex">
                      {missingRequiredSkills.length > 0 ? (
                        missingRequiredSkills.map((s, i) => (
                          <span key={i} className="skill-tag tag-missing">
                            <AlertTriangle size={12} />
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-emerald-sm">✓ Zero missing required skills</span>
                      )}
                    </div>
                  </div>

                  {/* Preferred Skills Status */}
                  <div className="diagnostic-box box-blue">
                    <div className="diagnostic-box-header">
                      <Sparkles size={16} className="text-blue" />
                      <span>Preferred Skills Overview</span>
                    </div>
                    <p className="diagnostic-sub">Bonus skills that enhance role impact</p>
                    <div className="tags-flex">
                      {matchedPreferredSkills.map((s, i) => (
                        <span key={i} className="skill-tag tag-preferred-matched">
                          ✓ {s}
                        </span>
                      ))}
                      {missingPreferredSkills.map((s, i) => (
                        <span key={i} className="skill-tag tag-preferred-missing">
                          ✗ {s} (Missing)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education & Certifications Row */}
              <div className="detail-section">
                <h4 className="section-title">Education & Credentials Evidence</h4>
                <div className="credentials-flex">
                  <div className="cred-card">
                    <BookOpen size={16} className="text-amber" />
                    <div>
                      <span className="cred-title">Academic Qualifications</span>
                      <p className="cred-desc">
                        {candidate?.education && candidate.education.length > 0
                          ? candidate.education.map(e => `${e.degree} - ${e.institution}`).join(' | ')
                          : 'No formal degree listed; practical experience evaluated.'}
                      </p>
                    </div>
                  </div>

                  <div className="cred-card">
                    <Award size={16} className="text-purple" />
                    <div>
                      <span className="cred-title">Verified Certifications</span>
                      <p className="cred-desc">
                        {candidate?.certifications && candidate.certifications.length > 0
                          ? candidate.certifications.join(', ')
                          : 'No third-party certifications listed.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="experience-tab-content">
              <div className="exp-summary-banner">
                <Briefcase size={20} className="text-cyan" />
                <div>
                  <h4>{experienceMatch.candidateYears} Years Total Professional Experience</h4>
                  <p>{experienceMatch.details}</p>
                </div>
              </div>

              <div className="timeline-list">
                {candidate?.experienceHistory && candidate.experienceHistory.length > 0 ? (
                  candidate.experienceHistory.map((exp, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4 className="timeline-role">{exp.role}</h4>
                          <span className="timeline-company">{exp.company}</span>
                        </div>
                        {exp.duration && <span className="timeline-duration">{exp.duration}</span>}
                        <p className="timeline-description">{exp.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No structured experience history entries parsed.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="projects-tab-content">
              <div className="project-relevance-banner">
                <Sparkles size={20} className="text-purple" />
                <div>
                  <h4>Project Relevance Rating: {projectRelevance.rating}</h4>
                  <p>{projectRelevance.details}</p>
                </div>
              </div>

              <div className="projects-grid">
                {candidate?.projects && candidate.projects.length > 0 ? (
                  candidate.projects.map((proj, i) => (
                    <div key={i} className="project-detail-card">
                      <h4 className="project-detail-title">{proj.title}</h4>
                      <p className="project-detail-desc">{proj.description}</p>
                      <div className="project-tech-stack">
                        <span className="tech-stack-label">Technologies:</span>
                        <div className="tags-flex">
                          {proj.techStack.map((tech, ti) => (
                            <span key={ti} className="skill-tag tag-tech">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No projects extracted from resume profile.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'rawText' && (
            <div className="raw-text-tab-content">
              <div className="raw-text-notice">
                <FileText size={16} className="text-cyan" />
                <span>
                  Exact parsed text from {candidate?.fileName}. Evidence-Grounded Scoring: All scoring decisions are based on information extracted from the candidate's resume and job description. all scores are directly verified against this textual evidence.
                </span>
              </div>
              <pre className="raw-resume-pre">
                {candidate?.rawText || 'No raw text available.'}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="modal-footer-left">
            <span className="text-muted-sm">Candidate ID: {analysis.candidateId}</span>
          </div>
          <div className="modal-footer-right">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              className={`btn ${isShortlisted ? 'btn-shortlisted' : 'btn-primary'}`}
              onClick={() => onToggleShortlist(analysis.candidateId)}
            >
              <BookmarkCheck size={16} />
              <span>{isShortlisted ? 'Candidate Shortlisted' : 'Shortlist Candidate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
