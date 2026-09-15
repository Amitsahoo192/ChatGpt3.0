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
    <div className="min-h-screen bg-[#0B100F] text-[#E5F2EF] flex items-center justify-center px-6">

      <div className="w-full max-w-md">


        {/* Logo + Heading */}

        <div className="flex flex-col items-center mb-8">

          <div className="w-14 h-14 rounded-2xl bg-[#14B8A6] text-[#061411] flex items-center justify-center text-2xl font-bold mb-5">
            N
          </div>

          <h1 className="text-3xl font-semibold">
            Welcome back
          </h1>

          <p className="text-[#7F918D] mt-2">
            Login to continue to Nexora
          </p>

        </div>


        {/* Login Form */}

        <form
          onSubmit={handleLogin}
          className="bg-[#151716] border border-[#263B37] rounded-2xl p-7 shadow-xl"
        >


          {/* Email */}

          <div className="mb-5">

            <label className="block text-sm text-[#9BAEAA] mb-2">
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
              className="w-full bg-[#0B100F] border border-[#263B37] rounded-xl px-4 py-3 text-[#E5F2EF] placeholder:text-[#667873] outline-none focus:border-[#14B8A6] transition"
            />

          </div>


          {/* Password */}

          <div className="mb-5">

            <label className="block text-sm text-[#9BAEAA] mb-2">
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
              className="w-full bg-[#0B100F] border border-[#263B37] rounded-xl px-4 py-3 text-[#E5F2EF] placeholder:text-[#667873] outline-none focus:border-[#14B8A6] transition"
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
            className="w-full py-3 rounded-xl bg-[#14B8A6] text-[#061411] font-medium hover:bg-[#2DD4BF] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>


          {/* Register */}

          <div className="text-center mt-6 text-sm text-[#7F918D]">

            Don't have an account?

            <button
              type="button"
              onClick={onShowRegister}
              className="ml-1 text-[#5EEAD4] hover:text-[#2DD4BF] hover:underline"
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