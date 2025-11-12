import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";

export interface PlayerData {
  swingSpeed: number;
  handicap: number;
  avgDistance: number;
  playStyle: string;
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

  const calculatePlayability = (): PlayabilityResult => {
    const speed = parseFloat(swingSpeed);
    const hcp = parseFloat(handicap);
    const dist = parseFloat(avgDistance);
    
    // Playability Factor Formula (0-100 scale)
    // Higher score = needs more forgiving clubs
    let factor = 0;
    
    // Swing speed component (lower speed = higher playability need)
    if (speed < 85) factor += 35;
    else if (speed < 95) factor += 25;
    else if (speed < 105) factor += 15;
    else factor += 5;
    
    // Handicap component
    if (hcp >= 20) factor += 35;
    else if (hcp >= 15) factor += 25;
    else if (hcp >= 10) factor += 15;
    else if (hcp >= 5) factor += 10;
    else factor += 5;
    
    // Play style component
    if (playStyle === "aggressive") factor -= 10;
    else if (playStyle === "conservative") factor += 10;
    
    // Distance accuracy component
    const expectedDistance = speed * 2.5;
    const distanceRatio = dist / expectedDistance;
    if (distanceRatio < 0.85) factor += 10;
    else if (distanceRatio > 1.1) factor -= 5;
    
    // Cap between 0-100
    factor = Math.max(0, Math.min(100, factor));
    
    // Determine category and recommendations
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
    
    if (!swingSpeed || !handicap || !avgDistance || !playStyle) {
      return;
    }
    
    const playerData: PlayerData = {
      swingSpeed: parseFloat(swingSpeed),
      handicap: parseFloat(handicap),
      avgDistance: parseFloat(avgDistance),
      playStyle
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
              <div className="space-y-2">
                <Label htmlFor="swingSpeed" className="text-foreground font-medium">
                  Driver Swing Speed (mph)
                </Label>
                <Input
                  id="swingSpeed"
                  type="number"
                  placeholder="e.g., 95"
                  value={swingSpeed}
                  onChange={(e) => setSwingSpeed(e.target.value)}
                  className="border-input"
                  required
                  min="50"
                  max="130"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="handicap" className="text-foreground font-medium">
                  Handicap Index
                </Label>
                <Input
                  id="handicap"
                  type="number"
                  placeholder="e.g., 15"
                  value={handicap}
                  onChange={(e) => setHandicap(e.target.value)}
                  className="border-input"
                  required
                  min="0"
                  max="54"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avgDistance" className="text-foreground font-medium">
                  Average Driver Distance (yards)
                </Label>
                <Input
                  id="avgDistance"
                  type="number"
                  placeholder="e.g., 220"
                  value={avgDistance}
                  onChange={(e) => setAvgDistance(e.target.value)}
                  className="border-input"
                  required
                  min="100"
                  max="350"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="playStyle" className="text-foreground font-medium">
                  Play Style
                </Label>
                <Select value={playStyle} onValueChange={setPlayStyle} required>
                  <SelectTrigger id="playStyle" className="border-input">
                    <SelectValue placeholder="Select your play style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aggressive">Aggressive - Go for pins, take risks</SelectItem>
                    <SelectItem value="balanced">Balanced - Mix of strategy and aggression</SelectItem>
                    <SelectItem value="conservative">Conservative - Play safe, avoid trouble</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
