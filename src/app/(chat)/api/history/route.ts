// ** Import Cloudflare-specific utilities
import { getRequestContext } from "@cloudflare/next-on-pages";

// Specify runtime environment
export const runtime = "edge";

export async function POST(request: Request) {
  try {
    // Get the KV binding from the request context
    const kv = getRequestContext()?.env?.HEALTHCARE_AI_CACHE;
    if (!kv) {
      return new Response(
        JSON.stringify({ error: "KV binding not found" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the incoming request body
    const { threadId }: { threadId: string | null } = await request.json();

    // Validate the threadId
    if (!threadId) {
      return new Response(
        JSON.stringify({ error: "Thread ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch messages from KV for the specified thread
    const kvData = await kv.get(threadId);
    const messages = kvData ? JSON.parse(kvData) : [];

    // Return the messages as a JSON response
    return new Response(JSON.stringify({ success: true, messages }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // Log and handle errors gracefully
    console.error("Error processing POST request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error?.message || "An unknown error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
