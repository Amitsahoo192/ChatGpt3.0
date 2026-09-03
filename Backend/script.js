import express from "express";
import cors from "cors";
import { generate } from "../tools/app.js";

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to ChatBot!");
});
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    // Convert frontend messages to Groq format
    const formattedMessages = messages.map((message) => ({
      role:
        message.sender === "user"
          ? "user"
          : "assistant",
      content: message.text,
    }));

    // Generate AI response
    const result =
      await generate(formattedMessages);

    res.json({
      message: result,
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.listen(3000, () => {
  console.log(
    "Server is running on port: 3000"
  );
});