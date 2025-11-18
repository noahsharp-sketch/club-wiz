import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  rating: number;
  name?: string;
  feedbackText?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rating, name, feedbackText }: FeedbackRequest = await req.json();

    console.log("Processing feedback submission:", { rating, name });

    const stars = "⭐".repeat(rating);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Golf Club Finder Feedback <onboarding@resend.dev>",
        to: ["admin@yourdomain.com"], // Replace with your admin email
        subject: `New Feedback: ${stars} (${rating}/5)`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2C5F2D;">New User Feedback Received</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 24px; margin: 0;">Rating: ${stars}</p>
            <p style="font-size: 18px; color: #666; margin: 5px 0 0 0;">${rating} out of 5 stars</p>
          </div>

          ${name ? `<p><strong>From:</strong> ${name}</p>` : "<p><strong>From:</strong> Anonymous</p>"}
          
          ${
            feedbackText
              ? `
            <div style="margin-top: 20px;">
              <h3 style="color: #2C5F2D;">Feedback Message:</h3>
              <div style="background: #fff; padding: 15px; border-left: 4px solid #2C5F2D;">
                ${feedbackText.replace(/\n/g, "<br>")}
              </div>
            </div>
          `
              : ""
          }

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>Received on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error(`Resend API error: ${await emailResponse.text()}`);
    }

    const emailData = await emailResponse.json();

    console.log("Feedback email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-feedback function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
