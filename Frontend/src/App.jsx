import { useState } from "react";

function App() {

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [addBtn, setAddbtn] = useState(false);
  function handleAddBtn(e) {
    const text = input.trim();
    if (!text) {
      return;
    }
    generate(text);
  }
  function generate(text) 
  {
    const newMessage = {
      text: text,
      sender: "user"
    };
    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage
    ]);
  }
  function handleEnter(e) {
    if (e.key === "Enter") {
      const text = input.trim();
      if (!text) {
        return;
      }
      generate(text);
      setInput("");
    }
  }
  return (

    <div className="container mx-auto max-w-4xl pb-24">

      {/* CHAT MESSAGES */}

      {messages.map((message, index) => (

        <div
          key={index}
          className="my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit"
        >
          {message.text}
        </div>

      ))}
      <div className="fixed inset-x-0 bottom-0 flex items-center justify-center">
        <div className="bg-neutral-800 p-4 rounded-xl w-full md:w-4xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnter}
            className="w-full resize-none outline-none"
            placeholder="Ask anything..."
          />
          <div className="flex justify-end">
            <button
              className="bg-white text-black px-4 py-1 rounded-full"
              onClick={handleAddBtn}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;