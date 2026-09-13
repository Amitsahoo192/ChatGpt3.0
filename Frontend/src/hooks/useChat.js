import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  getChats,
  sendMessage,
  deleteChat,
} from "../services/chatService.js";


export function useChat(user) {

  const [messages, setMessages] =
    useState([]);

  const [chatId, setChatId] =
    useState(null);

  const [chats, setChats] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [input, setInput] =
    useState("");

  const [uploadedFile, setUploadedFile] =
    useState(null);


  const messagesEndRef =
    useRef(null);
  async function loadChats() {

    if (!user) {
      return;
    }

    try {

      const data =
        await getChats();

      setChats(data);

    } catch (error) {

      console.error(
        "LOAD CHATS ERROR:",
        error
      );

    }
  }

  useEffect(() => {

    if (user) {
      loadChats();
    }

  }, [user]);


  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

  }, [messages, loading]);


  async function handleDeleteChat(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this chat?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteChat(id);

      if (chatId === id) {

        setMessages([]);
        setChatId(null);
        setUploadedFile(null);
        setInput("");

      }

      await loadChats();

    } catch (error) {

      console.error(
        "DELETE CHAT ERROR:",
        error
      );

    }
  }


  async function generate(text) {

    const trimmedText =
      text.trim();

    if (!trimmedText || loading) {
      return;
    }


    const newMessage = {
      text: trimmedText,
      sender: "user",
    };


    const updatedMessages = [
      ...messages,
      newMessage,
    ];


    setMessages(
      updatedMessages
    );

    setInput("");

    setLoading(true);


    try {

      const data =
        await sendMessage(
          chatId,
          updatedMessages,
          uploadedFile?.documentId
        );


      setChatId(
        data.chatId
      );


      const aiMessage = {
        text: data.message,
        sender: "assistant",
      };


      setMessages(
        (previous) => [
          ...previous,
          aiMessage,
        ]
      );


      await loadChats();

    } catch (error) {

      console.error(
        "GENERATE ERROR:",
        error
      );


      setMessages(
        (previous) => [
          ...previous,
          {
            text:
              "Sorry, something went wrong.",
            sender: "assistant",
          },
        ]
      );

    } finally {

      setLoading(false);

    }
  }

  function newChat() {

    setMessages([]);

    setChatId(null);

    setUploadedFile(null);

    setInput("");

  }

  function loadChat(chat) {

    if (loading) {
      return;
    }


    setMessages(
      chat.messages
    );


    setChatId(
      chat._id
    );


    setInput("");


    if (chat.documentId) {

      setUploadedFile({
        documentId:
          chat.documentId,
      });

    } else {

      setUploadedFile(null);

    }
  }
  function handleEnter(e) {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      generate(input);

    }
  }


  return {
    messages,
    chatId,
    chats,
    loading,
    input,
    uploadedFile,
    messagesEndRef,

    setInput,
    setUploadedFile,

    generate,
    handleEnter,
    newChat,
    loadChat,
    handleDeleteChat,
  };
}