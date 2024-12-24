import { Index } from "@upstash/vector";

// Initialize Upstash Vector Index
const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

/**
 * Query the vector database for relevant context.
 * @param queryVector - The vector representation of the query.
 * @param topK - The number of top results to retrieve.
 * @param namespace - The namespace to query.
 */
export const queryVectorDB = async (
  queryVector: number[],
  topK: number = 5,
  namespace: string = "default"
) => {
  const results = await vectorIndex.namespace(namespace).query({
    vector: queryVector,
    topK,
    includeMetadata: true,
    includeVectors: false,
  });
  return results;
};

/**
 * Add a new vector and metadata to the vector database.
 * @param id - Unique identifier for the vector.
 * @param vector - The vector to add.
 * @param metadata - Metadata associated with the vector.
 * @param namespace - The namespace to upsert the vector.
 */
export const upsertVector = async (
  id: string,
  vector: number[],
  metadata: Record<string, unknown> = {},
  namespace: string = "default"
) => {
  await vectorIndex.namespace(namespace).upsert([
    {
      id,
      vector,
      metadata,
    },
  ]);
};

/**
 * Fetch a specific vector by its ID.
 * @param id - The ID of the vector.
 * @param namespace - The namespace where the vector resides.
 */
export const fetchVectorByID = async (
  id: string,
  namespace: string = "default"
) => {
  const result = await vectorIndex.namespace(namespace).fetch([id], {
    includeMetadata: true,
    includeVectors: true,
  });
  return result;
};

/**
 * Delete a vector by its ID.
 * @param id - The ID of the vector.
 * @param namespace - The namespace to delete the vector from.
 */
export const deleteVectorByID = async (
  id: string,
  namespace: string = "default"
) => {
  const result = await vectorIndex.namespace(namespace).delete([id]);
  return result;
};
