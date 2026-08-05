import { useState } from "react";
import { AnalysisContext } from "./useAnalysis";

export function AnalysisProvider({ children }) {
  const [result, setResult] = useState(null);

  return (
    <AnalysisContext.Provider value={{ result, setResult }}>
      {children}
    </AnalysisContext.Provider>
  );
}
