const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface GenerateImageRequest {
  prompt: string;
  aspect_ratio: string;
  output_format: string;
  safety_filter_level: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { prompt, aspect_ratio, output_format, safety_filter_level }: GenerateImageRequest = await req.json();

    if (!prompt?.trim()) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get Replicate API token from environment
    const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
    
    if (!REPLICATE_API_TOKEN) {
      return new Response(
        JSON.stringify({ 
          error: "REPLICATE_API_TOKEN environment variable is missing. Please add REPLICATE_API_TOKEN to your Supabase Edge Functions environment variables." 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log('Generating AI image with Replicate');
    console.log('Prompt:', prompt);
    console.log('Aspect ratio:', aspect_ratio);
    console.log('Output format:', output_format);
    console.log('Safety filter level:', safety_filter_level);
    
    // Call Replicate API
    const response = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: "google/imagen-3",
          input: {
            prompt: prompt,
            aspect_ratio: aspect_ratio || "1:1",
            output_format: output_format || "png",
            safety_filter_level: safety_filter_level || "block_medium_and_above"
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Replicate API Error:', errorText);
      
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid Replicate API token. Please check your REPLICATE_API_TOKEN." 
          }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded. Please wait a moment and try again." 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `Replicate API Error: ${errorText}` }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const prediction = await response.json();
    console.log('Prediction created:', prediction.id);

    // Poll for completion
    let result = prediction;
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    while (result.status === "starting" || result.status === "processing") {
      if (attempts >= maxAttempts) {
        return new Response(
          JSON.stringify({ error: "Image generation timed out. Please try again." }),
          {
            status: 408,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      attempts++;

      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            "Authorization": `Token ${REPLICATE_API_TOKEN}`,
          },
        }
      );

      if (!statusResponse.ok) {
        throw new Error(`Failed to check prediction status: ${statusResponse.statusText}`);
      }

      result = await statusResponse.json();
      console.log(`Attempt ${attempts}: Status is ${result.status}`);
    }

    if (result.status === "failed") {
      console.error('Prediction failed:', result.error);
      return new Response(
        JSON.stringify({ error: result.error || "Image generation failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (result.status === "succeeded" && result.output) {
      console.log('Successfully generated image:', result.output);
      
      return new Response(
        JSON.stringify({ 
          image_url: result.output,
          service: "replicate",
          model: "google/imagen-3",
          prompt: prompt,
          aspect_ratio: aspect_ratio,
          output_format: output_format,
          safety_filter_level: safety_filter_level,
          prediction_id: result.id
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unexpected prediction status: " + result.status }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error('Edge Function Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error during image generation" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});