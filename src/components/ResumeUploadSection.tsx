import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, Trash2, AlertCircle, Users, Sparkles } from 'lucide-react';
import type { CandidateResume } from '../types/hirelens';
import { extractTextFromPDF, readTextFile } from '../services/pdfParser';
import { parseResumeLocal } from '../services/localExtractor';

interface ResumeUploadSectionProps {
  candidates: CandidateResume[];
  onAddCandidates: (newCandidates: CandidateResume[]) => void;
  onRemoveCandidate: (id: string) => void;
  onLoadDemoCandidates: () => void;
  isAnalyzing: boolean;
}

export const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({
  candidates,
  onAddCandidates,
  onRemoveCandidate,
  onLoadDemoCandidates,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessingFiles(true);
    setUploadError(null);

    const parsedList: CandidateResume[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        let text = '';
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          text = await extractTextFromPDF(file);
        } else {
          text = await readTextFile(file);
        }

        if (!text || text.trim().length < 20) {
          throw new Error('File content could not be read or is empty.');
        }

        const candidate = parseResumeLocal(text, file.name);
        candidate.fileSize = `${(file.size / 1024).toFixed(1)} KB`;
        parsedList.push(candidate);
      } catch (err: any) {
        console.error(`Failed parsing ${file.name}:`, err);
        errors.push(`${file.name}: ${err.message || 'Parse error'}`);
      }
    }

    if (parsedList.length > 0) {
      onAddCandidates(parsedList);
    }

    if (errors.length > 0) {
      setUploadError(`Note: ${errors.length} file(s) failed parsing. ${errors.join(', ')}`);
    }

    setIsProcessingFiles(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  return (
    <div className="card resume-section">
      <div className="card-header">
        <div className="card-title-wrap">
          <div className="card-badge-icon icon-emerald">
            <UploadCloud size={18} />
          </div>
          <div>
            <h2 className="card-title">2. Upload Resumes</h2>
            <p className="card-subtitle">Upload multiple PDF or text resumes for instant profile extraction</p>
          </div>
        </div>

        <div className="resume-header-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={onLoadDemoCandidates}
            disabled={isAnalyzing || isProcessingFiles}
            title="Load 5 pre-built candidate resumes (senior, mid, junior, adjacent)"
            type="button"
          >
            <Users size={14} />
            <span>Load 5 Demo Resumes</span>
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Drop Zone */}
        <div
          className={`dropzone ${isDragging ? 'dropzone-active' : ''} ${isProcessingFiles ? 'dropzone-busy' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          id="resume-dropzone"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.txt,.md,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
            disabled={isAnalyzing || isProcessingFiles}
          />
          <div className="dropzone-icon">
            <UploadCloud size={36} />
          </div>
          <div className="dropzone-text">
            {isProcessingFiles ? (
              <span className="dropzone-title">Extracting resume data...</span>
            ) : (
              <>
                <span className="dropzone-title">
                  <strong>Click to upload</strong> or drag and drop multiple PDF resumes
                </span>
                <span className="dropzone-hint">
                  Supports multiple PDF & text files • In-browser secure extraction
                </span>
              </>
            )}
          </div>
        </div>

        {uploadError && (
          <div className="alert alert-warning">
            <AlertCircle size={16} />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Candidate List Queue */}
        <div className="candidate-queue-wrap">
          <div className="queue-header">
            <span className="queue-title">
              Candidate Queue ({candidates.length})
            </span>
            {candidates.length > 0 && (
              <span className="queue-subhint">
                All candidates parsed & ready for ranking
              </span>
            )}
          </div>

          {candidates.length === 0 ? (
            <div className="empty-queue-placeholder">
              <Users size={28} className="text-muted" />
              <p>No resumes uploaded yet.</p>
              <button
                className="btn btn-outline btn-sm"
                onClick={onLoadDemoCandidates}
                type="button"
              >
                <Sparkles size={13} />
                Load 5 Sample Resumes
              </button>
            </div>
          ) : (
            <div className="candidate-pill-list">
              {candidates.map((cand) => (
                <div key={cand.id} className="candidate-queue-card">
                  <div className="queue-card-avatar">
                    {cand.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CD'}
                  </div>
                  <div className="queue-card-info">
                    <div className="queue-card-top">
                      <span className="queue-candidate-name">{cand.name}</span>
                      <span className="queue-file-badge">{cand.fileName}</span>
                    </div>
                    <div className="queue-card-specs">
                      <span className="spec-item">
                        <CheckCircle2 size={12} className="text-emerald" />
                        {cand.skills.length} skills identified
                      </span>
                      <span className="spec-dot">•</span>
                      <span className="spec-item">
                        {cand.experienceYears} yrs experience
                      </span>
                      {cand.education[0] && (
                        <>
                          <span className="spec-dot">•</span>
                          <span className="spec-item truncate">
                            {cand.education[0].degree.split(' in ')[0]}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn-remove-queue"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCandidate(cand.id);
                    }}
                    disabled={isAnalyzing}
                    title="Remove candidate from queue"
                    type="button"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
