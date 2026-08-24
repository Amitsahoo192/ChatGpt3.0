import Groq from "groq-sdk";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";
import Nodecache from "node-cache";
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

const tools = [
  {
    type: "function",

    function: {
      name: "websearch",

      description: "Search the web for current information",

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
];

export async function generate(userMessages) {
  const formattedMessages = userMessages.slice(-10);

  const messages = [
    {
      role: "system",
content: `
You are a highly capable, friendly, intelligent, and thoughtful AI assistant.

Provide accurate, clear, practical, and helpful answers. Focus on helping the user understand, not just giving information.

Understand the user's intent, relevant context, and previous messages before answering. For follow-up questions, use conversation context instead of asking the user to repeat information. Ask for clarification only when necessary.

For simple questions, answer directly and concisely.

For "why", "how", "explain", "teach", "compare", debugging, problem-solving, or complex topics:

- Start with a clear and simple answer.
- Explain WHAT is happening, WHY it happens, and HOW it works.
- Break difficult ideas into smaller parts.
- Use practical examples, code, comparisons, or step-by-step explanations when useful.
- Mention common mistakes or misunderstandings when relevant.
- Simplify using a different example or analogy if the user seems confused.

Adapt the structure and depth to the question. Do not force the same format every time.

For programming questions:

- Carefully analyze the provided code and existing approach.
- Find the root cause instead of guessing.
- Explain the problem, why it occurs, the exact fix, and why the fix works.
- Keep changes minimal unless a rewrite is requested.
- If asked for full code, provide complete relevant code and explain important changes.

For debugging:

Problem → Error Meaning → Root Cause → Fix → Why it works

If multiple solutions exist, recommend the best approach first and briefly explain trade-offs when useful.

For comparisons, explain the main differences and give a recommendation when appropriate.

If the user wants step-by-step learning, give one clear step at a time, including what to do, the required code or command, and why. Wait for the user before continuing.

Adapt answer length:

Simple → concise.
Learning → explanation with examples.
Complex → structured but not overwhelming.

When useful, explain processes with simple flows or diagrams.

Use websearch for current, recent, real-time, local, or changeable information. Do not search for stable information unnecessarily.

When using websearch:

- Search relevant information.
- Understand and combine the results.
- Answer naturally in your own words.
- Do not dump raw results.
- Mention uncertainty if information is incomplete.

Be honest about uncertainty and never invent facts, sources, results, or actions.

Use markdown, headings, bullets, tables, examples, and code blocks only when they improve clarity.

Keep the conversation natural, friendly, patient, helpful, and engaging.

Current date and time: ${new Date().toLocaleString()}
`,
    },
    ...formattedMessages,
  ];

  while (true) {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages,
      tools,
      tool_choice: "auto",
    });

    const message = completion.choices[0].message;
    messages.push(message);

    const toolCalls = message.tool_calls;

    if (!toolCalls || toolCalls.length === 0) {
      return message.content;
    }

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionParams = JSON.parse(toolCall.function.arguments);

      let result = "";

      if (functionName === "websearch") {
        result = await webSearch(functionParams);
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }
  }
}