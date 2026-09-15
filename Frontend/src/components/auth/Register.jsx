import { useState } from "react";
import { register } from "../../services/authService.js";

function Register({ onRegisterSuccess, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  async function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      setError(
        "Name, email and password are required"
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await register(
        name,
        email,
        password
      );

      setSuccess(
        "Account created successfully!"
      );

      setTimeout(() => {
        onRegisterSuccess();
      }, 1000);

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      setError(error.message);

    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-[#0B100F] text-[#E5F2EF] flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="flex flex-col items-center mb-8">

          <div className="w-14 h-14 rounded-2xl bg-[#14B8A6] text-[#061411] flex items-center justify-center text-2xl font-bold mb-5">
            N
          </div>

          <h1 className="text-3xl font-semibold">
            Create your account
          </h1>

          <p className="text-[#7F918D] mt-2">
            Join Nexora and start building
          </p>

        </div>


        {/* Form */}

        <form
          onSubmit={handleRegister}
          className="bg-[#151716] border border-[#263B37] rounded-2xl p-7 shadow-xl"
        >

          {/* Name */}

          <div className="mb-5">

            <label className="block text-sm text-[#9BAEAA] mb-2">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Your name"
              className="w-full bg-[#0B100F] border border-[#263B37] rounded-xl px-4 py-3 text-[#E5F2EF] placeholder:text-[#667873] outline-none focus:border-[#14B8A6] transition"
            />

          </div>


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
              placeholder="At least 6 characters"
              className="w-full bg-[#0B100F] border border-[#263B37] rounded-xl px-4 py-3 text-[#E5F2EF] placeholder:text-[#667873] outline-none focus:border-[#14B8A6] transition"
            />

          </div>


          {/* Error */}

          {error && (
            <div className="mb-4 text-sm text-red-400">
              {error}
            </div>
          )}


          {/* Success */}

          {success && (
            <div className="mb-4 text-sm text-green-400">
              {success}
            </div>
          )}


          {/* Register Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#14B8A6] text-[#061411] font-medium hover:bg-[#2DD4BF] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>


          {/* Login Link */}

          <div className="text-center mt-6 text-sm text-[#7F918D]">

            Already have an account?

            <button
              type="button"
              onClick={onBackToLogin}
              className="ml-1 text-[#5EEAD4] hover:text-[#2DD4BF] hover:underline"
            >
              Login
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Register;