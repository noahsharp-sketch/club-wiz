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
  maxFactor: number;
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
    const speed = parseFloat(swingSpeed || "0");
    const hcp = parseFloat(handicap || "0");
    const dist = parseFloat(avgDistance || "0");

    let factor = 0;
    let maxFactor = 819; // Example maximum factor

    if (experience !== "beginner") {
      if (speed < 85) factor += 35;
      else if (speed < 95) factor += 25;
      else if (speed < 105) factor += 15;
      else factor += 5;

      if (experience === "expert") {
        if (hcp >= 20) factor += 35;
        else if (hcp >= 15) factor += 25;
        else if (hcp >= 10) factor += 15;
        else if (hcp >= 5) factor += 10;
        else factor += 5;
      }

      if (playStyle === "aggressive") factor -= 10;
      else if (playStyle === "conservative") factor += 10;

      if (dist > 0) {
        const expectedDistance = speed * 2.5;
        const ratio = dist / expectedDistance;
        if (ratio < 0.85) factor += 10;
        else if (ratio > 1.1) factor -= 5;
      }
    }

    factor = Math.round(factor);
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
      recommendations = ["Blade Irons", "Tour Driver", "Muscle Back Wedges"];
    }

    return { factor, maxFactor, category, recommendations };
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
          to_name: userEmail.split('@')[0],
          from_name: "Club Wizard",
          reply_to: userEmail,
          player_data: JSON.stringify(playerData, null, 2),
          playability_result: JSON.stringify(result, null, 2),
          mpf_score: result.factor,
          mpf_category: result.category,
          recommendations: result.recommendations.join("\n• "),
        },
        "cPjYPfJ7KtCFh9yUB"
      )
      .then(() => {
        alert("Your results have been emailed!");
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        alert("Failed to send email. Please check your email address or try again later.");
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

              {/* Conditional fields for intermediate/expert */}
              {experience !== "beginner" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="swingSpeed">Swing Speed (mph)</Label>
                    <Input id="swingSpeed" type="number" placeholder="95" value={swingSpeed} onChange={e => setSwingSpeed(e.target.value)} required />
                  </div>
                  {experience === "expert" && (
                    <div className="space-y-2">
                      <Label htmlFor="handicap">Handicap</Label>
                      <Input id="handicap" type="number" placeholder="12" value={handicap} onChange={e => setHandicap(e.target.value)} required />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="avgDistance">Average Distance (yards)</Label>
                    <Input id="avgDistance" type="number" placeholder="150" value={avgDistance} onChange={e => setAvgDistance(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Play Style</Label>
                    <Select value={playStyle} onValueChange={setPlayStyle} required>
                      <SelectTrigger className="border-input rounded-md shadow-sm hover:border-primary focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Select play style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Required fields always */}
              <div className="space-y-2">
                <Label>Player Height (inches)</Label>
                <Input type="number" value={playerHeight} onChange={e => setPlayerHeight(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Wrist to Floor (inches)</Label>
                <Input type="number" value={wristToFloor} onChange={e => setWristToFloor(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Hand Size</Label>
                <Select value={handSize} onValueChange={setHandSize} required>
                  <SelectTrigger><SelectValue placeholder="Select hand size" /></SelectTrigger>
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
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
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
                  <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="arthritis">Arthritis</SelectItem>
                    <SelectItem value="weak_grip">Weak Grip</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ball Flight Tendency */}
              {experience !== "beginner" && (
                <div className="space-y-2">
                  <Label>Ball Flight Tendency</Label>
                  <Select value={ballFlightTendency} onValueChange={setBallFlightTendency} required>
                    <SelectTrigger><SelectValue placeholder="Select ball flight" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="straight">Straight</SelectItem>
                      <SelectItem value="slice">Slice</SelectItem>
                      <SelectItem value="draw">Draw</SelectItem>
                      <SelectItem value="hook">Hook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Optional Adjustments */}
              <div className="space-y-2">
                <Label>Would you like to make optional adjustments?</Label>
                <Select value={useAdjustments} onValueChange={setUseAdjustments}>
                  <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {useAdjustments === "yes" && (
                <>
                  {/* Example optional adjustment */}
                  <div className="space-y-2">
                    <Label>Club Length Adjustment</Label>
                    <Select value={clubLengthAdjustment} onValueChange={setClubLengthAdjustment}>
                      <SelectTrigger><SelectValue placeholder="Select adjustment" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="+0.5">+0.5 inch</SelectItem>
                        <SelectItem value="-0.5">-0.5 inch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Email option */}
              <div className="space-y-2">
                <Label>Would you like your results emailed?</Label>
                <Select value={sendEmailOption} onValueChange={setSendEmailOption}>
                  <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
                {sendEmailOption === "yes" && (
                  <Input type="email" placeholder="Enter your email" value={userEmail} onChange={e => setUserEmail(e.target.value)} required />
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
