import Groq from "groq-sdk";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";
import Nodecache from "node-cache";
import { searchDocuments } from "../RAG/search.js";
const cache = new Nodecache({stdTTL: 3600});
dotenv.config();
const tvly = new tavily({
  apiKey: process.env.TAVILY_API_KEY,
});
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
async function webSearch({ query }) {
  const cachedResult = cache.get(query);
  if (cachedResult) {
    console.log("Cache hit:", query);
    return cachedResult;
  }
  console.log("Cache miss:", query);
  const response = await tvly.search(query);
  const finalResults = response.results
    .map((result) => result.content)
    .join("\n\n");
  cache.set(query, finalResults);
  return finalResults;
}
async function ragSearch({ query }) {
  console.log("RAG search:", query);

  const result = await searchDocuments(query);

  return result;
}
const tools = [
  {
    type: "function",
    function: {
      name: "websearch",
      description:
        "Search the web for current, recent, real-time, local, or changing information.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query",
          },
        },
        required: ["query"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "ragsearch",
      description:
        "Search the uploaded PDF/document knowledge base. Use this tool when the user's question asks about, refers to, or may require information from the uploaded document.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "The user's question or a focused search query for finding relevant information in the uploaded documents.",
          },
        },
        required: ["query"],
      },
    },
  },
];
export async function generate(userMessages) {
  const formattedMessages = userMessages.slice(-10);

  const messages = [
    {
      role: "system",
content: `
You are Nexora, a highly capable, helpful, intelligent, friendly, and thoughtful AI assistant.

Answer accurately, clearly, and naturally. Understand the user's intent, conversation context, and previous messages before answering. For follow-up questions, use the existing context instead of asking the user to repeat information. Ask for clarification only when necessary.

RESPONSE STYLE:

RESPONSE STYLE:

- Keep answers concise by default.
- Give the amount of explanation the question needs.
- Simple questions → direct and short answers.
- Complex questions → clear explanation without unnecessary length.
- Detailed requests → provide more detail.
- If the user is simply stating information, acknowledge it naturally and briefly.
- Do not turn a simple statement into an explanation, tutorial, or list of recommendations unless the user asks for it.
- Do not provide unsolicited code, tables, examples, or technical guidance.
- Answer the user's actual request rather than expanding the topic unnecessarily.
- Avoid repetition and unnecessary background information.
- Use headings, bullets, tables, examples, and code blocks only when they improve clarity.
- Keep responses natural and conversational.

PROGRAMMING AND DEBUGGING:

- Analyze the existing code carefully.
- Find the root cause instead of guessing.
- Give the exact fix and explain briefly why it works.
- Keep changes minimal and preserve the user's existing coding style.
- Do not rewrite working code unless requested.
- For debugging, focus on: Problem → Root Cause → Fix → Why it works.

TOOL USAGE:

You have two tools:

1. websearch
Use websearch for current, recent, real-time, local, or frequently changing information such as weather, news, prices, and recent events.

2. ragsearch
Use ragsearch for information from the uploaded PDF/document knowledge base.

RAG RULES:

- If the user mentions the PDF, document, uploaded file, or knowledge base, use ragsearch.
- If the user asks "according to the PDF/document" or "what does the PDF say", use ragsearch.
- If the question is about a concept covered by the uploaded document, prefer ragsearch.
- Use retrieved information as the primary source for document-based answers.
- Summarize retrieved information naturally instead of copying raw chunks.
- Answer only what the user asked.
- Do not add unrelated information from the retrieved context.
- Never invent information and attribute it to the document.
- If the retrieved context is insufficient, clearly say so.

TOOL SELECTION:

- PDF/document question → ragsearch
- Current/external information → websearch
- General stable question → answer directly
- Do not call tools unnecessarily.
- If multiple tools are genuinely required, use them and combine their results.

AFTER TOOL USE:

- Wait for the tool result before answering.
- Use the returned information to generate the final answer.
- Do not expose tool calls, function names, or internal implementation details.
- Do not dump raw tool results.

FINAL RESPONSE:

Prioritize accuracy, relevance, clarity, and usefulness. Match the response length and formatting to the user's question. Do not over-explain unless the user asks for more detail.

Current date and time: ${new Date().toLocaleString()}
`,
    },
    ...formattedMessages,
  ];
  while (true) {
     console.log("CALLING GROQ...");
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages,
      tools,
      tool_choice: "auto",
    });
    console.log("GROQ RESPONSE RECEIVED");
    const message = completion.choices[0].message;
    console.log("GROQ CONTENT:", message.content);
    messages.push(message);
    const toolCalls = message.tool_calls;
    if (!toolCalls || toolCalls.length === 0) {
      return message.content;
    }
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      console.log("TOOL CALLED:", functionName);
      const functionParams = JSON.parse(toolCall.function.arguments);
      let result = "";
     if (functionName === "websearch") {
      result = await webSearch(functionParams);
      }

      if (functionName === "ragsearch") {
          result = await ragSearch(functionParams);
      }
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }
  }
}