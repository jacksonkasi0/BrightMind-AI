// ** import cf
import { getRequestContext } from "@cloudflare/next-on-pages";

// ** import third-party libraries
import { convertToCoreMessages, Message, streamText } from "ai";

// ** import models
import { geminiFlashModel } from "@/ai";

// ** import tools
import { getWeather } from "@/tools/weather/weather";

// ** import AI(RAG) utilities
import {
  fetchRelevantContext,
  handleAIResponse,
  prepareSystemInstructions,
} from "@/lib/aiUtils";

// Specify runtime environment
export const runtime = "edge";

export async function POST(request: Request) {
  try {
    // Cloudflare KV binding
    const kv = getRequestContext().env.PERSONAL_ASSISTANT;

    // Parse the incoming request body
    const {
      messages,
      threadId,
    }: { messages: Array<Message>; threadId: string } = await request.json();

    if (!threadId) {
      throw new Error("Thread ID is required");
    }

    // Convert and sanitize messages to core format, filtering out empty content
    const coreMessages = convertToCoreMessages(messages).filter(
      (message) => message.content.length > 0,
    );

    // Save messages to KV for thread persistence
    await kv.put(threadId, JSON.stringify(coreMessages));

    const context = await fetchRelevantContext(coreMessages);
    console.log("Context:", context);

    const systemInstructions = prepareSystemInstructions(context);

    // Stream text response from the AI model
    const result = await streamText({
      model: geminiFlashModel,
      system: systemInstructions,
      messages: coreMessages,
      tools: {
        getWeather, // Weather-fetching utility
      },
      onFinish: async ({ response }) => {
        const allMessages = [...messages, ...response.messages];

        // Save messages to KV for thread persistence
        await kv.put(threadId, JSON.stringify(allMessages));

        await handleAIResponse({
          threadId,
          messages,
          response,
        });
      },
      experimental_telemetry: {
        isEnabled: true,
        functionId: "stream-text",
      },
    });

    // Return the streamed AI response
    return result.toDataStreamResponse({});
  } catch (error: any) {
    // Log and handle errors gracefully
    console.error("Error processing POST request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error?.message || error,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
