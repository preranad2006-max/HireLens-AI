import { Briefcase, CheckCircle2, Sparkles, BookOpen, Layers } from 'lucide-react';
import type { JobDescription } from '../types/hirelens';
import { ALTERNATE_JOB_PRESETS } from '../services/demoData';

interface JobDescriptionSectionProps {
  jobDescription: JobDescription;
  onUpdateJobDescription: (newJdText: string) => void;
  onSelectPreset: (preset: JobDescription) => void;
  isAnalyzing: boolean;
}

export const JobDescriptionSection: React.FC<JobDescriptionSectionProps> = ({
  jobDescription,
  onUpdateJobDescription,
  onSelectPreset,
  isAnalyzing,
}) => {
  return (
    <div className="card jd-section">
      <div className="card-header">
        <div className="card-title-wrap">
          <div className="card-badge-icon icon-blue">
            <Briefcase size={18} />
          </div>
          <div>
            <h2 className="card-title">1. Job Description</h2>
            <p className="card-subtitle">Paste target role requirements or load a curated preset</p>
          </div>
        </div>

        {/* Preset Selector Dropdown / Buttons */}
        <div className="preset-selector">
          <span className="preset-label">Presets:</span>
          {ALTERNATE_JOB_PRESETS.map((p, idx) => (
            <button
              key={idx}
              className={`preset-chip ${jobDescription.title === p.title ? 'active' : ''}`}
              onClick={() => onSelectPreset(p.jd)}
              disabled={isAnalyzing}
              type="button"
            >
              {p.title.split(' ')[0]} {p.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="card-body">
        {/* Textarea */}
        <div className="textarea-wrapper">
          <textarea
            id="job-description-input"
            className="code-textarea"
            rows={7}
            placeholder="Paste complete Job Description here (Role summary, required skills, preferred qualifications, experience, education)..."
            value={jobDescription.rawText}
            onChange={(e) => onUpdateJobDescription(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>

        {/* Live Extracted Requirements Preview */}
        <div className="jd-extracted-preview">
          <div className="preview-header">
            <Sparkles size={14} className="text-cyan" />
            <span className="preview-title">Extracted Role Criteria</span>
            <span className="pill-metric">
              {jobDescription.requiredSkills.length} Required • {jobDescription.preferredSkills.length} Preferred • {jobDescription.requiredExperienceYears}+ Yrs
            </span>
          </div>

          <div className="preview-grid">
            {/* Required Skills */}
            <div className="spec-group">
              <span className="spec-label">
                <CheckCircle2 size={12} className="text-emerald" />
                Required Skills (40% Weight):
              </span>
              <div className="tags-flex">
                {jobDescription.requiredSkills.length > 0 ? (
                  jobDescription.requiredSkills.map((s, i) => (
                    <span key={i} className="skill-tag tag-required">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-sm">No required skills detected yet</span>
                )}
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="spec-group">
              <span className="spec-label">
                <Sparkles size={12} className="text-purple" />
                Preferred Skills (10% Weight):
              </span>
              <div className="tags-flex">
                {jobDescription.preferredSkills.length > 0 ? (
                  jobDescription.preferredSkills.map((s, i) => (
                    <span key={i} className="skill-tag tag-preferred">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-sm">None specified</span>
                )}
              </div>
            </div>

            {/* Experience & Education */}
            <div className="spec-row">
              <div className="spec-group half">
                <span className="spec-label">
                  <Layers size={12} className="text-blue" />
                  Target Experience (25% Weight):
                </span>
                <span className="spec-value-badge">
                  {jobDescription.requiredExperienceYears}+ Years ({jobDescription.seniorityLevel} Level)
                </span>
              </div>

              <div className="spec-group half">
                <span className="spec-label">
                  <BookOpen size={12} className="text-amber" />
                  Education (10% Weight):
                </span>
                <span className="spec-value-badge">
                  {jobDescription.requiredEducation[0] || 'Bachelor\'s Degree in Technical Field'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
