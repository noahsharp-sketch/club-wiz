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
  category: string;
  recommendations: string[];
}

interface ClubFinderFormProps {
  onCalculate: (data: PlayerData, result: PlayabilityResult) => void;
}

export const ClubFinderForm = ({ onCalculate }: ClubFinderFormProps) => {
  const [experience, setExperience] = useState("beginner");
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

  const [useAdjustments, setUseAdjustments] = useState("no");
  const [clubLengthAdjustment, setClubLengthAdjustment] = useState("standard");
  const [lieAngleAdjustment, setLieAngleAdjustment] = useState("standard");
  const [shaftPreference, setShaftPreference] = useState("steel");
  const [swingWeightAdjustment, setSwingWeightAdjustment] = useState("standard");
  const [gripSizes, setGripSizes] = useState("standard");

  const [sendEmailOption, setSendEmailOption] = useState("no");
  const [userEmail, setUserEmail] = useState("");

  const calculatePlayability = (): PlayabilityResult => {
    let factor = 0;
    const speed = parseFloat(swingSpeed || "0");
    const hcp = parseFloat(handicap || "0");
    const dist = parseFloat(avgDistance || "0");

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
      emailjs.send(
        "service_9h83hig",
        "template_rr5nx0l",
        {
          to_email: userEmail,
          player_data: JSON.stringify(playerData, null, 2),
          playability_result: JSON.stringify(result, null, 2),
        },
        "cPjYPfJ7KtCFh9yUB"
      ).then(() => {
        alert("Your results have been emailed!");
      }).catch((err) => {
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
              {/* Experience Level */}
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

              {/* Optional Adjustments */}
              <div className="space-y-2">
                <Label>Would you like to make optional adjustments?</Label>
                <Select value={useAdjustments} onValueChange={setUseAdjustments}>
                  <SelectTrigger className="border-input rounded-md shadow-sm hover:border-primary focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email Option */}
              <div className="space-y-2">
                <Label>Would you like your results emailed?</Label>
                <Select value={sendEmailOption} onValueChange={setSendEmailOption}>
                  <SelectTrigger className="border-input rounded-md shadow-sm hover:border-primary focus:ring-2 focus:ring-primary">
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
                    className="border-input rounded-md shadow-sm"
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
