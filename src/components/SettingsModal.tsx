import React, { useState } from 'react';
import { X, Key, ShieldCheck, Check, Sparkles, Sliders } from 'lucide-react';

interface SettingsModalProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  apiKey,
  onSaveApiKey,
  onClose,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container settings-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="card-title-wrap">
            <div className="card-badge-icon icon-blue">
              <Key size={18} />
            </div>
            <div>
              <h3 className="card-title">HireLens AI Configuration</h3>
              <p className="card-subtitle">AI connection settings & compliance standards</p>
            </div>
          </div>
          <button className="btn btn-ghost icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body settings-body">
          {/* Gemini API Key Section */}
          <div className="settings-section">
            <label className="settings-label" htmlFor="gemini-api-key">
              <Sparkles size={15} className="text-cyan" />
              <span>Google Gemini API Key (Optional)</span>
            </label>
            <p className="settings-hint">
              If provided, HireLens AI will utilize Gemini 2.5 Flash for deep semantic reasoning. If left blank or if offline, the reliable local deterministic matching engine runs automatically.
            </p>
            <div className="key-input-row">
              <input
                id="gemini-api-key"
                type="password"
                className="input-text"
                placeholder="AIzaSy... (leave blank to use Local Engine)"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleSave}>
                {saved ? <Check size={16} /> : 'Save Key'}
              </button>
            </div>
          </div>

          {/* Default Weights Information */}
          <div className="settings-section">
            <label className="settings-label">
              <Sliders size={15} className="text-purple" />
              <span>Default Scoring Weights (Hackathon Standard)</span>
            </label>
            <div className="weights-table">
              <div className="weight-row">
                <span className="weight-title">Required Skills</span>
                <span className="weight-pct text-emerald">40%</span>
              </div>
              <div className="weight-row">
                <span className="weight-title">Experience Depth & Seniority</span>
                <span className="weight-pct text-cyan">25%</span>
              </div>
              <div className="weight-row">
                <span className="weight-title">Projects & Practical Achievements</span>
                <span className="weight-pct text-purple">15%</span>
              </div>
              <div className="weight-row">
                <span className="weight-title">Preferred Skills</span>
                <span className="weight-pct text-blue">10%</span>
              </div>
              <div className="weight-row">
                <span className="weight-title">Education & Certifications</span>
                <span className="weight-pct text-amber">10%</span>
              </div>
            </div>
          </div>

          {/* Fairness & Anti-Bias Policy */}
          <div className="settings-section fairness-card">
            <div className="fairness-header">
              <ShieldCheck size={18} className="text-emerald" />
              <span className="fairness-card-title">Strict Fairness & Zero Bias Policy</span>
            </div>
            <p className="fairness-card-p">
              HireLens AI is architected with strict guardrails to completely exclude demographic indicators:
            </p>
            <ul className="fairness-list">
              <li>No scoring based on gender, ethnicity, caste, religion, or nationality</li>
              <li>Photographs and personal appearance elements are never parsed or factored</li>
              <li>Grounded exclusively in verifiable skills, demonstrated project outcomes, and work history</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? 'Saved Successfully!' : 'Apply Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
