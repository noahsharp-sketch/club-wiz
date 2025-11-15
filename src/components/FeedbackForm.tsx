"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

interface FeedbackFormProps {
  onComplete?: () => void;
}

export const FeedbackForm = ({ onComplete }: FeedbackFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      await emailjs.send(
        "service_9h83hig", // your service ID
        "template_88vezno", // your template ID
        {
          to_email: "Club-wizFinder@outlook.com", // your receiving email
          from_name: name || "Anonymous",
          rating: rating.toString(),
          feedback: feedbackText || "No additional feedback",
        },
        "cPjYPfJ7KtCFh9yUB" // your public key
      );

      toast({
        title: "Thank You!",
        description: "Your feedback has been sent successfully.",
      });

      setRating(0);
      setHoveredRating(0);
      setName("");
      setFeedbackText("");

      if (onComplete) onComplete();
    } catch (error) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description: "There was an error sending your feedback. Please try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="shadow-card-golf">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-foreground">How was your experience?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-4">
            <Label className="text-center block text-foreground font-medium">Rate your experience</Label>
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
                      value <= (hoveredRating || rating) ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Optional Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">
              Name (optional)
            </Label>
            <input
              id="name"
              type="text"
              placeholder="Your name (or leave blank)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-input w-full rounded-md px-3 py-2"
            />
          </div>

          {/* Optional Feedback */}
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

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
