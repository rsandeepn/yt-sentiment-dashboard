import { useEffect, useState } from "react";
import { AnalysisContext } from "./useAnalysis";
import { isActiveAnalysis } from "../utils/analysisJobs";

const ACTIVE_ANALYSIS_KEY = "activeAnalysisJob";

export function AnalysisProvider({ children }) {
  const [result, setResult] = useState(null);
  const [currentJob, setCurrentJob] = useState(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_ANALYSIS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (isActiveAnalysis(currentJob)) {
      localStorage.setItem(ACTIVE_ANALYSIS_KEY, JSON.stringify(currentJob));
    } else {
      localStorage.removeItem(ACTIVE_ANALYSIS_KEY);
    }
  }, [currentJob]);

  return (
    <AnalysisContext.Provider value={{ result, setResult, currentJob, setCurrentJob }}>
      {children}
    </AnalysisContext.Provider>
  );
}
