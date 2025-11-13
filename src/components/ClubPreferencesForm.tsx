import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings } from "lucide-react";

export interface ClubPreferences {
  clubCondition: string;
  gripPreference: string;
  lookPreference: string;
  budgetRange: string;
  brandPreference: string;
}

interface ClubPreferencesFormProps {
  onSubmit: (preferences: ClubPreferences) => void;
}

export const ClubPreferencesForm = ({ onSubmit }: ClubPreferencesFormProps) => {
  const [clubCondition, setClubCondition] = useState("");
  const [gripPreference, setGripPreference] = useState("");
  const [lookPreference, setLookPreference] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [brandPreference, setBrandPreference] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clubCondition || !gripPreference || !lookPreference || !budgetRange || !brandPreference) {
      return;
    }

    onSubmit({
      clubCondition,
      gripPreference,
      lookPreference,
      budgetRange,
      brandPreference,
    });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-card-golf border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl text-foreground">
                Your Club Preferences
              </CardTitle>
              <CardDescription className="text-lg">
                Tell us more about what you're looking for in golf clubs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Club Condition */}
                <div className="space-y-3">
                  <Label htmlFor="clubCondition" className="text-base font-semibold text-foreground">
                    Club Condition
                  </Label>
                  <RadioGroup value={clubCondition} onValueChange={setClubCondition}>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new" className="flex-1 cursor-pointer">
                        <div className="font-medium text-foreground">New Clubs</div>
                        <div className="text-sm text-muted-foreground">Latest models with warranty</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="like-new" id="like-new" />
                      <Label htmlFor="like-new" className="flex-1 cursor-pointer">
                        <div className="font-medium text-foreground">Like New</div>
                        <div className="text-sm text-muted-foreground">Gently used, excellent condition</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="used" id="used" />
                      <Label htmlFor="used" className="flex-1 cursor-pointer">
                        <div className="font-medium text-foreground">Used</div>
                        <div className="text-sm text-muted-foreground">Good condition, signs of play</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any" className="flex-1 cursor-pointer">
                        <div className="font-medium text-foreground">No Preference</div>
                        <div className="text-sm text-muted-foreground">Open to all conditions</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Grip Preference */}
                <div className="space-y-3">
                  <Label htmlFor="gripPreference" className="text-base font-semibold text-foreground">
                    Grip Preference
                  </Label>
                  <Select value={gripPreference} onValueChange={setGripPreference}>
                    <SelectTrigger id="gripPreference" className="bg-card">
                      <SelectValue placeholder="Select your grip preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="standard-rubber">Standard Rubber Grips</SelectItem>
                      <SelectItem value="corded">Corded Grips (Better control in humidity)</SelectItem>
                      <SelectItem value="oversized">Oversized Grips (Larger diameter)</SelectItem>
                      <SelectItem value="midsize">Midsize Grips</SelectItem>
                      <SelectItem value="wrap">Wrap Style Grips</SelectItem>
                      <SelectItem value="no-preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Look/Appearance */}
                <div className="space-y-3">
                  <Label htmlFor="lookPreference" className="text-base font-semibold text-foreground">
                    Club Appearance
                  </Label>
                  <Select value={lookPreference} onValueChange={setLookPreference}>
                    <SelectTrigger id="lookPreference" className="bg-card">
                      <SelectValue placeholder="Select your preferred look" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="traditional">Traditional/Classic (Chrome, clean lines)</SelectItem>
                      <SelectItem value="modern">Modern/Aggressive (Matte, bold colors)</SelectItem>
                      <SelectItem value="minimal">Minimal/Clean (Simple, no distractions)</SelectItem>
                      <SelectItem value="premium">Premium/Luxury (High-end finishes)</SelectItem>
                      <SelectItem value="colorful">Colorful/Distinctive (Stand out designs)</SelectItem>
                      <SelectItem value="no-preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget Range */}
                <div className="space-y-3">
                  <Label htmlFor="budgetRange" className="text-base font-semibold text-foreground">
                    Budget Range
                  </Label>
                  <Select value={budgetRange} onValueChange={setBudgetRange}>
                    <SelectTrigger id="budgetRange" className="bg-card">
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="budget">Budget Friendly (Under $500)</SelectItem>
                      <SelectItem value="mid-range">Mid-Range ($500 - $1,500)</SelectItem>
                      <SelectItem value="premium">Premium ($1,500 - $3,000)</SelectItem>
                      <SelectItem value="luxury">Luxury ($3,000+)</SelectItem>
                      <SelectItem value="no-limit">No Budget Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Preference */}
                <div className="space-y-3">
                  <Label htmlFor="brandPreference" className="text-base font-semibold text-foreground">
                    Brand Preference
                  </Label>
                  <Select value={brandPreference} onValueChange={setBrandPreference}>
                    <SelectTrigger id="brandPreference" className="bg-card">
                      <SelectValue placeholder="Select brand preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="titleist">Titleist</SelectItem>
                      <SelectItem value="callaway">Callaway</SelectItem>
                      <SelectItem value="taylormade">TaylorMade</SelectItem>
                      <SelectItem value="ping">Ping</SelectItem>
                      <SelectItem value="mizuno">Mizuno</SelectItem>
                      <SelectItem value="cobra">Cobra</SelectItem>
                      <SelectItem value="pxg">PXG</SelectItem>
                      <SelectItem value="srixon">Srixon</SelectItem>
                      <SelectItem value="no-preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-lg py-6"
                  disabled={!clubCondition || !gripPreference || !lookPreference || !budgetRange || !brandPreference}
                >
                  Save Preferences
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
