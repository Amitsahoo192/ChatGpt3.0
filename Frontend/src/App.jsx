import { useState } from "react";

import Sidebar from "./components/chat/Sidebar.jsx";
import Message from "./components/chat/Message.jsx";
import VoiceInput from "./components/voice/VoiceInput.jsx";
import DocumentUpload from "./components/document/DocumentUpload.jsx";

import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";

import { useAuth } from "./hooks/useAuth.js";
import { useChat } from "./hooks/useChat.js";

function App() {
  const {
      user,
      loading: authLoading,
      handleLogin,
      handleLogout,
  } = useAuth();

  const [showRegister, setShowRegister] =
    useState(false);

 const {
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
} = useChat(user);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        Loading Nexora...
      </div>
    );
  }

  if (!user && showRegister) {
    return (
      <Register
        onRegisterSuccess={() => {
          setShowRegister(false);
        }}
        onBackToLogin={() => {
          setShowRegister(false);
        }}
      />
    );
  }

  if (!user) {
    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => {
          setShowRegister(true);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-white">

      <Sidebar
          chats={chats}
          chatId={chatId}
          handleNewChat={newChat}
          loadChat={loadChat}
          deleteChat={handleDeleteChat}
          user={user}
          handleLogout={handleLogout}
        />

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
                Your AI workbench for chatting,
                coding, web search, and working
                with your documents.
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

          {loading && (
            <div className="my-6 p-3 rounded-xl max-w-fit bg-neutral-700 mr-auto flex gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          )}

          <div
            ref={messagesEndRef}
            className="h-40"
          />

        </div>
      </main>

      <div className="fixed bottom-0 left-64 right-0 flex justify-center p-4 z-50">
        <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-700 rounded-2xl p-3 shadow-lg">

          <div className="flex items-center gap-2">

            <DocumentUpload
              onUpload={setUploadedFile}
            />

            <textarea
              id="chat-input"
              value={input}
              className="flex-1 h-12 bg-transparent text-white placeholder:text-neutral-500 resize-none outline-none px-2 py-2"
              placeholder="Ask anything..."
              disabled={loading}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              onKeyDown={handleEnter}
            />

            <VoiceInput
              setInput={setInput}
            />
            <button
          type="button"
          onClick={() => generate(input)}
          disabled={loading || !input.trim()}
          className="
          px-4 py-2
          rounded-xl
          bg-white 
          text-black
          font-medium
          hover:bg-neutral-200
          transition
          disabled:opacity-40
          disabled:cursor-not-allowed
          "
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