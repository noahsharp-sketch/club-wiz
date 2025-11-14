import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { PlayabilityResult } from "./ClubFinderForm";

interface MarketplaceLinksProps {
  result: PlayabilityResult;
}

export const MarketplaceLinks = ({ result }: MarketplaceLinksProps) => {
  // Generate UTM parameters based on playability data
  const getUTMParams = (source: string) => {
    return `utm_source=clubfinder&utm_medium=referral&utm_campaign=${result.category.toLowerCase().replace(/\s+/g, '-')}`;
  };

  // Get the first two recommendations for marketplace filtering
  const primaryRecs = result.recommendations.slice(0, 2);
  const searchQuery = encodeURIComponent(primaryRecs.join(" OR "));

  const marketplaceLinks = [
    {
      title: "Used Club Sets",
      description: "Find quality used clubs matching your profile",
      url: `https://www.2ndswing.com/search?q=${searchQuery}&${getUTMParams('2ndswing')}`,
      badge: "Best Value"
    },
    {
      title: "New Club Sets",
      description: "Browse the latest club models",
      url: `https://www.pgatoursuperstore.com/search?q=${searchQuery}&${getUTMParams('pgatour')}`,
      badge: "Latest Models"
    },
    {
      title: "Custom Shafts & Grips",
      description: "Personalize your clubs with custom specifications",
      url: `https://www.pgatoursuperstore.com/custom-fitting?${getUTMParams('pgatour-custom')}`,
      badge: "Custom Fit"
    }
  ];

  return (
    <Card className="shadow-card-golf border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground flex items-center">
          <ExternalLink className="mr-2 h-6 w-6 text-primary" />
          Shop Recommended Clubs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          Based on your <span className="font-semibold">{result.category}</span> playability profile, 
          here are curated marketplace links to find your ideal clubs:
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {marketplaceLinks.map((link, index) => (
            <div key={index} className="relative">
              <Button
                asChild
                variant="outline"
                className="w-full h-auto p-6 flex flex-col items-start gap-2 hover:bg-primary/5 hover:border-primary transition-all"
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-foreground">{link.title}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {link.badge}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground text-left">
                    {link.description}
                  </span>
                  <ExternalLink className="h-4 w-4 text-primary ml-auto" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
