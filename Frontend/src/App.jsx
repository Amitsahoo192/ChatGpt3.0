import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./components/chat/Sidebar.jsx";
import Message from "./components/chat/Message.jsx";
import VoiceInput from "./components/voice/VoiceInput.jsx";
import DocumentUpload from "./components/document/DocumentUpload.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import { useAuth } from "./hooks/useAuth.js";
import { useChat } from "./hooks/useChat.js";
import Settings from "./pages/Settings.jsx";
import Help from "./pages/Help.jsx";
import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx";

function ModeSwitcher() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/resume-analyzer")}
      className="fixed top-4 right-5 z-50 w-10 h-10 rounded-full bg-[#171C1B] border border-[#263B37] hover:bg-[#1D2725] hover:border-[#2DD4BF]/50 transition flex items-center justify-center text-sm shadow-lg shadow-black/20"
      title="Resume Analyzer"
    >
      📄
    </button>
  );
}

function App() {
  const {
    user,
    loading: authLoading,
    handleLogin,
    handleLogout,
    updateUser,
  } = useAuth();

  const [showRegister, setShowRegister] = useState(false);

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

  useEffect(() => {
    const loadResumePrompt = () => {
      const prompt = localStorage.getItem(
        "nexora_resume_prompt"
      );

      if (prompt) {
        setInput(prompt);

        localStorage.removeItem(
          "nexora_resume_prompt"
        );
      }
    };

    window.addEventListener(
      "nexora-resume-prompt",
      loadResumePrompt
    );

    return () => {
      window.removeEventListener(
        "nexora-resume-prompt",
        loadResumePrompt
      );
    };
  }, [setInput]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B100F] text-[#E5F2EF] flex items-center justify-center">
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
    <BrowserRouter>
      <Routes>
        <Route
          path="/settings"
          element={
            <Settings
              user={user}
              updateUser={updateUser}
            />
          }
        />

        <Route
          path="/help"
          element={<Help />}
        />

        <Route
          path="/resume-analyzer"
          element={<ResumeAnalyzer />}
        />

        <Route
          path="*"
          element={
            <div className="flex h-screen bg-[#0B100F] text-[#E5F2EF]">
              <ModeSwitcher />

              <Sidebar
                chats={chats}
                chatId={chatId}
                handleNewChat={newChat}
                loadChat={loadChat}
                deleteChat={handleDeleteChat}
                user={user}
                handleLogout={handleLogout}
              />

              <main className="flex-1 overflow-y-auto pb-40 flex justify-center bg-[#0B100F]">
                <div className="w-full max-w-3xl px-6">

                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-6">

                      <div className="w-16 h-16 mb-6 rounded-xl bg-[#14B8A6] text-[#061411] flex items-center justify-center text-3xl font-bold">
                        N
                      </div>

                      <h1 className="text-3xl font-semibold mb-2 text-[#E5F2EF]">
                        Welcome to Nexora
                      </h1>

                      <p className="text-[#7F918D] max-w-md">
                        Your AI workbench for chatting, coding, web search, and working with your documents.
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
                    <div className="my-6 p-3 rounded-xl max-w-fit bg-[#182321] border border-[#263B37] mr-auto flex gap-2">

                      <span className="w-2 h-2 bg-[#2DD4BF] rounded-full animate-bounce" />

                      <span className="w-2 h-2 bg-[#2DD4BF] rounded-full animate-bounce [animation-delay:0.15s]" />

                      <span className="w-2 h-2 bg-[#2DD4BF] rounded-full animate-bounce [animation-delay:0.3s]" />

                    </div>
                  )}

                  <div
                    ref={messagesEndRef}
                    className="h-40"
                  />

                </div>
              </main>

              <div className="fixed bottom-0 left-64 right-0 flex justify-center p-4 z-50">

                <div className="w-full max-w-3xl bg-[#131A18] border border-[#263B37] rounded-2xl p-3 shadow-xl shadow-black/20">

                  <div className="flex items-center gap-2">

                    <DocumentUpload
                      onUpload={setUploadedFile}
                    />

                    {uploadedFile && (
                      <div className="flex items-center gap-2 max-w-[240px] px-3 py-2 rounded-xl bg-[#182321] border border-[#263B37]">

                        <span className="text-sm">
                          📄
                        </span>

                        <span className="text-xs text-[#B8C9C5] truncate flex-1">
                          {uploadedFile.fileName ||
                            "Document attached"}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setUploadedFile(null)
                          }
                          className="text-[#71827E] hover:text-red-400 transition"
                          title="Remove document"
                        >
                          ×
                        </button>

                      </div>
                    )}

                    <textarea
                      id="chat-input"
                      value={input}
                      className="flex-1 h-12 bg-transparent text-[#E5F2EF] placeholder:text-[#667873] resize-none outline-none px-2 py-2"
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
                      disabled={
                        loading || !input.trim()
                      }
                      className="px-4 py-2 rounded-xl bg-[#14B8A6] text-[#061411] font-medium hover:bg-[#2DD4BF] transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>

                  </div>

                </div>

              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;