function Sidebar({
  chats,
  chatId,
  handleNewChat,
  loadChat,
  deleteChat,
}) {
  return (
    <div className="h-screen w-64 bg-neutral-950 border-r border-neutral-800 p-4 flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
          N
        </div>

        <span className="text-xl font-semibold">
          Nexora
        </span>
      </div>

      {/* New Chat */}
      <button
        onClick={handleNewChat}
        className="
          group w-full flex items-center justify-center gap-2
          py-2.5 rounded-xl
          bg-gradient-to-r from-blue-600 to-purple-600
          hover:from-blue-500 hover:to-purple-500
          transition-all duration-300
          hover:scale-[1.02]
          active:scale-95
          shadow-lg shadow-blue-500/10
        "
      >
        <span
          className="
            text-xl
            transition-transform
            duration-300
            group-hover:rotate-90
          "
        >
          +
        </span>

        <span className="font-medium">
          New Chat
        </span>
      </button>

      {/* History */}
      <div className="mt-8 flex-1 min-h-0">

        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
          Recent Chats
        </p>

        <div className="space-y-1 overflow-y-auto h-full pr-1">

          {chats.map((chat) => (

            <div
              key={chat._id}
              className={`
                group flex items-center gap-2
                px-3 py-2.5
                rounded-xl
                text-sm
                transition-all duration-200
                ${
                  chatId === chat._id
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }
              `}
            >

              {/* Chat title */}
              <div
                onClick={() => loadChat(chat)}
                className="
                  flex-1
                  truncate
                  cursor-pointer
                "
              >
                {chat.title || "New Chat"}
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat._id);
                }}
                className="
                  opacity-0
                  group-hover:opacity-100
                  text-neutral-500
                  hover:text-red-400
                  transition-all
                  duration-200
                  px-1
                "
                title="Delete chat"
              >
                ×
              </button>

            </div>

          ))}

        </div>
      </div>

      {/* Bottom */}
      <div className="pt-4">

        <div className="h-px bg-neutral-800 mb-3" />

        <div className="flex items-center gap-2 text-sm text-neutral-500">

          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

          Nexora AI

        </div>

      </div>

    </div>
  );
}

export default Sidebar;