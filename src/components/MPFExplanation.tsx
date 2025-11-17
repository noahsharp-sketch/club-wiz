import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export const MPFExplanation = () => {
  return (
    <Card className="shadow-card-golf mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground flex items-center gap-2">
          <Info className="h-6 w-6 text-primary" />
          Understanding MPF (Maltby Playability Factor)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">What is MPF?</h3>
          <p className="text-muted-foreground">
            The Maltby Playability Factor (MPF) is a scientific measurement system that rates golf clubs 
            based on how forgiving they are. The system was developed by golf club designer Ralph Maltby 
            and measures factors like Moment of Inertia (MOI), Center of Gravity (CG) position, and other 
            physical characteristics that affect playability.
          </p>
        </div>

        <div className="bg-secondary/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-3">MPF Categories</h3>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground">Tour Blades (MPF 150-250)</p>
              <p className="text-sm text-muted-foreground">
                For expert players with consistent swings. Minimal forgiveness, maximum workability. 
                Best for handicaps 0-5.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Players Irons (MPF 250-350)</p>
              <p className="text-sm text-muted-foreground">
                For skilled players who want some forgiveness. Good balance of feel and playability. 
                Best for handicaps 5-15.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Super Game Improvement (MPF 350-450)</p>
              <p className="text-sm text-muted-foreground">
                Highly forgiving with large sweet spots. Ideal for mid to high handicappers. 
                Best for handicaps 15-25.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Ultra Game Improvement (MPF 450+)</p>
              <p className="text-sm text-muted-foreground">
                Maximum forgiveness and ease of use. Designed for beginners and high handicappers. 
                Best for handicaps 25+.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">How Your Swing Affects MPF Selection</h3>
          <div className="space-y-2 text-muted-foreground">
            <p><strong className="text-foreground">Swing Speed:</strong> Slower swing speeds benefit from higher MPF clubs that help generate distance and forgiveness.</p>
            <p><strong className="text-foreground">Handicap:</strong> Higher handicaps indicate less consistency, requiring more forgiving clubs with higher MPF ratings.</p>
            <p><strong className="text-foreground">Play Style:</strong> Aggressive players often need more forgiveness, while technical players may prefer lower MPF for shot shaping.</p>
            <p><strong className="text-foreground">Distance Consistency:</strong> Inconsistent distances indicate a need for more forgiving clubs with higher MOI.</p>
          </div>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <p className="text-sm text-foreground">
            <strong>Pro Tip:</strong> The MPF system is based on measurable physical characteristics, 
            not marketing claims. A higher MPF doesn't mean "better" - it means more forgiving. 
            Choose clubs that match your skill level for optimal performance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
