import {
  useState,
  useEffect,
  useRef,
} from "react";
import Sidebar from "./components/Sidebar.jsx";
import Message from "./components/Message.jsx";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([]);
  // Reference to the bottom of the chat
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);
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
      // Stop loading whether successful or error
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
      await generate(text);
      setInput("");
    }
  }
  function handleNewChat() {
  setMessages([]);
  setChatId(null);
}
function loadChat(chat) {
  setMessages(chat.messages);
  setChatId(chat._id);
}
useEffect(() => {
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

  loadChats();
}, []);
  return (
    <div className="container mx-auto max-w-4xl pb-24">
      {/* Sidebar */}

      <Sidebar
     chats={chats}
     handleNewChat={handleNewChat}
      loadChat={loadChat}
    />

      {/* Chat messages */}

      {messages.map((message, index) => (
  <Message
    key={index}
    message={message}
  />
))}

      {/* Loading message */}

      {loading && (
          <div className="my-6 p-3 rounded-xl max-w-fit bg-neutral-700 mr-auto flex gap-2">
    
          <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>

          <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>

          <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>

      </div>
      )}

      {/* Auto-scroll target */}

      <div ref={messagesEndRef}></div>

      {/* Input section */}

      <div className="fixed inset-x-0 bottom-0 flex items-center justify-center">

        <div className="bg-neutral-800 p-4 rounded-xl w-full md:w-4xl">

          <textarea
              value={input}
              onChange={(e) =>
            setInput(e.target.value)
            }
            onKeyDown={handleEnter}
            disabled={loading}
            className="w-full resize-none outline-none disabled:opacity-50"
            placeholder="Ask anything..."
          />
          <div className="flex justify-end">

            <button
              className="bg-white text-black px-4 py-1 rounded-full disabled:opacity-50"
              onClick={handleAddBtn}
              disabled={loading}
            >
              {loading ? "Thinking..." : "Send"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;