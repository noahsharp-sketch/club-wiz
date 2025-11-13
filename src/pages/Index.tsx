import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ClubFinderForm, PlayerData, PlayabilityResult } from "@/components/ClubFinderForm";
import { ClubPreferencesForm, ClubPreferences } from "@/components/ClubPreferencesForm";
import { Results } from "@/components/Results";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [result, setResult] = useState<PlayabilityResult | null>(null);
  const [preferences, setPreferences] = useState<ClubPreferences | null>(null);
  const [savedCalculationId, setSavedCalculationId] = useState<string | null>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const preferencesRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGetStarted = () => {
    calculatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCalculate = async (data: PlayerData, calculatedResult: PlayabilityResult) => {
    setPlayerData(data);
    setResult(calculatedResult);
    setShowResults(true);
    
    // Save calculation if user is logged in
    if (user) {
      const { data: savedData, error } = await supabase
        .from('saved_calculations')
        .insert({
          user_id: user.id,
          swing_speed: data.swingSpeed,
          handicap: data.handicap,
          avg_distance: data.avgDistance,
          play_style: data.playStyle,
          playability_factor: calculatedResult.factor,
          category: calculatedResult.category
        })
        .select()
        .single();

      if (!error && savedData) {
        setSavedCalculationId(savedData.id);
        toast({
          title: "Calculation Saved!",
          description: "Your playability factor has been saved to your account."
        });
      }
    }
    
    // Scroll to results after a brief delay to allow state to update
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handlePreferencesSubmit = async (clubPreferences: ClubPreferences) => {
    setPreferences(clubPreferences);
    setShowPreferences(false);
    
    // Update the saved calculation with preferences if user is logged in
    if (user && savedCalculationId) {
      const { error } = await supabase
        .from('saved_calculations')
        .update({
          club_condition: clubPreferences.clubCondition,
          grip_preference: clubPreferences.gripPreference,
          look_preference: clubPreferences.lookPreference,
          budget_range: clubPreferences.budgetRange,
          brand_preference: clubPreferences.brandPreference
        })
        .eq('id', savedCalculationId);

      if (!error) {
        toast({
          title: "Preferences Saved!",
          description: "Your club preferences have been saved to your account."
        });
      }
    }
    
    // Scroll back to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleShowPreferences = () => {
    setShowPreferences(true);
    setTimeout(() => {
      preferencesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20">
        <Hero onGetStarted={handleGetStarted} />
        <HowItWorks />
        <div ref={calculatorRef}>
          <ClubFinderForm onCalculate={handleCalculate} />
        </div>
        {showResults && playerData && result && (
          <div ref={resultsRef}>
            <Results 
              playerData={playerData} 
              result={result} 
              preferences={preferences}
              onShowPreferences={handleShowPreferences}
            />
          </div>
        )}
        {showPreferences && (
          <div ref={preferencesRef}>
            <ClubPreferencesForm onSubmit={handlePreferencesSubmit} />
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
