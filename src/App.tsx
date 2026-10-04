import React, { useState, useEffect } from 'react';
import {
  Sparkles, Play, Award, Search,
  CheckCircle2, Users, AlertCircle, BookmarkCheck
} from 'lucide-react';

import type { JobDescription, CandidateResume, MatchAnalysis } from './types/hirelens';
import { DEMO_JOB_DESCRIPTION, DEMO_CANDIDATES } from './services/demoData';
import { parseJobDescriptionLocal } from './services/localExtractor';
import { rankCandidates } from './services/matcherEngine';
import { evaluateCandidateWithFallback } from './services/geminiMatcher';

import { Navbar } from './components/Navbar';
import { JobDescriptionSection } from './components/JobDescriptionSection';
import { ResumeUploadSection } from './components/ResumeUploadSection';
import { CandidateCard } from './components/CandidateCard';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { WhatIfScoring } from './components/WhatIfScoring';

export const App: React.FC = () => {
  // Core State
  const [jobDescription, setJobDescription] = useState<JobDescription>(DEMO_JOB_DESCRIPTION);
  const [candidates, setCandidates] = useState<CandidateResume[]>([]);
  const [rankings, setRankings] = useState<MatchAnalysis[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // Shortlisting
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());

  // Filtering & Search
  const [filterTier, setFilterTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showShortlistedOnly, setShowShortlistedOnly] = useState<boolean>(false);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);

  // Settings & Engine
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('hirelens_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false);
  const [engineUsed, setEngineUsed] = useState<'local' | 'gemini'>('local');

  // Trigger Candidate Analysis
  const triggerAnalysis = async (candsToAnalyze: CandidateResume[] = candidates, jd: JobDescription = jobDescription) => {
    if (candsToAnalyze.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setAnalysisStep('Extracting target role competencies and required qualifications...');

    await new Promise((r) => setTimeout(r, 250));
    setAnalysisProgress(40);
    setAnalysisStep(`Parsing & standardizing ${candsToAnalyze.length} candidate profiles...`);

    await new Promise((r) => setTimeout(r, 300));
    setAnalysisProgress(70);
    setAnalysisStep('Evaluating 40/25/15/10/10 weighted multi-factor matching matrix...');

    try {
      if (apiKey && apiKey.trim() !== '') {
        setAnalysisStep('Running Gemini AI semantic matching & reasoning...');
        const analyses: MatchAnalysis[] = [];
        for (const cand of candsToAnalyze) {
          const res = await evaluateCandidateWithFallback(cand, jd, { apiKey });
          analyses.push(res.analysis);
        }
        analyses.sort((a, b) => b.scores.totalScore - a.scores.totalScore);
        analyses.forEach((a, idx) => { a.rank = idx + 1; });
        setRankings(analyses);
        setEngineUsed('gemini');
      } else {
        const ranked = rankCandidates(candsToAnalyze, jd);
        setRankings(ranked);
        setEngineUsed('local');
      }
    } catch (err) {
      console.warn('Fallback to local ranking:', err);
      const ranked = rankCandidates(candsToAnalyze, jd);
      setRankings(ranked);
      setEngineUsed('local');
    }

    setAnalysisProgress(100);
    setAnalysisStep('Analysis complete! Rankings updated.');
    await new Promise((r) => setTimeout(r, 200));
    setIsAnalyzing(false);
  };

  // Load Demo Mode
  const handleLoadDemo = () => {
    setJobDescription(DEMO_JOB_DESCRIPTION);
    setCandidates([...DEMO_CANDIDATES]);
    setShortlistedIds(new Set(['cand_alex_rivera']));

    // Trigger analysis with demo data
    triggerAnalysis([...DEMO_CANDIDATES], DEMO_JOB_DESCRIPTION);
  };

  // Run on initial load
  useEffect(() => {
    handleLoadDemo();
  }, []);

  // Update Job Description from textarea
  const handleUpdateJobDescription = (text: string) => {
    const parsed = parseJobDescriptionLocal(text, jobDescription.title);
    setJobDescription(parsed);
  };

  // Select Preset Job Description
  const handleSelectPreset = (preset: JobDescription) => {
    setJobDescription(preset);
    if (candidates.length > 0) {
      triggerAnalysis(candidates, preset);
    }
  };

  // Add Uploaded Candidates
  const handleAddCandidates = (newCandidates: CandidateResume[]) => {
    const updated = [...candidates, ...newCandidates];
    setCandidates(updated);
  };

  // Remove Candidate
  const handleRemoveCandidate = (id: string) => {
    const updated = candidates.filter((c: CandidateResume) => c.id !== id);
    setCandidates(updated);
    setRankings(rankings.filter((r: MatchAnalysis) => r.candidateId !== id));
  };

  // Reset Pipeline
  const handleReset = () => {
    setCandidates([]);
    setRankings([]);
    setSelectedCandidateId(null);
    setShortlistedIds(new Set());
  };

  // Toggle Shortlist
  const handleToggleShortlist = (id: string) => {
    setShortlistedIds((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Save API Key
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('hirelens_gemini_key', key);
  };

  // Filter and Search Logic
  const filteredRankings = rankings.filter((analysis: MatchAnalysis) => {
    if (filterTier === 'top' && analysis.matchTier !== 'Top Match') return false;
    if (filterTier === 'strong' && analysis.matchTier !== 'Strong Match') return false;
    if (filterTier === 'good' && analysis.matchTier !== 'Good Match') return false;
    if (filterTier === 'review' && analysis.matchTier !== 'Fair Match' && analysis.matchTier !== 'Low Match') return false;

    if (showShortlistedOnly && !shortlistedIds.has(analysis.candidateId)) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const nameMatch = analysis.candidateName.toLowerCase().includes(q);
      const skillMatch = analysis.exactMatches.some((s: string) => s.toLowerCase().includes(q));
      if (!nameMatch && !skillMatch) return false;
    }

    return true;
  });

  const selectedAnalysis = rankings.find((r: MatchAnalysis) => r.candidateId === selectedCandidateId);
  const selectedCandidate = candidates.find((c: CandidateResume) => c.id === selectedCandidateId);

  const totalAnalyzed = rankings.length;
  const topScore = rankings.length > 0 ? rankings[0].scores.totalScore : 0;
  const avgScore = rankings.length > 0
    ? Math.round(rankings.reduce((sum: number, r: MatchAnalysis) => sum + r.scores.totalScore, 0) / rankings.length)
    : 0;
  const topTierCount = rankings.filter((r: MatchAnalysis) => r.matchTier === 'Top Match' || r.matchTier === 'Strong Match').length;

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        onLoadDemo={handleLoadDemo}
        onReset={handleReset}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isAiActive={engineUsed === 'gemini'}
        isAnalyzing={isAnalyzing}
        hasCandidates={candidates.length > 0}
      />

      {/* Main Content Area */}
      <main className="main-container">
        {/* Hero Banner */}
        <section className="hero-banner">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} className="text-cyan" />
              <span>Intelligent Technical Recruiter Copilot</span>
            </div>
            <h1 className="hero-heading">
              Match, Rank, and Explain <span className="gradient-text">Top Engineering Talent</span>
            </h1>
            <p className="hero-subtext">
              Cut through resume noise with explainable 0–100 candidate ranking. Instant semantic skill matching, verified experience audits, and project relevance analysis with strict bias safeguards.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          {rankings.length > 0 && (
            <div className="metrics-strip">
              <div className="metric-box">
                <span className="metric-num">{totalAnalyzed}</span>
                <span className="metric-label">Candidates Analyzed</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-num text-emerald">{topScore}/100</span>
                <span className="metric-label">Top Candidate Score</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-num text-cyan">{avgScore}%</span>
                <span className="metric-label">Pipeline Average</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <span className="metric-num text-purple">{topTierCount}</span>
                <span className="metric-label">Strong Contenders</span>
              </div>
            </div>
          )}
        </section>

        {/* Input & Upload Grid */}
        <section className="input-grid">
          {/* Step 1: Job Description */}
          <JobDescriptionSection
            jobDescription={jobDescription}
            onUpdateJobDescription={handleUpdateJobDescription}
            onSelectPreset={handleSelectPreset}
            isAnalyzing={isAnalyzing}
          />

          {/* Step 2: Resume Upload */}
          <ResumeUploadSection
            candidates={candidates}
            onAddCandidates={handleAddCandidates}
            onRemoveCandidate={handleRemoveCandidate}
            onLoadDemoCandidates={handleLoadDemo}
            isAnalyzing={isAnalyzing}
          />
        </section>

        {/* Action Button & Analysis Progress Bar */}
        <section className="action-section">
          {isAnalyzing ? (
            <div className="analyzing-card">
              <div className="analyzing-header">
                <div className="spinner" />
                <span className="analyzing-step-text">{analysisStep}</span>
                <span className="analyzing-pct">{analysisProgress}%</span>
              </div>
              <div className="progress-track-lg">
                <div
                  className="progress-fill fill-gradient"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="analyze-bar">
              <div className="analyze-info">
                <span className="ready-indicator">
                  <CheckCircle2 size={16} className="text-emerald" />
                  Ready to evaluate: <strong>{candidates.length} Candidate(s)</strong> against <strong>{jobDescription.title}</strong>
                </span>
                <span className="scoring-weights-hint">
                  Weights: Required Skills 40% • Exp 25% • Projects 15% • Preferred 10% • Edu 10%
                </span>
              </div>

              <button
                id="analyze-candidates-btn"
                className="btn btn-primary btn-lg"
                onClick={() => triggerAnalysis(candidates, jobDescription)}
                disabled={candidates.length === 0 || isAnalyzing}
              >
                <Sparkles size={18} />
                <span>Run Match Analysis & Rank ({candidates.length})</span>
              </button>
            </div>
          )}
        </section>

        {/* Ranked Results Dashboard */}
        <section className="results-section">
          <div className="results-header">
            <div className="results-title-wrap">
              <div className="card-badge-icon icon-purple">
                <Award size={18} />
              </div>
              <div>
                <h2 className="section-heading">
                  3. Ranked Candidates ({filteredRankings.length} of {rankings.length})
                </h2>
                <p className="card-subtitle">
                  Ranked by objective 0–100 match score with transparent, evidence-grounded explainability
                </p>
              </div>
            </div>

            {/* Filter and Search Controls */}
            {rankings.length > 0 && (
              <div className="results-controls">
                {/* Search */}
                <div className="search-box">
                  <Search size={14} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search candidate or skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>

                {/* Tier Filter Pills */}
                <div className="filter-pill-group">
                  <button
                    className={`filter-pill ${filterTier === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterTier('all')}
                  >
                    All ({rankings.length})
                  </button>
                  <button
                    className={`filter-pill ${filterTier === 'top' ? 'active' : ''}`}
                    onClick={() => setFilterTier('top')}
                  >
                    Top Pick (85%+)
                  </button>
                  <button
                    className={`filter-pill ${filterTier === 'strong' ? 'active' : ''}`}
                    onClick={() => setFilterTier('strong')}
                  >
                    Strong (70-84%)
                  </button>
                  <button
                    className={`filter-pill ${filterTier === 'good' ? 'active' : ''}`}
                    onClick={() => setFilterTier('good')}
                  >
                    Good (58-69%)
                  </button>
                  <button
                    className={`filter-pill ${filterTier === 'review' ? 'active' : ''}`}
                    onClick={() => setFilterTier('review')}
                  >
                    Needs Review (&lt;58%)
                  </button>
                </div>

                {/* Shortlist Toggle */}
                <button
                  className={`btn btn-sm ${showShortlistedOnly ? 'btn-shortlisted' : 'btn-secondary'}`}
                  onClick={() => setShowShortlistedOnly(!showShortlistedOnly)}
                  title="Filter to show only shortlisted candidates"
                >
                  <BookmarkCheck size={14} />
                  <span>Shortlisted ({shortlistedIds.size})</span>
                </button>

                {/* What-If Scoring */}
                <button
                  id="whatif-scoring-btn"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setIsWhatIfOpen(true)}
                  title="Adjust scoring weights and instantly see ranking changes"
                  style={{ background: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc' }}
                >
                  <span>🔮</span>
                  <span>What-If Scoring</span>
                </button>
              </div>
            )}
          </div>

          {/* Candidate Cards Grid */}
          {rankings.length === 0 ? (
            <div className="empty-results-state">
              <Users size={48} className="text-muted" />
              <h3>No Candidate Analysis Yet</h3>
              <p>Upload candidate resumes or click Demo Mode above to generate ranked profiles instantly.</p>
              <button className="btn btn-primary" onClick={handleLoadDemo}>
                <Play size={15} />
                <span>Launch Demo Mode (5 Resumes)</span>
              </button>
            </div>
          ) : filteredRankings.length === 0 ? (
            <div className="empty-results-state">
              <AlertCircle size={40} className="text-amber" />
              <h3>No Candidates Match the Filter</h3>
              <p>Try clearing your search query or selecting "All" candidates.</p>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFilterTier('all');
                  setSearchQuery('');
                  setShowShortlistedOnly(false);
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="candidate-cards-grid">
              {filteredRankings.map((analysis: MatchAnalysis) => {
                const cand = candidates.find((c: CandidateResume) => c.id === analysis.candidateId);
                return (
                  <CandidateCard
                    key={analysis.candidateId}
                    analysis={analysis}
                    candidate={cand}
                    onOpenDetails={(id) => setSelectedCandidateId(id)}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Candidate Detailed Profile Modal */}
      {selectedAnalysis && (
        <CandidateDetailModal
          analysis={selectedAnalysis}
          candidate={selectedCandidate}
          jobDescription={jobDescription}
          onClose={() => setSelectedCandidateId(null)}
          isShortlisted={shortlistedIds.has(selectedAnalysis.candidateId)}
          onToggleShortlist={handleToggleShortlist}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* What-If Scoring Modal */}
      {isWhatIfOpen && (
        <WhatIfScoring
          rankings={rankings}
          onClose={() => setIsWhatIfOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
