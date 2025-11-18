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
    // Simple example calculation
    const speed = parseFloat(swingSpeed || "0");
    const hcp = parseFloat(handicap || "0");
    const dist = parseFloat(avgDistance || "0");

    let factor = Math.max(0, Math.min(100, speed * 0.5 + (20 - hcp) * 2 + dist * 0.1));
    let category = factor > 70 ? "High Forgiveness" : factor > 50 ? "Moderate Forgiveness" : "Low Forgiveness";
    const recommendations = ["Example Club 1", "Example Club 2", "Example Club 3"];

    return { factor: Math.round(factor), category, recommendations };
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
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Basic Playing Info */}
              <div className="space-y-2">
                <Label htmlFor="swingSpeed">Driver Swing Speed (mph)</Label>
                <Input
                  id="swingSpeed"
                  type="number"
                  placeholder="e.g., 95"
                  value={swingSpeed}
                  onChange={(e) => setSwingSpeed(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="handicap">Handicap</Label>
                <Input
                  id="handicap"
                  type="number"
                  placeholder="e.g., 12"
                  value={handicap}
                  onChange={(e) => setHandicap(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avgDistance">Average 7-Iron Distance (yards)</Label>
                <Input
                  id="avgDistance"
                  type="number"
                  placeholder="e.g., 150"
                  value={avgDistance}
                  onChange={(e) => setAvgDistance(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Play Style</Label>
                <Select value={playStyle} onValueChange={setPlayStyle} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select play style (e.g., Balanced)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Required Fitting Info */}
              <div className="space-y-2">
                <Label htmlFor="playerHeight">Player Height (inches)</Label>
                <Input
                  id="playerHeight"
                  type="number"
                  placeholder="e.g., 70"
                  value={playerHeight}
                  onChange={(e) => setPlayerHeight(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wristToFloor">Wrist to Floor (inches)</Label>
                <Input
                  id="wristToFloor"
                  type="number"
                  placeholder='e.g., 34"'
                  value={wristToFloor}
                  onChange={(e) => setWristToFloor(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Hand Size</Label>
                <Select value={handSize} onValueChange={setHandSize} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hand size (e.g., Medium)" />
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
                    <SelectValue placeholder="Select gender (e.g., Male)" />
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
                    <SelectValue placeholder="Select option (e.g., None)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="arthritis">Arthritis</SelectItem>
                    <SelectItem value="weak_grip">Weak Grip</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ball Flight Tendency</Label>
                <Select value={ballFlightTendency} onValueChange={setBallFlightTendency} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ball flight (e.g., Straight)" />
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
                <Label>Would you like to make optional adjustments?</Label>
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
                        <SelectValue placeholder="Select adjustment (e.g., Standard)" />
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
                        <SelectValue placeholder="Select adjustment (e.g., Standard)" />
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
                        <SelectValue placeholder="Select shaft (e.g., Steel)" />
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
                        <SelectValue placeholder="Select option (e.g., Standard)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="lighter">Lighter</SelectItem>
                        <SelectItem value="heavier">Heavier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Grip Sizes</Label>
                    <Select value={gripSizes} onValueChange={setGripSizes}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grip size (e.g., Standard)" />
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

              {/* Email */}
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
                    type="email"
                    placeholder="e.g., name@example.com"
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
