import { generateEmbedding } from "@/lib/rag/embedding";
import { queryVectorDB, upsertVector } from "@/lib/rag/vector";

type Message = {
  role: string;
  content: string | object;
};

// Save messages to KV
export async function saveMessagesToKV(
  kv: KVNamespace,
  threadId: string,
  messages: Message[],
): Promise<void> {
  await kv.put(threadId, JSON.stringify(messages));
}

// Fetch relevant context
export async function fetchRelevantContext(
  coreMessages: Message[],
): Promise<string> {
  const lastUserMessage = coreMessages.find(
    (msg) => msg.role === "user",
  )?.content;
  if (!lastUserMessage) return "";

  const textContent =
    typeof lastUserMessage === "string"
      ? lastUserMessage.replace(/\\s+/g, " ").trim()
      : JSON.stringify(lastUserMessage, null, 2).replace(/\\s+/g, " ").trim();

  const queryVector = await generateEmbedding(textContent);
  const ragResults = await queryVectorDB(queryVector, 5, "default");

  return ragResults
    .map((result) => result.metadata?.content || "")
    .join(" ")
    .replace(/\\n/g, " ")
    .replace(/\\s+/g, " ")
    .trim();
}

// Prepare system instructions
export function prepareSystemInstructions(context: string): string {
  return `
    You are a flexible AI assistant specializing in healthcare.
    You can:
      - Answer patient-specific queries if data is available in the provided context.
      - Provide general healthcare advice for questions outside the provided context.
    Guidelines:
      - Use the following context to provide responses:
        ${context}
      - If no relevant context is available, provide general healthcare advice based on your knowledge.
      - Keep responses concise, accurate, and user-friendly.
      - Reuse patient information from previous interactions when possible.
  `;
}

// Handle AI response
export async function handleAIResponse(params: {
  threadId: string;
  messages: Message[];
  response: { messages: Message[] };
}): Promise<void> {
  const { threadId, messages, response } = params;

  const lastUserMessage = messages.find((msg) => msg.role === "user")?.content;
  if (lastUserMessage && response.messages.length > 0) {
    const responseText = response.messages
      .map((msg) =>
        typeof msg.content === "object"
          ? JSON.stringify(msg.content)
          : msg.content,
      )
      .join(" ")
      .replace(/\\s+/g, " ");

    const combinedContent = JSON.stringify({
      userMessage: lastUserMessage.toString().replace(/\\s+/g, " "),
      aiResponse: responseText,
    });

    const newEmbedding = await generateEmbedding(combinedContent);
    await upsertVector(
      `thread-${threadId}-${Date.now()}`,
      newEmbedding,
      { content: combinedContent, threadId },
      "default",
    );
  }
}
