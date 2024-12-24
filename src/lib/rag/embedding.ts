import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

/**
 * Generate an embedding for a single text value.
 * @param text - The text to embed.
 * @param model - The embedding model to use. Default is "text-embedding-3-small".
 * @param maxRetries - Number of retries for embedding generation. Default is 2.
 * @param timeout - Timeout for the embedding process in milliseconds. Default is 5000ms.
 */
export const generateEmbedding = async (
  text: string,
  model: string = "text-embedding-3-small",
  maxRetries: number = 2,
  timeout: number = 5000
): Promise<number[]> => {
  if (!text || text.trim().length === 0) {
    throw new Error("Text cannot be empty for embedding generation.");
  }

  const { embedding } = await embed({
    model: openai.embedding(model),
    value: text,
    maxRetries,
    abortSignal: AbortSignal.timeout(timeout),
  });

  if (!embedding || embedding.length === 0) {
    throw new Error("Failed to generate embedding for the provided text.");
  }

  return embedding;
};

/**
 * Generate embeddings for multiple text values.
 * @param texts - An array of text values to embed.
 * @param model - The embedding model to use. Default is "text-embedding-3-small".
 * @param maxRetries - Number of retries for embedding generation. Default is 2.
 * @param timeout - Timeout for the embedding process in milliseconds. Default is 5000ms.
 */
export const generateEmbeddings = async (
  texts: string[],
  model: string = "text-embedding-3-small",
  maxRetries: number = 2,
  timeout: number = 5000
): Promise<number[][]> => {
  if (!texts || texts.length === 0) {
    throw new Error("Text array cannot be empty for embedding generation.");
  }

  const { embeddings } = await embedMany({
    model: openai.embedding(model),
    values: texts,
    maxRetries,
    abortSignal: AbortSignal.timeout(timeout),
  });

  if (!embeddings || embeddings.length === 0) {
    throw new Error("Failed to generate embeddings for the provided texts.");
  }

  return embeddings;
};
