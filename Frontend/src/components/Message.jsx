import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import VoiceOutput from "./VoiceOutput.jsx";

function Message({ message }) {
  const [copied, setCopied] = useState(false);

  // Copy code
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div
      className={`my-6 p-4 rounded-2xl max-w-[85%] relative ${
        message.sender === "user"
          ? "bg-neutral-800 ml-auto"
          : "bg-neutral-700 mr-auto"
      }`}
    >

      {/* Message content */}
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

          code: ({
            className,
            children,
          }) => {
            const match =
              /language-(\w+)/.exec(
                className || ""
              );

            if (match) {
              const code =
                String(children).replace(
                  /\n$/,
                  ""
                );

              return (
                <div className="my-4 rounded-xl overflow-hidden bg-neutral-900">

                  <div className="flex justify-between items-center px-4 py-2 text-sm text-neutral-400">

                    <span>
                      {match[1]}
                    </span>

                    <button
                      onClick={() =>
                        copyCode(code)
                      }
                      className="hover:text-white"
                    >
                      {copied
                        ? "Copied!"
                        : "Copy"}
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

      {/* Assistant actions */}
      {message.sender === "assistant" && (
        <div className="flex items-center gap-1 mt-3">

          {/* Voice Output */}
          <VoiceOutput text={message.text} />

          {/* Copy */}
          <button
            className="
              px-2 py-1
              rounded-lg
              text-neutral-400
              hover:text-white
              hover:bg-neutral-600
              transition
            "
            title="Copy"
            onClick={() =>
              navigator.clipboard.writeText(
                message.text
              )
            }
          >
            📋
          </button>

          {/* Like */}
          <button
            className="
              px-2 py-1
              rounded-lg
              text-neutral-400
              hover:text-white
              hover:bg-neutral-600
              transition
            "
            title="Like"
          >
            👍
          </button>

          {/* Unlike */}
          <button
            className="
              px-2 py-1
              rounded-lg
              text-neutral-400
              hover:text-white
              hover:bg-neutral-600
              transition
            "
            title="Unlike"
          >
            👎
          </button>

        </div>
      )}

    </div>
  );
}

export default Message;