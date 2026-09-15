import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({
  chats,
  chatId,
  handleNewChat,
  loadChat,
  deleteChat,
  user,
  handleLogout,
}) {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-screen w-72 bg-[#151716] border-r border-[#292C29] p-4 flex flex-col">

      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-lg bg-[#14B8A6] text-[#061411] flex items-center justify-center font-bold">
          N
        </div>

        <span className="text-xl font-semibold text-[#E5F2EF]">
          Nexora
        </span>
      </div>

      <button
        type="button"
        onClick={handleNewChat}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#14B8A6] text-[#061411] hover:bg-[#2DD4BF] transition-colors"
      >
        <span className="text-xl">
          +
        </span>

        <span className="font-medium">
          New Chat
        </span>
      </button>

      <div className="mt-8 flex-1 min-h-0">

        <p className="text-xs font-medium text-[#777A74] uppercase tracking-wider mb-3">
          Recent Chats
        </p>

        <div className="space-y-1 overflow-y-auto h-full pr-1">

          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                chatId === chat._id
                  ? "bg-[#242623] text-[#E5F2EF]"
                  : "text-[#969891] hover:bg-[#1D1F1D] hover:text-[#E5F2EF]"
              }`}
            >

              <div
                onClick={() => loadChat(chat)}
                className="flex-1 truncate cursor-pointer"
              >
                {chat.title || "New Chat"}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat._id);
                }}
                className="opacity-0 group-hover:opacity-100 text-[#777A74] hover:text-red-400 transition-all duration-200 px-1"
                title="Delete chat"
              >
                ×
              </button>

            </div>
          ))}

        </div>

      </div>

      <div className="relative pt-4">

        <div className="h-px bg-[#292C29] mb-3" />

        <button
          type="button"
          onClick={() =>
            setShowProfile((previous) => !previous)
          }
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#1D1F1D] transition text-left"
        >

          <div className="w-9 h-9 rounded-full bg-[#242623] border border-[#292C29] flex items-center justify-center text-sm font-medium text-[#2DD4BF]">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="flex-1 min-w-0">

            <p className="text-sm text-[#E5F2EF] truncate">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-[#777A74] truncate">
              {user?.email || ""}
            </p>

          </div>

          <span className="text-[#777A74]">
            ⋮
          </span>

        </button>

        {showProfile && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#191B19] border border-[#292C29] rounded-lg p-1 shadow-xl">

            <button
              type="button"
              onClick={() => {
                setShowProfile(false);
                navigate("/settings");
              }}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm text-[#C4C5BE] hover:bg-[#242623] hover:text-[#E5F2EF] transition"
            >
              Settings
            </button>

            <button
              type="button"
              onClick={() => {
                setShowProfile(false);
                navigate("/help");
              }}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm text-[#C4C5BE] hover:bg-[#242623] hover:text-[#E5F2EF] transition"
            >
              Help
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm text-red-400 hover:bg-red-500/10 transition"
            >
              Logout
            </button>

          </div>
        )}

      </div>

      <div className="pt-3">
        <div className="flex items-center gap-2 text-sm text-[#777A74]">
          <div className="w-2 h-2 rounded-full bg-[#14B8A6]" />
          Nexora AI
        </div>
      </div>

    </div>
  );
}

export default Sidebar;