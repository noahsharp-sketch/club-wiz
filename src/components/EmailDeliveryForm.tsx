import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlayerData, PlayabilityResult } from "./ClubFinderForm";
import { ClubPreferences } from "./ClubPreferencesForm";

interface EmailDeliveryFormProps {
  playerData: PlayerData;
  result: PlayabilityResult;
  preferences: ClubPreferences | null;
  userEmail?: string;
  onComplete: () => void;
}

export const EmailDeliveryForm = ({ 
  playerData, 
  result, 
  preferences,
  userEmail, 
  onComplete 
}: EmailDeliveryFormProps) => {
  const [email, setEmail] = useState(userEmail || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-results-email', {
        body: {
          email,
          playerData,
          result,
          preferences,
        },
      });

      if (error) throw error;

      toast({
        title: "Email Sent!",
        description: `Your results have been sent to ${email}`,
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "There was an error sending your results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-card-golf">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          Email Your Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-muted-foreground text-center">
            {userEmail 
              ? "Would you like us to email your results to your account email?" 
              : "Enter your email address to receive your personalized club recommendations."}
          </p>

          {!userEmail && (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Results"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onComplete}
            >
              Skip
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
