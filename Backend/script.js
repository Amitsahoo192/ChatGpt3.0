import express from "express";
import { generate } from "../tools/app.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to ChatBot!");
});

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const result = await generate(messages);

    res.json({
      message: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port: 3000");
});