import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import {PineconeStore} from "@langchain/pinecone";
import {Pinecone as PineconeClient} from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();
const embeddings= new GoogleGenerativeAIEmbeddings({
        api:process.env.GOOGLE_API_KEY,
        model:'text-embedding-004'
    });
const pinecone = new PineconeClient();
const vectorStore = new PineconeStore(embeddings,{
    pineconeIndex,
    maxConcurrency:5,
}) 
export async function indexTheDocument(filePath){
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    const Split= new RecursiveCharacterTextSplitter({
        chunkSize:1000,
        chunkOverlap:200
    });
    const chunkedDOcs= await Split.splitText(docs)

}
