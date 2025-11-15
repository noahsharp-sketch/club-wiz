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

  const [clubLengthAdjustment, setClubLengthAdjustment] = useState("standard");
  const [lieAngleAdjustment, setLieAngleAdjustment] = useState("standard");
  const [shaftPreference, setShaftPreference] = useState("steel");
  const [swingWeightAdjustment, setSwingWeightAdjustment] = useState("standard");
  const [gripSizes, setGripSizes] = useState("standard");

  const [showAdjustments, setShowAdjustments] = useState(false);

  const calculatePlayability = (): PlayabilityResult => {
    const speed = parseFloat(swingSpeed) || 0;
    const hcp = parseFloat(handicap) || 0;
    const dist = parseFloat(avgDistance) || 0;

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
      recommendations = [
        "Game Improvement Irons (e.g., TaylorMade Stealth, Callaway Rogue ST Max)",
        "Oversized Driver with High MOI (460cc head)",
        "Hybrid Clubs (4H, 5H to replace long irons)",
        "Perimeter-weighted Cavity Back Irons",
        "High-loft Driver (10.5° - 12°)",
      ];
    } else if (factor >= 50) {
      category = "Moderate Forgiveness";
      recommendations = [
        "Players Distance Irons (e.g., Ping G430, Mizuno JPX)",
        "Adjustable Driver (9.5° - 10.5° loft)",
        "One or Two Hybrids (3H, 4H)",
        "Progressive Set Design (cavity backs to muscle)",
        "Fairway Woods with Rail Design",
      ];
    } else if (factor >= 30) {
      category = "Low Forgiveness";
      recommendations = [
        "Players Irons (e.g., Titleist T100, Mizuno MP)",
        "Low-spin Driver (8.5° - 9.5° loft)",
        "Blade-style Short Irons",
        "Traditional 3-wood and 5-wood",
        "Forged Cavity Back Long Irons",
      ];
    } else {
      category = "Tour Level";
      recommendations = [
        "Blade Irons (e.g., Titleist MB, Mizuno MP-20)",
        "Low-loft Driver with Tour Shaft (8° - 9°)",
        "Classic Muscle Back Design",
        "Tour-caliber Woods and Hybrids",
        "High-control Wedge Setup (52°, 56°, 60°)",
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
      playerHeight: playerHeight ? parseFloat(playerHeight) : undefined,
      wristToFloor: wristToFloor ? parseFloat(wristToFloor) : undefined,
      handSize: handSize || undefined,
      gender: gender || undefined,
      handgripIssues: handgripIssues || undefined,
      ballFlightTendency: experience === "expert" ? ballFlightTendency : undefined,
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
    <section className="py-20 bg-background">
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
              <div className="space-y-4">
                <Label htmlFor="experience">Experience Level</Label>
                <Select value={experience} onValueChange={setExperience}>
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

              {/* Basic Playing Info */}
              {experience !== "beginner" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Basic Playing Information
                  </h3>
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
                      min="100"
                      max="350"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swingSpeed">Driver Swing Speed (mph)</Label>
                    <Input
                      id="swingSpeed"
                      type="number"
                      placeholder="e.g., 95"
                      value={swingSpeed}
                      onChange={(e) => setSwingSpeed(e.target.value)}
                      min="50"
                      max="130"
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
                      placeholder="e.g., 34"
                      value={wristToFloor}
                      onChange={(e) => setWristToFloor(e.target.value)}
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
                  {experience === "expert" && (
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

              {/* Optional Adjustments Toggle */}
              <div className="space-y-4">
                <Label>Do you want to make optional adjustments?</Label>
                <Select value={showAdjustments ? "yes" : "no"} onValueChange={(val) => setShowAdjustments(val === "yes")}>
                  <SelectTrigger className="border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Optional Adjustments */}
              {showAdjustments && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    Optional Adjustments
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Club Length */}
                    <div className="space-y-2">
                      <Label htmlFor="clubLengthAdjustment">Club Length Adjustment</Label>
                      <Select value={clubLengthAdjustment} onValueChange={setClubLengthAdjustment}>
                        <SelectTrigger id="clubLengthAdjustment" className="border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="+1/4">+1/4 inch</SelectItem>
                          <SelectItem value="+1/2">+1/2 inch</SelectItem>
                          <SelectItem value="-1/4">-1/4 inch</SelectItem>
                          <SelectItem value="-1/2">-1/2 inch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Lie Angle */}
                    <div className="space-y-2">
                      <Label htmlFor="lieAngleAdjustment">Lie Angle Adjustment</Label>
                      <Select value={lieAngleAdjustment} onValueChange={setLieAngleAdjustment}>
                        <SelectTrigger id="lieAngleAdjustment" className="border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="upright">Upright (+2°)</SelectItem>
                          <SelectItem value="flat">Flat (-2°)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Shaft Preference */}
                    <div className="space-y-2">
                      <Label htmlFor="shaftPreference">Shaft Preference</Label>
                      <Select value={shaftPreference} onValueChange={setShaftPreference}>
                        <SelectTrigger id="shaftPreference" className="border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="steel">Steel</SelectItem>
                          <SelectItem value="graphite">Graphite</SelectItem>
                          <SelectItem value="iron">Iron (Specific)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Swing Weight */}
                    <div className="space-y-2">
                      <Label htmlFor="swingWeightAdjustment">Swing Weight Adjustment</Label>
                      <Select value={swingWeightAdjustment} onValueChange={setSwingWeightAdjustment}>
                        <SelectTrigger id="swingWeightAdjustment" className="border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="heavier">Heavier Head</SelectItem>
                          <SelectItem value="lighter">Lighter Head</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Grip Sizes */}
                    <div className="space-y-2">
                      <Label htmlFor="gripSizes">Grip Size Adjustment</Label>
                      <Select value={gripSizes} onValueChange={setGripSizes}>
                        <SelectTrigger id="gripSizes" className="border-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="+1/64">+1/64 (Midsize)</SelectItem>
                          <SelectItem value="+1/32">+1/32 (Oversize)</SelectItem>
                          <SelectItem value="-1/64">-1/64 (Undersize)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
