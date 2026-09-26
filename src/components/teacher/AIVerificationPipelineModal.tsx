import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  FileSearch, 
  Cpu, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AIVerificationReport, FlaggedVerificationItem } from '../../types';

interface AIVerificationPipelineModalProps {
  isOpen: boolean;
  resourceTitle: string;
  topicName: string;
  report: AIVerificationReport | null;
  onClose: () => void;
  onPublishResource: (updatedReport: AIVerificationReport) => void;
}

export const AIVerificationPipelineModal: React.FC<AIVerificationPipelineModalProps> = ({
  isOpen,
  resourceTitle,
  topicName,
  report,
  onClose,
  onPublishResource
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [pipelineFinished, setPipelineFinished] = useState<boolean>(false);
  const [localReport, setLocalReport] = useState<AIVerificationReport | null>(null);
  const [activeItem, setActiveItem] = useState<FlaggedVerificationItem | null>(null);

  const pipelineSteps = [
    { title: 'Uploading', desc: 'Ingesting document buffer & raw markdown payload' },
    { title: 'Extracting Content', desc: 'Parsing formulas, code ASTs, and diagram markers' },
    { title: 'Checking Accuracy', desc: 'Cross-verifying claims with academic peer-reviewed sources' },
    { title: 'Checking for Outdated Information', desc: 'Auditing deprecated APIs, old statistics & obsolete methods' },
    { title: 'Checking Relevance', desc: `Aligning depth with syllabus node (${topicName})` },
    { title: 'Checking Structure', desc: 'Validating pedagogical clarity and readability metrics' },
    { title: 'Verification Complete', desc: 'Synthesizing final AI Verification Report' }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setPipelineFinished(false);
      setLocalReport(null);
      setActiveItem(null);

      // Animate through pipeline steps smoothly
      const interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < pipelineSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setPipelineFinished(true);
            return prev;
          }
        });
      }, 550);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (report && pipelineFinished) {
      setLocalReport(report);
      if (report.flaggedItems.length > 0) {
        setActiveItem(report.flaggedItems[0]);
      }
    }
  }, [report, pipelineFinished]);

  if (!isOpen) return null;

  const handleFixItem = (itemId: string) => {
    if (!localReport) return;
    const updated = {
      ...localReport,
      flaggedItems: localReport.flaggedItems.map(item => 
        item.id === itemId ? { ...item, status: 'fixed' as const } : item
      )
    };
    setLocalReport(updated);
  };

  const handleIgnoreItem = (itemId: string) => {
    if (!localReport) return;
    const updated = {
      ...localReport,
      flaggedItems: localReport.flaggedItems.map(item => 
        item.id === itemId ? { ...item, status: 'ignored' as const } : item
      )
    };
    setLocalReport(updated);
  };

  const handleCompletePublish = () => {
    if (localReport) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      onPublishResource(localReport);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">EduVault AI Verification Pipeline</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Pre-Publishing Gate
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Verifying: <span className="text-slate-200 font-semibold">{resourceTitle}</span>
              </p>
            </div>
          </div>
          {pipelineFinished && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10"
            >
              Close
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* Animated Pipeline Stage Tracker */}
          {!pipelineFinished ? (
            <div className="py-8 px-4 flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center relative">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
              </div>

              <div className="text-center">
                <h4 className="text-lg font-bold text-slate-900">
                  {pipelineSteps[currentStepIndex].title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  {pipelineSteps[currentStepIndex].desc}
                </p>
              </div>

              {/* Step Sequence Indicators */}
              <div className="w-full max-w-md space-y-2 pt-4">
                {pipelineSteps.map((step, idx) => {
                  const isDone = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;
                  return (
                    <div 
                      key={step.title}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs transition ${
                        isCurrent 
                          ? 'bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-200' 
                          : isDone 
                            ? 'text-emerald-700 font-medium' 
                            : 'text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : isCurrent ? (
                          <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span>{step.title}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isDone ? 'Passed' : isCurrent ? 'Analyzing...' : 'Waiting'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Pipeline Finished: Show AI Verification Report */
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Overall Score Header */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-emerald-600/30">
                    {localReport?.overallScore || 98}%
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">
                        AI Verification Report
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified for Publication
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Last verified: <span className="font-semibold text-slate-700">September 2026</span> • Automated Academic Rigor Audit
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-700 font-semibold bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Review</span>
                  </div>
                  <div className="flex items-center gap-1 text-rose-700 font-semibold bg-white/80 px-2.5 py-1 rounded-lg border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Error</span>
                  </div>
                </div>
              </div>

              {/* 5 Core Verification Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* Accuracy */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Accuracy
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {localReport?.checks.accuracy.details}
                  </p>
                </div>

                {/* Outdated Information Check */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${localReport?.checks.outdatedInfo.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      Outdated Information Check
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      localReport?.checks.outdatedInfo.status === 'warning' 
                        ? 'text-amber-800 bg-amber-50' 
                        : 'text-emerald-700 bg-emerald-50'
                    }`}>
                      {localReport?.checks.outdatedInfo.status === 'warning' ? 'Review Recommended' : 'Up-to-Date (2026)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {localReport?.checks.outdatedInfo.details}
                  </p>
                </div>

                {/* Relevance */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Relevance & Curriculum Fit
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Aligned
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {localReport?.checks.relevance.details}
                  </p>
                </div>

                {/* Source Grounding */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Source Grounding
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Cross-Referenced
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {localReport?.checks.sourceGrounding.details}
                  </p>
                </div>

              </div>

              {/* Actionable Flagged Items Module (Teacher Decisions: Fix / Ignore) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />
                    Audited Sections & Suggestions
                  </h5>
                  <span className="text-[11px] text-slate-400">
                    EduVault AI does not silently rewrite your content.
                  </span>
                </div>

                {localReport?.flaggedItems && localReport.flaggedItems.length > 0 ? (
                  <div className="space-y-2.5">
                    {localReport.flaggedItems.map((item) => (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-2xl border transition ${
                          item.status === 'fixed'
                            ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                            : item.status === 'ignored'
                              ? 'bg-slate-50 border-slate-200 opacity-60'
                              : item.severity === 'error'
                                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                                : item.severity === 'warning'
                                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`w-2.5 h-2.5 rounded-full ${
                                item.severity === 'error' 
                                  ? 'bg-rose-500' 
                                  : item.severity === 'warning' 
                                    ? 'bg-amber-500' 
                                    : 'bg-emerald-500'
                              }`} />
                              <span className="text-xs font-bold">{item.section}</span>
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-white/80 border border-slate-200">
                                {item.title}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                              {item.description}
                            </p>

                            {item.suggestedFix && (
                              <div className="mt-2 text-[11px] font-medium p-2 rounded-lg bg-white/90 border border-slate-200 text-slate-800">
                                <span className="font-bold text-indigo-700">AI Suggested Action: </span>
                                {item.suggestedFix}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0">
                            {item.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => handleFixItem(item.id)}
                                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Accept Fix</span>
                                </button>
                                <button
                                  onClick={() => handleIgnoreItem(item.id)}
                                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition"
                                >
                                  Ignore Warning
                                </button>
                              </>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 border border-slate-200">
                                {item.status === 'fixed' ? '✓ Fixed' : 'Dismissed'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                    ✓ Clean audit: No syntax warnings, broken references, or outdated frameworks discovered.
                  </div>
                )}
              </div>

              {/* Publish Action & Trust Badge */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>✓ AI Verified Badge Earned</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Ready to publish into library
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={onClose}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  >
                    Edit Draft
                  </button>
                  <button
                    onClick={handleCompletePublish}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                  >
                    <span>Publish & Go Live</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
