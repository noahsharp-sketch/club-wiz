import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ClubFinderForm, PlayerData, PlayabilityResult } from "@/components/ClubFinderForm";
import { Results } from "@/components/Results";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [result, setResult] = useState<PlayabilityResult | null>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    calculatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCalculate = (data: PlayerData, calculatedResult: PlayabilityResult) => {
    setPlayerData(data);
    setResult(calculatedResult);
    setShowResults(true);
    
    // Scroll to results after a brief delay to allow state to update
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={handleGetStarted} />
      <HowItWorks />
      <div ref={calculatorRef}>
        <ClubFinderForm onCalculate={handleCalculate} />
      </div>
      {showResults && playerData && result && (
        <div ref={resultsRef}>
          <Results playerData={playerData} result={result} />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Index;
