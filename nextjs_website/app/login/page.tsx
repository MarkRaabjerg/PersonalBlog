"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pocketbase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  console.log("========== LOGIN START ==========");
  console.log("Email:", email);
  console.log("PocketBase baseURL:", pb.baseURL);
  console.log("PocketBase authStore valid:", pb.authStore.isValid);
  console.log("Current page:", window.location.href);
  console.log("User agent:", navigator.userAgent);

  setError("");
  setLoading(true);

  try {
    console.log("Sending auth request...");

    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    console.log("========== LOGIN SUCCESS ==========");
    console.log("Auth data:", authData);
    console.log("Token exists:", !!authData.token);
    console.log("Authenticated record:", authData.record);
    console.log("AuthStore valid:", pb.authStore.isValid);
    console.log("AuthStore model:", pb.authStore.record);

    router.push("/upload");
    router.refresh();
  } catch (err: any) {
    console.error("========== LOGIN FAILED ==========");
    console.error("Full error:", err);
    console.error("Error name:", err?.name);
    console.error("Error message:", err?.message);
    console.error("Error status:", err?.status);
    console.error("Error response:", err?.response);
    console.error("Error data:", err?.data);
    console.error("PocketBase baseURL:", pb.baseURL);
    console.error("AuthStore valid:", pb.authStore.isValid);

    setError(
      err?.response?.message ||
        err?.message ||
        "Could not connect to PocketBase."
    );
  } finally {
    console.log("========== LOGIN FINISHED ==========");
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-[400px]">
          {/* Logo / Name */}
          <div className="mb-12 text-center">
            <a
              href="/"
              className="
                font-serif
                text-[28px]
                font-normal
                tracking-[-1px]
                transition-opacity
                duration-300
                hover:opacity-60
              "
            >
              Mark Engelund Raabjerg
            </a>

            <p className="mt-3 text-[13px] text-[#6e6e73]">
              Sign in to your account
            </p>
          </div>

          {/* Login Card */}
          <div
            className="
              rounded-[24px]
              bg-white
              p-7
              sm:p-9
            "
          >
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-[12px]
                    font-medium
                    text-[#6e6e73]
                  "
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#d2d2d7]
                    bg-white
                    px-4
                    text-[14px]
                    outline-none
                    transition
                    focus:border-[#1d1d1f]
                    focus:ring-1
                    focus:ring-[#1d1d1f]
                  "
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="
                    mb-2
                    block
                    text-[12px]
                    font-medium
                    text-[#6e6e73]
                  "
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#d2d2d7]
                    bg-white
                    px-4
                    text-[14px]
                    outline-none
                    transition
                    focus:border-[#1d1d1f]
                    focus:ring-1
                    focus:ring-[#1d1d1f]
                  "
                  placeholder="Password"
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="
                    rounded-xl
                    bg-[#fff2f2]
                    px-4
                    py-3
                    text-[12px]
                    text-[#c00]
                  "
                >
                  {error}
                </div>
              )}

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  h-12
                  w-full
                  rounded-xl
                  bg-[#1d1d1f]
                  text-[14px]
                  font-medium
                  text-white
                  transition
                  duration-300
                  hover:bg-[#333336]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          {/* Back */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="
                text-[12px]
                text-[#6e6e73]
                transition-colors
                duration-300
                hover:text-[#1d1d1f]
              "
            >
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}