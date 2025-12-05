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

export interface MPFBreakdownItem {
  label: string;
  value: number;
  description: string;
}

export interface PlayabilityResult {
  factor: number;
  category: string;
  recommendations: string[];
  breakdown: MPFBreakdownItem[];
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

  const calculatePlayability = (): PlayabilityResult => {
    // MPF calculation based on Maltby Playability Factor system (250-1000 scale)
    const speed = parseFloat(swingSpeed || "0");
    const hcp = parseFloat(handicap || "36");
    const dist = parseFloat(avgDistance || "0");
    const height = parseFloat(playerHeight || "70");
    const wrist = parseFloat(wristToFloor || "34");

    // Track breakdown of factors
    const breakdown: MPFBreakdownItem[] = [];

    // Base MPF primarily from handicap (higher handicap = higher MPF needed)
    const handicapBase = 350 + (hcp * 15);
    breakdown.push({
      label: "Handicap Base",
      value: handicapBase,
      description: `Starting point based on ${hcp} handicap`
    });

    let adjustments = 0;

    // Adjust for swing speed (slower swing = more forgiveness needed)
    let speedAdj = 0;
    if (speed < 85) {
      speedAdj = 100;
    } else if (speed < 95) {
      speedAdj = 50;
    } else if (speed > 105) {
      speedAdj = -50;
    }
    if (speedAdj !== 0) {
      adjustments += speedAdj;
      breakdown.push({
        label: "Swing Speed",
        value: speedAdj,
        description: speed < 95 ? "Slower swing benefits from more forgiveness" : "Faster swing allows less forgiving clubs"
      });
    }

    // Adjust for play style
    let styleAdj = 0;
    if (playStyle === "conservative") {
      styleAdj = 50;
    } else if (playStyle === "aggressive") {
      styleAdj = -30;
    }
    if (styleAdj !== 0) {
      adjustments += styleAdj;
      breakdown.push({
        label: "Play Style",
        value: styleAdj,
        description: playStyle === "conservative" ? "Conservative players benefit from forgiveness" : "Aggressive players can handle less forgiving clubs"
      });
    }

    // Adjust for distance efficiency
    const expectedDist = speed * 1.5;
    let distAdj = 0;
    if (dist < expectedDist * 0.85) {
      distAdj = 50;
      adjustments += distAdj;
      breakdown.push({
        label: "Distance Efficiency",
        value: distAdj,
        description: "Below expected distance suggests need for more forgiveness"
      });
    }

    // Adjust for ball flight tendency
    let flightAdj = 0;
    let flightDesc = "";
    if (ballFlightTendency === "slice") {
      flightAdj = 75;
      flightDesc = "Slice tendency benefits from draw-biased, forgiving clubs";
    } else if (ballFlightTendency === "hook") {
      flightAdj = 50;
      flightDesc = "Hook tendency needs some correction assistance";
    } else if (ballFlightTendency === "draw") {
      flightAdj = -20;
      flightDesc = "Controlled draw indicates solid ball striking";
    }
    if (flightAdj !== 0) {
      adjustments += flightAdj;
      breakdown.push({
        label: "Ball Flight",
        value: flightAdj,
        description: flightDesc
      });
    }

    // Adjust for hand grip issues
    let gripAdj = 0;
    let gripDesc = "";
    if (handgripIssues === "arthritis") {
      gripAdj = 100;
      gripDesc = "Arthritis requires lightweight, forgiving clubs";
    } else if (handgripIssues === "weak_grip") {
      gripAdj = 75;
      gripDesc = "Weak grip benefits from lighter swing weight";
    } else if (handgripIssues === "other") {
      gripAdj = 50;
      gripDesc = "Grip issues suggest need for more forgiveness";
    }
    if (gripAdj !== 0) {
      adjustments += gripAdj;
      breakdown.push({
        label: "Grip Issues",
        value: gripAdj,
        description: gripDesc
      });
    }

    // Adjust for gender
    if (gender === "female") {
      adjustments += 50;
      breakdown.push({
        label: "Gender",
        value: 50,
        description: "Women typically benefit from more forgiving, lighter clubs"
      });
    }

    // Adjust for hand size
    let handAdj = 0;
    if (handSize === "small") {
      handAdj = 25;
    } else if (handSize === "large") {
      handAdj = -15;
    }
    if (handAdj !== 0) {
      adjustments += handAdj;
      breakdown.push({
        label: "Hand Size",
        value: handAdj,
        description: handSize === "small" ? "Smaller hands benefit from more forgiveness" : "Larger hands provide better club control"
      });
    }

    // Calculate final factor
    const rawFactor = handicapBase + adjustments;
    const factor = Math.max(250, Math.min(1000, Math.round(rawFactor)));

    // Add total adjustments to breakdown if any
    if (adjustments !== 0) {
      breakdown.push({
        label: "Total Adjustments",
        value: adjustments,
        description: `Combined effect of all factors`
      });
    }

    // Calculate club length adjustment based on height and wrist-to-floor
    const heightDiff = height - 70;
    const wristDiff = wrist - 34;
    let lengthAdjustment = "";
    const totalAdjustment = (heightDiff * 0.5 + wristDiff) / 2;
    
    if (totalAdjustment >= 1.5) {
      lengthAdjustment = "+1.0 inch recommended";
    } else if (totalAdjustment >= 0.75) {
      lengthAdjustment = "+0.5 inch recommended";
    } else if (totalAdjustment <= -1.5) {
      lengthAdjustment = "-1.0 inch recommended";
    } else if (totalAdjustment <= -0.75) {
      lengthAdjustment = "-0.5 inch recommended";
    }

    // Determine category based on MPF
    let category: string;
    let recommendations: string[];

    if (factor <= 450) {
      category = "Tour Blades";
      recommendations = [
        "Mizuno MP-20 MB",
        "Titleist 620 MB",
        "Srixon Z-Forged"
      ];
    } else if (factor <= 600) {
      category = "Players Irons";
      recommendations = [
        "Titleist T100",
        "TaylorMade P7MC",
        "Callaway Apex Pro"
      ];
    } else if (factor <= 800) {
      category = "Super Game Improvement";
      recommendations = [
        "Callaway Paradym",
        "TaylorMade Stealth",
        "Ping G430"
      ];
    } else {
      category = "Ultra Game Improvement";
      recommendations = [
        "Cleveland Launcher XL Halo",
        "Callaway Rogue ST Max OS",
        "Cobra Air-X"
      ];
    }

    // Add fitting notes based on player characteristics
    if (lengthAdjustment) {
      recommendations.push(`Club Length: ${lengthAdjustment}`);
    }
    if (handgripIssues === "arthritis" || handgripIssues === "weak_grip") {
      recommendations.push("Consider graphite shafts for reduced weight");
    }
    if (handSize === "large") {
      recommendations.push("Midsize or Jumbo grips recommended");
    } else if (handSize === "small") {
      recommendations.push("Undersize grips recommended");
    }

    return { factor, category, recommendations, breakdown };
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
