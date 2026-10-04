import React from 'react';
import { Eye, Sparkles, Key, RotateCcw, ShieldCheck, Play } from 'lucide-react';

interface NavbarProps {
  onLoadDemo: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
  isAiActive: boolean;
  isAnalyzing: boolean;
  hasCandidates: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadDemo,
  onReset,
  onOpenSettings,
  isAiActive,
  isAnalyzing,
  hasCandidates,
}) => {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-icon">
            <Eye size={22} className="brand-eye-icon" />
            <Sparkles size={12} className="brand-sparkle-icon" />
          </div>
          <div>
            <div className="brand-title-wrap">
              <span className="brand-title">HireLens</span>
              <span className="brand-ai">AI</span>
              <span className="badge-hackathon">Hackathon MVP</span>
            </div>
            <p className="brand-subtitle">Explainable & Unbiased Resume Ranking</p>
          </div>
        </div>

        {/* Center: Fairness Badge */}
        <div className="fairness-badge" title="Scoring strictly omits gender, religion, race, age, caste, and photographs">
          <ShieldCheck size={14} className="text-emerald" />
          <span>Bias-Aware Scoring</span>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Engine indicator */}
          <button
            className={`engine-status-btn ${isAiActive ? 'active-ai' : 'active-local'}`}
            onClick={onOpenSettings}
            title="Click to view AI Settings & API configuration"
          >
            <span className="status-dot"></span>
            <span>{isAiActive ? 'Gemini AI Linked' : 'Local Fallback Engine'}</span>
          </button>

          {/* Quick Demo Button */}
          <button
            id="demo-mode-btn"
            className="btn btn-demo"
            onClick={onLoadDemo}
            disabled={isAnalyzing}
            title="Load 5 realistic candidate resumes and a Senior Full-Stack JD instantly"
          >
            <Play size={14} />
            <span>Demo Mode (5 Resumes)</span>
          </button>

          {/* Settings / API Key */}
          <button
            className="btn btn-secondary icon-btn"
            onClick={onOpenSettings}
            title="Configure Gemini API Key & Weights"
          >
            <Key size={15} />
            <span>Settings</span>
          </button>

          {/* Reset button */}
          {hasCandidates && (
            <button
              className="btn btn-ghost icon-btn"
              onClick={onReset}
              disabled={isAnalyzing}
              title="Clear all data and reset"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
