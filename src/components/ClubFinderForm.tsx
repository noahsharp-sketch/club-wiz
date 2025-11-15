import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";

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
  category: string;
  recommendations: string[];
}

interface ClubFinderFormProps {
  onCalculate: (data: PlayerData, result: PlayabilityResult, userEmail?: string) => void;
}

export const ClubFinderForm = ({ onCalculate }: ClubFinderFormProps) => {
  const [experience, setExperience] = useState("beginner");
  const [wantAdjustments, setWantAdjustments] = useState("no");
  const [userEmail, setUserEmail] = useState("");

  // Basic Playing Info
  const [swingSpeed, setSwingSpeed] = useState("");
  const [handicap, setHandicap] = useState("");
  const [avgDistance, setAvgDistance] = useState("");
  const [playStyle, setPlayStyle] = useState("");

  // Required Fitting Info
  const [playerHeight, setPlayerHeight] = useState("");
  const [wristToFloor, setWristToFloor] = useState("");
  const [handSize, setHandSize] = useState("");
  const [gender, setGender] = useState("");
  const [handgripIssues, setHandgripIssues] = useState("");
  const [ballFlightTendency, setBallFlightTendency] = useState("");

  // Optional Adjustments
  const [clubLengthAdjustment, setClubLengthAdjustment] = useState("standard");
  const [lieAngleAdjustment, setLieAngleAdjustment] = useState("standard");
  const [shaftPreference, setShaftPreference] = useState("steel");
  const [swingWeightAdjustment, setSwingWeightAdjustment] = useState("standard");
  const [gripSizes, setGripSizes] = useState("standard");

  const calculatePlayability = (): PlayabilityResult => {
    let factor = 0;
    const speed = parseFloat(swingSpeed) || 0;
    const hcp = parseFloat(handicap) || 0;
    const dist = parseFloat(avgDistance) || 0;

    if (speed < 85) factor += 35;
    else if (speed < 95) factor += 25;
    else if (speed < 105) factor += 15;
    else factor += 5;

    if (hcp >= 20) factor += 35;
    else if (hcp >= 15) factor += 25;
    else if (hcp >= 10) factor += 15;
    else if (hcp >= 5) factor += 10;
    else factor += 5;

    if (playStyle === "aggressive") factor -= 10;
    else if (playStyle === "conservative") factor += 10;

    const expectedDistance = speed * 2.5;
    const distanceRatio = dist / expectedDistance;
    if (distanceRatio < 0.85) factor += 10;
    else if (distanceRatio > 1.1) factor -= 5;

    factor = Math.max(0, Math.min(100, factor));

    let category = "";
    let recommendations: string[] = [];

    if (factor >= 70) {
      category = "High Forgiveness";
      recommendations = [
        "Game Improvement Irons (e.g., TaylorMade Stealth, Callaway Rogue ST Max)",
        "Oversized Driver with High MOI (460cc head)",
        "Hybrid Clubs (4H, 5H to replace long irons)",
        "Perimeter-weighted Cavity Back Irons",
        "High-loft Driver (10.5° - 12°)"
      ];
    } else if (factor >= 50) {
      category = "Moderate Forgiveness";
      recommendations = [
        "Players Distance Irons (e.g., Ping G430, Mizuno JPX)",
        "Adjustable Driver (9.5° - 10.5° loft)",
        "One or Two Hybrids (3H, 4H)",
        "Progressive Set Design (cavity backs to muscle)",
        "Fairway Woods with Rail Design"
      ];
    } else if (factor >= 30) {
      category = "Low Forgiveness";
      recommendations = [
        "Players Irons (e.g., Titleist T100, Mizuno MP)",
        "Low-spin Driver (8.5° - 9.5° loft)",
        "Blade-style Short Irons",
        "Traditional 3-wood and 5-wood",
        "Forged Cavity Back Long Irons"
      ];
    } else {
      category = "Tour Level";
      recommendations = [
        "Blade Irons (e.g., Titleist MB, Mizuno MP-20)",
        "Low-loft Driver with Tour Shaft (8° - 9°)",
        "Classic Muscle Back Design",
        "Tour-caliber Woods and Hybrids",
        "High-control Wedge Setup (52°, 56°, 60°)"
      ];
    }

    return { factor: Math.round(factor), category, recommendations };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const playerData: PlayerData = {
      swingSpeed: experience !== "beginner" ? parseFloat(swingSpeed) : undefined,
      handicap: experience === "expert" ? parseFloat(handicap) : undefined,
      avgDistance: experience !== "beginner" ? parseFloat(avgDistance) : undefined,
      playStyle: experience !== "beginner" ? playStyle : undefined,
      playerHeight: parseFloat(playerHeight) || undefined,
      wristToFloor: parseFloat(wristToFloor) || undefined,
      handSize: handSize || undefined,
      gender: gender || undefined,
      handgripIssues: handgripIssues || undefined,
      ballFlightTendency: experience !== "beginner" ? ballFlightTendency || undefined : undefined,
      clubLengthAdjustment: wantAdjustments === "yes" ? clubLengthAdjustment : undefined,
      lieAngleAdjustment: wantAdjustments === "yes" ? lieAngleAdjustment : undefined,
      shaftPreference: wantAdjustments === "yes" ? shaftPreference : undefined,
      swingWeightAdjustment: wantAdjustments === "yes" ? swingWeightAdjustment : undefined,
      gripSizes: wantAdjustments === "yes" ? gripSizes : undefined
    };

    const result = calculatePlayability();
    onCalculate(playerData, result, userEmail || undefined);
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
              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="experience">Select your experience level</Label>
                <Select value={experience} onValueChange={setExperience} required>
                  <SelectTrigger id="experience" className="border-input">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Required Fitting Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                  Required Fitting Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="playerHeight">Player Height (inches)</Label>
                    <Input
                      id="playerHeight"
                      type="number"
                      placeholder="e.g., 70"
                      value={playerHeight}
                      onChange={(e) => setPlayerHeight(e.target.value)}
                      className="border-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wristToFloor">Wrist to Floor (inches)</Label>
                    <Input
                      id="wristToFloor"
                      type="number"
                      placeholder="e.g., 34"
                      value={wristToFloor}
                      onChange={(e) => setWristToFloor(e.target.value)}
                      className="border-input"
                      required
                      min="28"
                      max="42"
                      step="0.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="handSize">Hand Size</Label>
                    <Select value={handSize} onValueChange={setHandSize} required>
                      <SelectTrigger id="handSize" className="border-input">
                        <SelectValue placeholder="Select hand size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extra-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender} required>
                      <SelectTrigger id="gender" className="border-input">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="handgripIssues">Handgrip Issues</Label>
                    <Select value={handgripIssues} onValueChange={setHandgripIssues} required>
                      <SelectTrigger id="handgripIssues" className="border-input">
                        <SelectValue placeholder="Select any issues" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="arthritis">Arthritis</SelectItem>
                        <SelectItem value="carpal-tunnel">Carpal Tunnel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {experience !== "beginner" && (
                    <div className="space-y-2">
                      <Label htmlFor="ballFlightTendency">Ball Flight Tendency</Label>
                      <Select value={ballFlightTendency} onValueChange={setBallFlightTendency} required>
                        <SelectTrigger id="ballFlightTendency" className="border-input">
                          <SelectValue placeholder="Select tendency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="straight">Straight</SelectItem>
                          <SelectItem value="slice">Slice</SelectItem>
                          <SelectItem value="hook">Hook</SelectItem>
                          <SelectItem value="fade">Fade</SelectItem>
                          <SelectItem value="draw">Draw</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Adjustments Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="wantAdjustments">Do you want to make optional adjustments?</Label>
                <Select value={wantAdjustments} onValueChange={setWantAdjustments}>
                  <SelectTrigger id="wantAdjustments" className="border-input">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {wantAdjustments === "yes" && (
                <div className="space-y-6">
                  {/* All optional adjustment fields here (same as previous form) */}
                  {/* ... insert the previous adjustment fields like clubLengthAdjustment, lieAngleAdjustment, etc. ... */}
                </div>
              )}

              {/* Email Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="wantEmail">Do you want the results emailed to you?</Label>
                <Select value={userEmail ? "yes" : "no"} onValueChange={(val) => {
                  if (val === "no") setUserEmail("");
                }}>
                  <SelectTrigger id="wantEmail" className="border-input">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userEmail !== "" && (
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Enter your email</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 shadow-golf"
                size="lg"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate My Factor
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ClubFinderForm;
