import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Target, TrendingUp, Award } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Calculator,
      title: "Enter Your Data",
      description: "Provide your swing speed, handicap, average distance, and playing style to create your profile."
    },
    {
      icon: Target,
      title: "Calculate Playability",
      description: "Our algorithm analyzes your data to determine your personalized playability factor score."
    },
    {
      icon: TrendingUp,
      title: "Get Recommendations",
      description: "Receive club suggestions optimized for your specific playability factor and skill level."
    },
    {
      icon: Award,
      title: "Improve Your Game",
      description: "Play with confidence using clubs perfectly matched to your abilities and style."
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our playability factor system uses advanced algorithms to match you with the perfect golf clubs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card border-border shadow-card-golf hover:shadow-golf transition-all hover:-translate-y-1"
            >
              <CardHeader>
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-golf">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl text-foreground">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
