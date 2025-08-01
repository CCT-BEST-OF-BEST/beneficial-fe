import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface StepContextType {
  currentStep: number;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
}

const StepContext = createContext<StepContextType | null>(null);

export function StepProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <StepContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </StepContext.Provider>
  );
}

export function useStep() {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStep must be used within a StepProvider');
  }
  return context;
} 