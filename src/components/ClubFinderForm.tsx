import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Calculator } from "lucide-react";

export interface PlayerData {
  swingSpeed: number;
  handicap: number;
  avgDistance: number;
  playStyle: string;
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
  // Basic info
  const [swingSpeed, setSwingSpeed] = useState("");
  const [handicap, setHandicap] = useState("");
  const [avgDistance, setAvgDistance] = useState("");
  const [playStyle, setPlayStyle] = useState("");

  // Required fitting info
  const [playerHeight, setPlayerHeight] = useState("");
  const [wristToFloor, setWristToFloor] = useState("");
  const [handSize, setHandSize] = useState("");
  const [gender, setGender] = useState("");
  const [handgripIssues, setHandgripIssues] = useState("");
  const [ballFlightTendency, setBallFlightTendency] = useState("");

  // Optional adjustments
  const [clubLengthAdjustment, setClubLengthAdjustment] = useState("standard");
  const [lieAngleAdjustment, setLieAngleAdjustment] = useState("standard");
  const [shaftPreference, setShaftPreference] = useState("steel");
  const [swingWeightAdjustment, setSwingWeightAdjustment] = useState("standard");
  const [gripSizes, setGripSizes] = useState("standard");

  // Conditional UI
  const [experience, setExperience] = useState("beginner");
  const [showAdjustments, setShowAdjustments] = useState(false);

  const calculatePlayability = (): PlayabilityResult => {
    const speed = parseFloat(swingSpeed);
    const hcp = parseFloat(handicap);
    const dist = parseFloat(avgDistance);
    let factor = 0;

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
      recommendations = ["Game Improvement Irons", "Oversized Driver", "Hybrids"];
    } else if (factor >= 50) {
      category = "Moderate Forgiveness";
      recommendations = ["Players Distance Irons", "Adjustable Driver", "Hybrids"];
    } else if (factor >= 30) {
      category = "Low Forgiveness";
      recommendations = ["Players Irons", "Low-spin Driver", "Blade-style Irons"];
    } else {
      category = "Tour Level";
      recommendations = ["Blade Irons", "Low-loft Driver", "Tour-caliber Woods"];
    }

    return { factor: Math.round(factor), category, recommendations };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!swingSpeed || !avgDistance || !playStyle) return;

    const playerData: PlayerData = {
      swingSpeed: parseFloat(swingSpeed),
      handicap: handicap ? parseFloat(handicap) : 0,
      avgDistance: parseFloat(avgDistance),
      playStyle,
      playerHeight: playerHeight ? parseFloat(playerHeight) : undefined,
      wristToFloor: wristToFloor ? parseFloat(wristToFloor) : undefined,
      handSize: handSize || undefined,
      gender: gender || undefined,
      handgripIssues: handgripIssues || undefined,
      ballFlightTendency: ballFlightTendency || undefined,
      clubLengthAdjustment: showAdjustments ? clubLengthAdjustment : undefined,
      lieAngleAdjustment: showAdjustments ? lieAngleAdjustment : undefined,
      shaftPreference: showAdjustments ? shaftPreference : undefined,
      swingWeightAdjustment: showAdjustments ? swingWeightAdjustment : undefined,
      gripSizes: showAdjustments ? gripSizes : undefined,
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
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Experience Selector */}
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-foreground font-medium">
                  Experience Level
                </Label>
                <Select value={experience} onValueChange={setExperience} required>
                  <SelectTrigger id="experience" className="border-input">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Basic Info */}
              {(experience === "beginner" || experience === "expert") && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Basic Playing Information
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="swingSpeed">Driver Swing Speed (mph)</Label>
                    <Input
                      id="swingSpeed"
                      type="number"
                      placeholder="e.g., 95"
                      value={swingSpeed}
                      onChange={(e) => setSwingSpeed(e.target.value)}
                      required
                      min="50"
                      max="130"
                    />
                  </div>
                  {experience === "expert" && (
                    <div className="space-y-2">
                      <Label htmlFor="handicap">Handicap Index</Label>
                      <Input
                        id="handicap"
                        type="number"
                        placeholder="e.g., 15"
                        value={handicap}
                        onChange={(e) => setHandicap(e.target.value)}
                        min="0"
                        max="54"
                        step="0.1"
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="avgDistance">Average Driver Distance (yards)</Label>
                    <Input
                      id="avgDistance"
                      type="number"
                      placeholder="e.g., 220"
                      value={avgDistance}
                      onChange={(e) => setAvgDistance(e.target.value)}
                      required
                      min="100"
                      max="350"
                    />
                  </div>
                </div>
              )}

              {/* Required Fitting Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                  Required Fitting Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Player Height (inches)</Label>
                    <Input
                      type="number"
                      placeholder="70"
                      value={playerHeight}
                      onChange={(e) => setPlayerHeight(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Wrist to Floor (inches)</Label>
                    <Input
                      type="number"
                      placeholder="34"
                      value={wristToFloor}
                      onChange={(e) => setWristToFloor(e.target.value)}
                      required
                      min="28"
                      max="42"
                      step="0.5"
                    />
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
                        <SelectItem value="extra-large">Extra Large</SelectItem>
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Handgrip Issues</Label>
                    <Select value={handgripIssues} onValueChange={setHandgripIssues} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issues" />
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
                      <Label>Ball Flight Tendency</Label>
                      <Select value={ballFlightTendency} onValueChange={setBallFlightTendency} required>
                        <SelectTrigger>
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

              {/* Optional Adjustments */}
              <div className="space-y-2">
                <Label>Do you want to make optional adjustments?</Label>
                <Select value={showAdjustments ? "yes" : "no"} onValueChange={(val) => setShowAdjustments(val === "yes")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showAdjustments && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Optional Adjustments
                  </h3>
                  {/* Include your adjustment selects here similar to above */}
                </div>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 shadow-golf">
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
