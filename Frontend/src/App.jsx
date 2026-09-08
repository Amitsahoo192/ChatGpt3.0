import {
  useState,
  useEffect,
  useRef,
} from "react";
import Sidebar from "./components/Sidebar.jsx";
import Message from "./components/Message.jsx";
import VoiceInput from "./components/VoiceInput.jsx";


function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([]);

  // Reference to the bottom of the chat
  const messagesEndRef = useRef(null);

  // Auto scroll when messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  // Load all chats
  async function loadChats() {
    try {
      const response = await fetch(
        "http://localhost:3000/chats"
      );

      const data = await response.json();

      setChats(data);
    } catch (error) {
      console.error(
        "Error loading chats:",
        error
      );
    }
  }
  async function deleteChat(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this chat?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/chats/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete chat");
    }

    // If deleted chat is currently open
    if (chatId === id) {
      setMessages([]);
      setChatId(null);
    }

    // Refresh sidebar
    await loadChats();

  } catch (error) {
    console.error(
      "Error deleting chat:",
      error
    );
  }
}
  // Load chats when app starts
  useEffect(() => {
    loadChats();
  }, []);

  async function callServer(allMessages) {
    const response = await fetch(
      "http://localhost:3000/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chatId,
          messages: allMessages,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error Generating response from server"
      );
    }

    const data = await response.json();

    setChatId(data.chatId);

    await loadChats();

    return data.message;
  }

  async function generate(text) {
    const newMessage = {
      text: text,
      sender: "user",
    };

    // Create complete updated history
    const updatedMessages = [
      ...messages,
      newMessage,
    ];

    // Show user message
    setMessages(updatedMessages);

    // Show loading state
    setLoading(true);

    try {
      // Send complete history to backend
      const result =
        await callServer(updatedMessages);

      const aiMessage = {
        text: result,
        sender: "assistant",
      };

      // Add AI response to history
      setMessages((prevMessages) => [
        ...prevMessages,
        aiMessage,
      ]);
    } catch (error) {
      console.error(error);

      const errorMessage = {
        text: "Sorry, something went wrong.",
        sender: "assistant",
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBtn() {
    if (loading) {
      return;
    }

    const text = input.trim();

    if (!text) {
      return;
    }

    setInput("");

    await generate(text);
  }

  async function handleEnter(e) {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !loading
    ) {
      e.preventDefault();

      const text = input.trim();

      if (!text) {
        return;
      }

      setInput("");

      await generate(text);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setChatId(null);
  }

 function loadChat(chat) {
  if (loading) {
    return;
  }

  setMessages(chat.messages);
  setChatId(chat._id);
}

  return (
    <div className="flex h-screen bg-neutral-950 text-white">

      {/* Sidebar */}<Sidebar
        chats={chats}
        chatId={chatId}
        handleNewChat={handleNewChat}
        loadChat={loadChat}
        deleteChat={deleteChat}
      />

      {/* Chat area */}

      <main className="flex-1 overflow-y-auto pb-40 flex justify-center">

        <div className="w-full max-w-3xl px-6">

          {messages.length === 0 ? (

            <div className="h-full flex flex-col items-center justify-center text-center px-6">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold mb-5">
                N
              </div>

              <h1 className="text-3xl font-semibold mb-2">
                Welcome to Nexora
              </h1>

              <p className="text-neutral-500 max-w-md">
                Your AI workbench for chatting, coding,
                web search, and working with your documents.
              </p>

            </div>

          ) : (

            messages.map((message, index) => (
              <Message
                key={index}
                message={message}
              />
            ))

          )}

          {/* Loading message */}

          {loading && (
            <div className="my-6 p-3 rounded-xl max-w-fit bg-neutral-700 mr-auto flex gap-2">

              <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>

              <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>

              <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>

            </div>
          )}

          {/* Extra space for fixed input + auto-scroll target */}

          <div
            ref={messagesEndRef}
            className="h-40"
          ></div>

        </div>

      </main>

      {/* Input section */}

      <div className="fixed bottom-0 left-64 right-0 flex justify-center p-4 z-50">

        <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-700 rounded-2xl p-3 shadow-lg focus-within:border-neutral-500">

          <div className="flex items-center gap-2">

            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleEnter}
              disabled={loading}
              className="flex-1 h-12 bg-transparent text-white placeholder:text-neutral-500 resize-none outline-none px-2 py-2 disabled:opacity-50"
              placeholder="Ask anything..."
            />
            <VoiceInput setInput={setInput} />
            <button
              className="bg-white text-black px-5 py-2 rounded-full font-medium hover:bg-neutral-200 hover:scale-105 active:scale-95 transition disabled:opacity-50"
              onClick={handleAddBtn}
              disabled={loading}
            >
              {loading ? "Thinking..." : "Send ↑"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;