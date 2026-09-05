import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Message({ message }) {
  const [copied, setCopied] = useState(false);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div
      className={`my-6 p-4 rounded-2xl max-w-[85%] ${
        message.sender === "user"
          ? "bg-neutral-800 ml-auto"
          : "bg-neutral-700 mr-auto"
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-3 mt-2">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-2 mt-4">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mb-2 mt-3">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-3 leading-7">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="list-disc ml-6 mb-3 space-y-1">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal ml-6 mb-3 space-y-1">
              {children}
            </ol>
          ),

          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(
              className || ""
            );

            if (match) {
              const code = String(children).replace(
                /\n$/,
                ""
              );

              return (
                <div className="my-4 rounded-xl overflow-hidden bg-neutral-900">
                  <div className="flex justify-between items-center px-4 py-2 text-sm text-neutral-400">
                    <span>{match[1]}</span>

                    <button
                      onClick={() => copyCode(code)}
                      className="hover:text-white"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  <SyntaxHighlighter
                    language={match[1]}
                    style={oneDark}
                    className="!m-0"
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code className="bg-neutral-900 px-1.5 py-0.5 rounded text-sm">
                {children}
              </code>
            );
          },
        }}
      >
        {message.text}
      </ReactMarkdown>
    </div>
  );
}

export default Message;