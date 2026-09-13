import { useState } from "react";
import { login } from "../../services/authService.js";

function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // -------------------------
  // Login
  // -------------------------

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      setError(
        "Email and password are required"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await login(
          email,
          password
        );

      onLogin(data.user);

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error.message ||
        "Login failed"
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">


        {/* Logo + Heading */}

        <div className="flex flex-col items-center mb-8">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold mb-5">
            N
          </div>

          <h1 className="text-3xl font-semibold">
            Welcome back
          </h1>

          <p className="text-neutral-500 mt-2">
            Login to continue to Nexora
          </p>

        </div>


        {/* Login Form */}

        <form
          onSubmit={handleLogin}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-7 shadow-xl"
        >


          {/* Email */}

          <div className="mb-5">

            <label className="block text-sm text-neutral-400 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 outline-none focus:border-neutral-400 transition"
            />

          </div>


          {/* Password */}

          <div className="mb-5">

            <label className="block text-sm text-neutral-400 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Your password"
              autoComplete="current-password"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 outline-none focus:border-neutral-400 transition"
            />

          </div>


          {/* Error */}

          {error && (
            <div className="mb-4 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>


          {/* Register */}

          <div className="text-center mt-6 text-sm text-neutral-500">

            Don't have an account?

            <button
              type="button"
              onClick={onShowRegister}
              className="ml-1 text-white hover:underline"
            >
              Create account
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Login;