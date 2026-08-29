import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();
// Create Google embedding model
const embeddings = new GoogleGenerativeAIEmbeddings({
apiKey: process.env.GOOGLE_API_KEY,
model: "text-embedding-004",
});
// Create Pinecone client
const pinecone = new PineconeClient();
// Connect to Pinecone index
const pineconeIndex = pinecone.Index(
process.env.PINECONE_INDEX_NAME
);
//Create LangChain Pinecone vector store
const vectorStore = new PineconeStore(embeddings, {
pineconeIndex,
maxConcurrency: 5,
});
//Load PDF, split it, and store embeddings in Pinecone
export async function indexTheDocument(filePath) {
//Load the PDF file
const loader = new PDFLoader(filePath);
//Extract PDF content as documents
const docs = await loader.load();
// Create text splitter
const splitter = new RecursiveCharacterTextSplitter({
chunkSize: 1000,
chunkOverlap: 200,
});
// Split documents into smaller chunks
const chunkedDocs = await splitter.splitDocuments(docs);
// Create embeddings and store chunks in Pinecone 1.Extracts Page Content ,send to google Embeddings and recieves a vector
await vectorStore.addDocuments(chunkedDocs);
console.log("Document indexed successfully!");
}
