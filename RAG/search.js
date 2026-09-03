import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config({
  path: new URL("./.env", import.meta.url),
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-embedding-001",
});

const pinecone = new PineconeClient();

const pineconeIndex = pinecone.Index(
  process.env.PINECONE_INDEX_NAME
);

const vectorStore = new PineconeStore(embeddings, {
  pineconeIndex,
});

export async function searchDocuments(query) {
  const results =
    await vectorStore.similaritySearchWithScore(query, 4);

  console.log("RAG RESULTS:", results);
  console.log("METADATA:", results[0][0].metadata);
  return results
    .map(([doc]) => {
      return doc.pageContent;
    })
    .join("\n\n");
}