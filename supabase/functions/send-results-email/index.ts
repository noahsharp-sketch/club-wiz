import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResultsEmailRequest {
  email: string;
  playerData: any;
  result: any;
  preferences: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, playerData, result, preferences }: ResultsEmailRequest = await req.json();

    console.log("Sending results email to:", email);

    const preferencesSection = preferences
      ? `
      <h3>Your Club Preferences</h3>
      <ul>
        <li><strong>Brand:</strong> ${preferences.brandPreference || "Any"}</li>
        <li><strong>Budget:</strong> ${preferences.budgetRange || "Not specified"}</li>
        <li><strong>Condition:</strong> ${preferences.clubCondition || "Not specified"}</li>
        <li><strong>Look:</strong> ${preferences.lookPreference || "Not specified"}</li>
        <li><strong>Shaft:</strong> ${preferences.shaftPreference || "Not specified"}</li>
        <li><strong>Grip:</strong> ${preferences.gripPreference || "Not specified"}</li>
      </ul>
    `
      : "";

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Golf Club Finder <onboarding@resend.dev>",
        to: [email],
        subject: "Your Golf Club Recommendations",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2C5F2D;">Your Playability Factor Results</h1>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2C5F2D;">Playability Factor: ${result.factor.toFixed(1)}</h2>
            <p style="font-size: 18px;"><strong>Category:</strong> ${result.category}</p>
          </div>

          <h3>Your Golf Profile</h3>
          <ul>
            <li><strong>Swing Speed:</strong> ${playerData.swingSpeed} mph</li>
            <li><strong>Handicap:</strong> ${playerData.handicap}</li>
            <li><strong>Average Distance:</strong> ${playerData.avgDistance} yards</li>
            <li><strong>Play Style:</strong> ${playerData.playStyle}</li>
            ${playerData.gender ? `<li><strong>Gender:</strong> ${playerData.gender}</li>` : ""}
          </ul>

          <h3>Recommended Clubs</h3>
          <ul>
            ${result.recommendations.map((rec: string) => `<li>${rec}</li>`).join("")}
          </ul>

          ${preferencesSection}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>Thank you for using Golf Club Finder!</p>
            <p>These recommendations are based on the Maltby Playability Factor (MPF) system.</p>
          </div>
        </div>
      `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error(`Resend API error: ${await emailResponse.text()}`);
    }

    const emailData = await emailResponse.json();

    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-results-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
