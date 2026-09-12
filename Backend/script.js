import express from "express";
import cors from "cors";
import multer from "multer";
import cloudinary from "./config/cloudinary.js";
import { generate } from "../tools/app.js";
import { connectDB } from "./db.js";
import Chat from "./models/Chat.js";
import { processDocument } from "../RAG/index.js";
import { randomUUID } from "crypto";

const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
});

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to ChatBot!");
});


app.post("/chat", async (req, res) => {
  try {
    const {
      chatId,
      messages,
      documentId,
    } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({
        message: "Messages are required",
      });
    }

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
      await generate(
        formattedMessages,
        documentId
      );

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

        // Save document ID
        chat.documentId = documentId || null;

        await chat.save();
      }
    }

    if (!chat) {
      const firstUserMessage =
        updatedMessages.find(
          (message) => message.sender === "user"
        )?.text || "New Chat";

      chat = await Chat.create({
        title:
          firstUserMessage.length > 40
            ? firstUserMessage.substring(0, 40) + "..."
            : firstUserMessage,

        messages: updatedMessages,

        // Save document ID
        documentId: documentId || null,
      });
    }

    res.json({
      message: result,
      chatId: chat._id,
    });

  } catch (error) {
    console.error(
      "CHAT ERROR:",
      error
    );

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
    console.error(
      "GET CHATS ERROR:",
      error
    );

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});


// Delete a chat
app.delete("/chats/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    const deletedChat =
      await Chat.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.json({
      message: "Chat deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE CHAT ERROR:",
      error
    );

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});


app.post(
  "/upload-document",
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Document is required",
        });
      }

      const documentId = randomUUID();

      console.log(
        "Uploading:",
        req.file.originalname
      );

      // Upload PDF to Cloudinary
      const result = await new Promise(
        (resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              {
                resource_type: "raw",
                folder: "nexora/documents",
              },

              (error, result) => {

                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }

              }
            );

          stream.end(req.file.buffer);
        }
      );

      console.log(
        "Cloudinary upload successful!"
      );

      console.log(
        "URL:",
        result.secure_url
      );


      // Process PDF and store it in Pinecone
      const ragResult =
        await processDocument(
          req.file.buffer,
          req.file.originalname,
          documentId
        );

      console.log(
        "PDF indexed successfully!"
      );


      res.json({
        message:
          "Document uploaded and indexed successfully",

        fileName:
          req.file.originalname,

        url:
          result.secure_url,

        publicId:
          result.public_id,

        documentId:
          documentId,

        pages:
          ragResult.pages,

        chunks:
          ragResult.chunks,
      });

    } catch (error) {

      console.error(
        "UPLOAD ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to upload document",
      });

    }
  }
);


app.listen(3000, () => {
  console.log(
    "Server is running on port 3000"
  );
});