import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";
import emailjs from "@emailjs/browser";

export interface PlayerData {
  swingSpeed?: number;
  handicap?: number;
  avgDistance?: number;
  playStyle?: string;
  playerHeight?: number;
  wristToFloor?: number;
  handSize?: string;
  gender?: string;
  handgripIssues?: string;
  ballFlightTendency?: string;
  clubLengthAdjustment?: string;
  lieAngleAdjustment?: string;
  shaftPreference?: string;
  swingWeightAdjustment?: string;
  gripSizes?: string;
}

export interface PlayabilityResult {
  factor: number;
  maxMPF: number;
  category: string;
  recommendations: string[];
}

interface ClubFinderFormProps {
  onCalculate: (data: PlayerData, result: PlayabilityResult) => void;
}

const MAX_MPF = 1000; // Max possible score

export const ClubFinderForm = ({ onCalculate }: ClubFinderFormProps) => {
  const [experience, setExperience] = useState("beginner");

  // Basic / required info
  const [swingSpeed, setSwingSpeed] = useState("");
  const [handicap, setHandicap] = useState("");
  const [avgDistance, setAvgDistance] = useState("");
  const [playStyle, setPlayStyle] = useState("");
  const [playerHeight, setPlayerHeight] = useState("");
  const [wristToFloor, setWristToFloor] = useState("");
  const [handSize, setHandSize] = useState("");
  const [gender, setGender] = useState("");
  const [handgripIssues, setHandgripIssues] = useState("");
  const [ballFlightTendency, setBallFlightTendency] = useState("");

  // Optional adjustments
  const [useAdjustments, setUseAdjustments] = useState("no");
  const [clubLengthAdjustment, setClubLengthAdjustment] = useState("standard");
  const [lieAngleAdjustment, setLieAngleAdjustment] = useState("standard");
  const [shaftPreference, setShaftPreference] = useState("steel");
  const [swingWeightAdjustment, setSwingWeightAdjustment] = useState("standard");
  const [gripSizes, setGripSizes] = useState("standard");

  // Email
  const [sendEmailOption, setSendEmailOption] = useState("no");
  const [userEmail, setUserEmail] = useState("");

  const calculatePlayability = (): PlayabilityResult => {
    let mpfScore = MAX_MPF;

    const speed = parseFloat(swingSpeed || "0");
    const hcp = parseFloat(handicap || "0");
    const dist = parseFloat(avgDistance || "0");

    // Swing speed adjustments
    if (speed < 85) mpfScore -= 500;
    else if (speed < 95) mpfScore -= 350;
    else if (speed < 105) mpfScore -= 200;
    else mpfScore -= 50;

    // Handicap adjustments
    if (hcp >= 20) mpfScore -= 450;
    else if (hcp >= 15) mpfScore -= 350;
    else if (hcp >= 10) mpfScore -= 250;
    else if (hcp >= 5) mpfScore -= 150;

    // Play style adjustments
    if (playStyle === "aggressive") mpfScore += 50;
    else if (playStyle === "conservative") mpfScore -= 50;

    // Distance consistency
    if (speed > 0 && dist > 0) {
      const expectedDistance = speed * 2.5;
      const ratio = dist / expectedDistance;
      if (ratio < 0.85) mpfScore -= 100;
      else if (ratio > 1.1) mpfScore += 50;
    }

    mpfScore = Math.max(350, Math.min(MAX_MPF, mpfScore));

    let category = "";
    let recommendations: string[] = [];

    if (mpfScore <= 500) {
      category = "Ultra Game Improvement (MPF 350-500)";
      recommendations = [
        "Cleveland Launcher XL Irons (MPF 427)",
        "Callaway Rogue ST Max Irons (MPF 455)",
        "TaylorMade Stealth HD Irons (MPF 468)",
        "Oversized High MOI Driver (460cc, 10.5°-12°)",
        "Hybrids to replace 4-6 irons for maximum forgiveness",
      ];
    } else if (mpfScore <= 600) {
      category = "Super Game Improvement (MPF 500-600)";
      recommendations = [
        "Ping G430 Irons (MPF 556)",
        "Cobra Aerojet Irons (MPF 542)",
        "Mizuno JPX923 Hot Metal Irons (MPF 578)",
        "Adjustable Driver (10°-11° loft)",
        "2-3 Hybrids for long iron replacement",
      ];
    } else if (mpfScore <= 700) {
      category = "Game Improvement (MPF 600-700)";
      recommendations = [
        "TaylorMade Stealth Irons (MPF 645)",
        "Titleist T300 Irons (MPF 668)",
        "Callaway Paradym Irons (MPF 652)",
        "Forgiving Driver (9.5°-10.5° loft)",
        "Fairway woods with moderate offset",
      ];
    } else if (mpfScore <= 800) {
      category = "Conventional/Players Distance (MPF 700-800)";
      recommendations = [
        "Titleist T200 Irons (MPF 745)",
        "Mizuno JPX923 Forged (MPF 768)",
        "Ping i530 Irons (MPF 732)",
        "Low-spin Driver (9°-10° loft)",
        "Progressive set: cavity backs to compact heads",
      ];
    } else if (mpfScore <= 900) {
      category = "Players Irons (MPF 800-900)";
      recommendations = [
        "Titleist T100 Irons (MPF 847)",
        "Mizuno MP-223 Irons (MPF 825)",
        "TaylorMade P770 Irons (MPF 856)",
        "Tour-level Driver (8.5°-9.5° loft)",
        "Compact cavity back or split cavity design",
      ];
    } else {
      category = "Classic/Tour Blades (MPF 900+)";
      recommendations = [
        "Titleist MB (620) Irons (MPF 965)",
        "Mizuno MP-20 Blades (MPF 1008)",
        "Srixon ZX7 MKII Irons (MPF 912)",
        "Tour Driver with low spin shaft (8°-9° loft)",
        "Traditional muscle back forged irons",
      ];
    }

    return { factor: Math.round(mpfScore), maxMPF: MAX_MPF, category, recommendations };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const playerData: PlayerData = {
      swingSpeed: experience !== "beginner" ? parseFloat(swingSpeed) : undefined,
      handicap: experience === "expert" ? parseFloat(handicap) : undefined,
      avgDistance: experience !== "beginner" ? parseFloat(avgDistance) : undefined,
      playStyle: experience !== "beginner" ? playStyle : undefined,
      playerHeight: parseFloat(playerHeight),
      wristToFloor: parseFloat(wristToFloor),
      handSize,
      gender,
      handgripIssues,
      ballFlightTendency: experience === "beginner" ? undefined : ballFlightTendency,
      clubLengthAdjustment: useAdjustments === "yes" ? clubLengthAdjustment : undefined,
      lieAngleAdjustment: useAdjustments === "yes" ? lieAngleAdjustment : undefined,
      shaftPreference: useAdjustments === "yes" ? shaftPreference : undefined,
      swingWeightAdjustment: useAdjustments === "yes" ? swingWeightAdjustment : undefined,
      gripSizes: useAdjustments === "yes" ? gripSizes : undefined,
    };

    const result = calculatePlayability();
    onCalculate(playerData, result);

    if (sendEmailOption === "yes" && userEmail) {
      emailjs
        .send(
          "service_9h83hig",
          "template_rr5nx0l",
          {
            to_email: userEmail,
            player_data: JSON.stringify(playerData, null, 2),
            playability_result: JSON.stringify(result, null, 2),
          },
          "cPjYPfJ7KtCFh9yUB"
        )
        .then(() => {
          alert("Your results have been emailed!");
        })
        .catch((err) => {
          alert("Failed to send email: " + err.text);
        });
    }
  };

  return (
    <section className="py-20 bg-background" id="calculator">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-card-golf border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">
              Calculate Your Playability Factor
            </CardTitle>
            <CardDescription className="text-lg">
              Enter your golf data to discover your ideal club specifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Experience */}
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger className="border-input rounded-md shadow-sm hover:border-primary focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Fields */}
              {experience !== "beginner" && (
                <>
                  <div className="space-y-2">
                    <Label>Swing Speed (mph)</Label>
                    <Input value={swingSpeed} onChange={(e) => setSwingSpeed(e.target.value)} type="number" required />
                  </div>
                  {experience === "expert" && (
                    <div className="space-y-2">
                      <Label>Handicap</Label>
                      <Input value={handicap} onChange={(e) => setHandicap(e.target.value)} type="number" required />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Average Distance</Label>
                    <Input value={avgDistance} onChange={(e) => setAvgDistance(e.target.value)} type="number" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Play Style</Label>
                    <Select value={playStyle} onValueChange={setPlayStyle} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select play style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ball Flight Tendency</Label>
                    <Select value={ballFlightTendency} onValueChange={setBallFlightTendency} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ball flight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slice">Slice</SelectItem>
                        <SelectItem value="straight">Straight</SelectItem>
                        <SelectItem value="draw">Draw</SelectItem>
                        <SelectItem value="hook">Hook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Required fitting info always */}
              <div className="space-y-2">
                <Label>Player Height</Label>
                <Input value={playerHeight} onChange={(e) => setPlayerHeight(e.target.value)} type="number" required />
              </div>
              <div className="space-y-2">
                <Label>Wrist to Floor</Label>
                <Input value={wristToFloor} onChange={(e) => setWristToFloor(e.target.value)} type="number" required />
              </div>
              <div className="space-y-2">
                <Label>Hand Size</Label>
                <Select value={handSize} onValueChange={setHandSize} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hand size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Handgrip Issues</Label>
                <Select value={handgripIssues} onValueChange={setHandgripIssues} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="arthritis">Arthritis</SelectItem>
                    <SelectItem value="weak_grip">Weak Grip</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Optional adjustments */}
              <div className="space-y-2">
                <Label>Would you like optional adjustments?</Label>
                <Select value={useAdjustments} onValueChange={setUseAdjustments}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {useAdjustments === "yes" && (
                <>
                  {/* Add adjustment fields here as in previous code */}
                </>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label>Email Results?</Label>
                <Select value={sendEmailOption} onValueChange={setSendEmailOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
                {sendEmailOption === "yes" && (
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                )}
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 shadow-golf">
                <Calculator className="mr-2 h-5 w-5" /> Calculate My Factor
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ClubFinderForm;
