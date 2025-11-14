import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeedbackFormProps {
  calculationId: string | null;
  userId: string | null;
  onComplete: () => void;
}

export const FeedbackForm = ({ calculationId, userId, onComplete }: FeedbackFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [name, setName] = useState(""); // Optional name
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const senderName = name.trim() || "Anonymous";
    const subject = encodeURIComponent("Club Finder Feedback");
    const body = encodeURIComponent(
      `Name: ${senderName}\nRating: ${rating}\nCalculation ID: ${calculationId || "N/A"}\nUser ID: ${userId || "N/A"}\nFeedback: ${feedbackText || "No additional feedback"}`
    );

    // Open default email client with pre-filled email
    window.location.href = `mailto:Club-wizFinder@outlook.com?subject=${subject}&body=${body}`;

    setIsSubmitting(false);

    toast({
      title: "Feedback Prepared",
      description: "Your feedback is ready to be sent via your email client.",
    });

    setRating(0);
    setHoveredRating(0);
    setFeedbackText("");
    setName("");
    onComplete();
  };

  return (
    <Card className="shadow-card-golf">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-foreground">
          How was your experience?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-center block text-foreground font-medium">
              Rate your experience
            </Label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      value <= (hoveredRating || rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Optional Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">
              Your Name (optional)
            </Label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous if left blank"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-foreground font-medium">
              Additional feedback (optional)
            </Label>
            <Textarea
              id="feedback"
              placeholder="Tell us more about your experience..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Preparing..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
