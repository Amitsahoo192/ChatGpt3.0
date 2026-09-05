import express from "express";
import cors from "cors";
import { generate } from "../tools/app.js";
import { connectDB } from "./db.js";
import Chat from "./models/Chat.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to ChatBot!");
});

app.post("/chat", async (req, res) => {
  try {
    const { chatId, messages } = req.body;

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

    const updatedMessages = [
      ...messages,
      {
        sender: "assistant",
        text: result,
      },
    ];

    let chat;

    if (chatId) {
      chat = await Chat.findById(chatId);

      if (chat) {
        chat.messages = updatedMessages;

        await chat.save();
      }
    }

    if (!chat) {
  chat = await Chat.create({
    title:
      updatedMessages.find(
        (message) => message.sender === "user"
      )?.text || "New Chat",

    messages: updatedMessages,
  });
}
    res.json({
      message: result,
      chatId: chat._id,
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.get("/chats", async (req, res) => {
  try {
    const chats = await Chat.find()
      .sort({ updatedAt: -1 });

    res.json(chats);

  } catch (error) {
    console.error("GET CHATS ERROR:", error);

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