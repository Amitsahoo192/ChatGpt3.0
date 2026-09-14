import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, changePassword } from "../services/authService.js";

function Settings() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameMessage, setUsernameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [usernameLoading, setUsernameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUsernameSave = async () => {
    if (!username.trim()) {
      setUsernameMessage("Username cannot be empty.");
      return;
    }

    try {
      setUsernameLoading(true);
      setUsernameMessage("");

      const data = await updateProfile(username.trim());

      setUsernameMessage(data.message || "Username updated successfully.");
    } catch (error) {
      setUsernameMessage(error.message || "Failed to update username.");
    } finally {
      setUsernameLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordMessage("");

      const data = await changePassword(currentPassword, newPassword);

      setPasswordMessage(data.message || "Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage(error.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
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
              Settings
            </h1>

            <p className="text-neutral-500 mt-2">
              Manage your Nexora account and preferences.
            </p>
          </div>

          <section className="bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">
              Profile
            </h2>

            <label className="block text-sm text-neutral-400 mb-2">
              Username
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameMessage("");
                }}
                placeholder="Enter new username"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition"
              />

              <button
                type="button"
                onClick={handleUsernameSave}
                disabled={usernameLoading}
                className="px-4 py-2.5 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {usernameLoading ? "Saving..." : "Save"}
              </button>
            </div>

            {usernameMessage && (
              <p className="text-sm text-neutral-400 mt-3">
                {usernameMessage}
              </p>
            )}
          </section>

          <section className="bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">
              Security
            </h2>

            <div className="space-y-4">

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordMessage("");
                  }}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordMessage("");
                  }}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordMessage("");
                  }}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition"
                />
              </div>

              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={passwordLoading}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>

              {passwordMessage && (
                <p className="text-sm text-neutral-400">
                  {passwordMessage}
                </p>
              )}

            </div>
          </section>

          <section className="bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-medium mb-4">
              Preferences
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">
                  Appearance
                </p>

                <p className="text-sm text-neutral-500 mt-1">
                  Nexora currently uses dark mode.
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-neutral-400">
                Dark
              </span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default Settings;