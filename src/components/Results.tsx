import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Download } from "lucide-react";
import { PlayabilityResult, PlayerData } from "./ClubFinderForm";
import { exportToPDF } from "@/lib/pdfExport";
import { useToast } from "@/hooks/use-toast";

interface ResultsProps {
  playerData: PlayerData;
  result: PlayabilityResult;
}

export const Results = ({ playerData, result }: ResultsProps) => {
  const { toast } = useToast();

  const handleExportPDF = () => {
    try {
      exportToPDF(playerData, result);
      toast({
        title: "PDF Downloaded!",
        description: "Your golf playability report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating your PDF report.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Your Personalized Results
            </h2>
            <p className="text-xl text-muted-foreground">
              Based on your unique playing profile
            </p>
            <Button 
              onClick={handleExportPDF}
              className="mt-6"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Export as PDF
            </Button>
          </div>

          {/* Playability Factor Score */}
          <Card className="mb-8 shadow-golf border-primary/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-foreground">Your Playability Factor</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative inline-block">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-golf">
                  <div className="w-40 h-40 rounded-full bg-card flex flex-col items-center justify-center">
                    <span className="text-6xl font-bold text-primary">{result.factor}</span>
                    <span className="text-sm text-muted-foreground mt-1">out of 100</span>
                  </div>
                </div>
              </div>
              <Badge className="mt-6 text-lg px-6 py-2 bg-primary text-primary-foreground">
                {result.category}
              </Badge>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Swing Speed</p>
                  <p className="text-xl font-bold text-foreground">{playerData.swingSpeed} mph</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Handicap</p>
                  <p className="text-xl font-bold text-foreground">{playerData.handicap}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg Distance</p>
                  <p className="text-xl font-bold text-foreground">{playerData.avgDistance} yds</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Play Style</p>
                  <p className="text-xl font-bold text-foreground capitalize">{playerData.playStyle}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="shadow-card-golf">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                Recommended Golf Clubs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Based on your {result.category.toLowerCase()} playability factor, we recommend the following club types:
              </p>
              <ul className="space-y-4">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{rec}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="font-bold text-foreground mb-2">Pro Tip</h4>
                <p className="text-sm text-muted-foreground">
                  {result.factor >= 70 
                    ? "Focus on forgiveness and distance. Consider getting fitted at a local pro shop to maximize your game improvement potential."
                    : result.factor >= 50
                    ? "You're in a great position to balance forgiveness with workability. A professional fitting can help you fine-tune your set makeup."
                    : result.factor >= 30
                    ? "Your skill level allows for more precise clubs. Consider a mix of players irons with strategic forgiveness in long irons."
                    : "Tour-level equipment demands consistency. Work with a professional fitter to optimize shaft selection and club specifications."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
