import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Help() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [copied, setCopied] = useState(false);

  const faqs = [
    {
      question: "How do I start a new conversation?",
      answer: "Click the New Chat button in the sidebar to start a fresh conversation with Nexora.",
    },
    {
      question: "How do I use document search?",
      answer: "Upload a supported document from the chat input and then ask Nexora questions about its contents.",
    },
    {
      question: "When does Nexora use web search?",
      answer: "Nexora can use web search when your question requires current or external information.",
    },
    {
      question: "Can I use voice with Nexora?",
      answer: "Yes. You can use voice input to send questions and voice output to listen to Nexora's responses.",
    },
    {
      question: "Where are my previous chats?",
      answer: "Your previous conversations appear in the Recent Chats section of the sidebar.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`.toLowerCase().includes(search.toLowerCase())
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("support@nexora.ai");
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="relative z-10 p-6 md:p-8">

        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
              N
            </div>

            <span className="text-xl font-semibold">
              Nexora
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
          >
            Back to Chat
          </button>
        </div>

        <div className="max-w-3xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-semibold">
              Help & Support
            </h1>

            <p className="text-neutral-500 mt-2">
              Find answers and learn how to get the most out of Nexora.
            </p>
          </div>

          <div className="relative mb-8">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help topics..."
              className="w-full bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl px-11 py-3.5 outline-none focus:border-blue-500 transition"
            />
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

            <button
              type="button"
              onClick={() => setSearch("document")}
              className="text-left bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-5 hover:border-blue-500/40 hover:bg-neutral-900 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                📄
              </div>

              <h2 className="font-medium">
                Documents
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Learn how to upload and ask questions about documents.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSearch("voice")}
              className="text-left bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-5 hover:border-purple-500/40 hover:bg-neutral-900 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                🎤
              </div>

              <h2 className="font-medium">
                Voice
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Learn how to use Nexora's voice features.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSearch("web search")}
              className="text-left bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-5 hover:border-cyan-500/40 hover:bg-neutral-900 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
                🌐
              </div>

              <h2 className="font-medium">
                Web Search
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Understand how Nexora handles current information.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="text-left bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-5 hover:border-pink-500/40 hover:bg-neutral-900 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4">
                ⚙
              </div>

              <h2 className="font-medium">
                Account Settings
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Manage your username, password, and preferences.
              </p>
            </button>

          </section>

          <section className="bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-6 mb-6">
            <div className="mb-5">
              <h2 className="text-lg font-medium">
                Frequently Asked Questions
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Quick answers to common questions.
              </p>
            </div>

            <div className="space-y-2">

              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={faq.question}
                    className="border border-neutral-800 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between gap-4 px-4 py-4 text-left hover:bg-neutral-800/60 transition"
                    >
                      <span className="text-sm text-neutral-200">
                        {faq.question}
                      </span>

                      <span className="text-neutral-500 text-lg">
                        {openFaq === index ? "−" : "+"}
                      </span>
                    </button>

                    {openFaq === index && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-neutral-500 leading-6">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-neutral-500">
                    No help topics found.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-sm text-blue-400 hover:text-blue-300 mt-2 transition"
                  >
                    Clear search
                  </button>
                </div>
              )}

            </div>
          </section>

          <section className="bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-2">
              Contact & Support
            </h2>

            <p className="text-sm text-neutral-500 mb-5">
              Need more help? Get in touch with Nexora support.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                type="button"
                onClick={copyEmail}
                className="flex-1 flex items-center justify-between gap-3 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 hover:bg-neutral-700 transition"
              >
                <div className="text-left">
                  <p className="text-xs text-neutral-500">
                    Email
                  </p>

                  <p className="text-sm text-white mt-1">
                    support@nexora.ai
                  </p>
                </div>

                <span className="text-xs text-neutral-400">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>

              <div className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3">
                <p className="text-xs text-neutral-500">
                  Helpline
                </p>

                <p className="text-sm text-white mt-1">
                  +91 XXXXX XXXXX
                </p>
              </div>

            </div>

          </section>

        </div>
      </div>
    </div>
  );
}

export default Help;