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
    let mpfScore = 1000;
    const speed = parseFloat(swingSpeed || "0");
    const hcp = parseFloat(handicap || "0");
    const dist = parseFloat(avgDistance || "0");

    if (speed < 85) mpfScore -= 500;
    else if (speed < 95) mpfScore -= 350;
    else if (speed < 105) mpfScore -= 200;
    else mpfScore -= 50;

    if (hcp >= 20) mpfScore -= 450;
    else if (hcp >= 15) mpfScore -= 350;
    else if (hcp >= 10) mpfScore -= 250;
    else if (hcp >= 5) mpfScore -= 150;

    if (playStyle === "aggressive") mpfScore += 50;
    else if (playStyle === "conservative") mpfScore -= 50;

    if (speed > 0 && dist > 0) {
      const expected = speed * 2.5;
      const ratio = dist / expected;
      if (ratio < 0.85) mpfScore -= 100;
      else if (ratio > 1.1) mpfScore += 50;
    }

    mpfScore = Math.max(350, Math.min(1000, mpfScore));
    let category = "";
    let recommendations: string[] = [];

    if (mpfScore <= 500) {
      category = "Ultra Game Improvement (MPF 350-500)";
      recommendations = ["Cleveland Launcher XL", "Callaway Rogue ST Max", "TaylorMade Stealth HD"];
    } else if (mpfScore <= 600) {
      category = "Super Game Improvement (MPF 500-600)";
      recommendations = ["Ping G430", "Cobra Aerojet", "Mizuno JPX923 Hot Metal"];
    } else if (mpfScore <= 700) {
      category = "Game Improvement (MPF 600-700)";
      recommendations = ["TaylorMade Stealth", "Titleist T300", "Callaway Paradym"];
    } else if (mpfScore <= 800) {
      category = "Players Distance (MPF 700-800)";
      recommendations = ["Titleist T200", "Mizuno JPX923 Forged", "Ping i530"];
    } else if (mpfScore <= 900) {
      category = "Players Irons (MPF 800-900)";
      recommendations = ["Titleist T100", "Mizuno MP-223", "TaylorMade P770"];
    } else {
      category = "Tour Blades (MPF 900+)";
      recommendations = ["Titleist MB", "Mizuno MP-20", "Srixon ZX7"];
    }

    return { factor: Math.round(mpfScore), category, recommendations };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const playerData: PlayerData = {
      swingSpeed: parseFloat(swingSpeed),
      handicap: parseFloat(handicap),
      avgDistance: parseFloat(avgDistance),
      playStyle,
      playerHeight: parseFloat(playerHeight),
      wristToFloor: parseFloat(wristToFloor),
      handSize,
      gender,
      handgripIssues,
      ballFlightTendency,
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
            user_email: userEmail,
            player_data: JSON.stringify(playerData, null, 2),
            playability_result: JSON.stringify(result, null, 2),
          },
          "cPjYPfJ7KtCFh9yUB"
        )
        .then(() => alert("Your results have been emailed!"))
        .catch((err) => alert("Email failed: " + err.text));
    }
  };

  return (
    <section className="py-20 bg-background" id="calculator">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-card-golf border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">Calculate Your Playability Factor</CardTitle>
            <CardDescription className="text-lg">Enter your golf data to discover your ideal club specs</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Swing Speed */}
              <div className="space-y-2">
                <Label>Swing Speed (mph)</Label>
                <Input required type="number" value={swingSpeed} onChange={(e) => setSwingSpeed(e.target.value)} />
              </div>

              {/* Handicap REQUIRED */}
              <div className="space-y-2">
                <Label>Handicap</Label>
                <Input required type="number" value={handicap} onChange={(e) => setHandicap(e.target.value)} />
              </div>

              {/* Avg Distance */}
              <div className="space-y-2">
                <Label>Average 7-Iron Distance (yards)</Label>
                <Input required type="number" value={avgDistance} onChange={(e) => setAvgDistance(e.target.value)} />
              </div>

              {/* Play Style */}
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

              {/* Height */}
              <div className="space-y-2">
                <Label>Player Height (inches)</Label>
                <Input required type="number" value={playerHeight} onChange={(e) => setPlayerHeight(e.target.value)} />
              </div>

              {/* Wrist to Floor */}
              <div className="space-y-2">
                <Label>Wrist to Floor (inches)</Label>
                <Input required type="number" value={wristToFloor} onChange={(e) => setWristToFloor(e.target.value)} />
              </div>

              {/* Hand Size */}
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

              {/* Gender */}
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

              {/* Handgrip Issues */}
              <div className="space-y-2">
                <Label>Handgrip Issues</Label>
                <Select value={handgripIssues} onValueChange={setHandgripIssues} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="arthritis">Arthritis</SelectItem>
                    <SelectItem value="weak_grip">Weak Grip</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ball Flight Tendency */}
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

              {/* Optional Adjustments */}
              <div className="space-y-2">
                <Label>Would you like to make adjustments?</Label>
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
                  <div className="space-y-2">
                    <Label>Club Length Adjustment</Label>
                    <Select value={clubLengthAdjustment} onValueChange={setClubLengthAdjustment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="+0.5">+0.5 inch</SelectItem>
                        <SelectItem value="+1.0">+1.0 inch</SelectItem>
                        <SelectItem value="-0.5">-0.5 inch</SelectItem>
                        <SelectItem value="-1.0">-1.0 inch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Lie Angle Adjustment</Label>
                    <Select value={lieAngleAdjustment} onValueChange={setLieAngleAdjustment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="upright">Upright (+2°)</SelectItem>
                        <SelectItem value="flat">Flat (-2°)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Shaft Preference</Label>
                    <Select value={shaftPreference} onValueChange={setShaftPreference}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="steel">Steel</SelectItem>
                        <SelectItem value="graphite">Graphite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Swing Weight Adjustment</Label>
                    <Select value={swingWeightAdjustment} onValueChange={setSwingWeightAdjustment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="lighter">Lighter</SelectItem>
                        <SelectItem value="heavier">Heavier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Grip Size</Label>
                    <Select value={gripSizes} onValueChange={setGripSizes}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="midsize">Midsize</SelectItem>
                        <SelectItem value="jumbo">Jumbo</SelectItem>
                        <SelectItem value="undersize">Undersize</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Email Option */}
              <div className="space-y-2">
                <Label>Would you like your results emailed?</Label>
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
                    required
                    type="email"
                    placeholder="Enter your email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                )}
              </div>

              <Button type="submit" className="w-full text-lg py-6">
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
