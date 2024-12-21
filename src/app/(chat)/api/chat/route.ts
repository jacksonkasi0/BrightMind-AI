import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { geminiFlashModel } from "@/ai";
import { getWeather } from "@/tools/weather/weather";

export async function POST(request: Request) {
  try {
    const { messages }: { messages: Array<Message> } = await request.json();

    const coreMessages = convertToCoreMessages(messages).filter(
      (message) => message.content.length > 0
    );

    const result = await streamText({
      model: geminiFlashModel,
      system: `
        - You can answer general questions and provide responses related to weather.
        - Keep responses concise and accurate.
        - If the question is weather-related, use the getWeather tool by providing latitude and longitude coordinates.
        - For other questions, provide an appropriate AI-generated response.
      `,
      messages: coreMessages,
      tools: {
        getWeather
      },
      experimental_telemetry: {
        isEnabled: true,
        functionId: "stream-text-weather",
      },
    });

    return result.toDataStreamResponse({});
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
