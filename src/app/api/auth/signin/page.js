"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { useLoading } from "@/helper/LoadingContext";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") {
      startLoading();
    } else {
      stopLoading();
    }

    if (status === "authenticated") {
      router.push("/home");
    } else if (status === "unauthenticated") {
      // stay on the page
    }
  }, [status, router, startLoading, stopLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Submitting:", { email, password });
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/home",
    });

    if (!result.ok) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[80%] relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/dict_text.png"
            alt="Watermark"
            width={500}
            height={500}
            className="opacity-10"
          />
        </div>
      </div>

      {/* Right Section - Login Card */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="p-10">
            {/* Top Logo */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <Image src="/dict_logo.png" alt="Logo" width={50} height={50} />
              <Image
                src="/bagong_pilipinas.png"
                alt="Bagong Pilipinas"
                width={50}
                height={50}
              />
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-blue-900 tracking-wide">
                DocVal
              </h1>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-black"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-black"
                  placeholder="Enter your password"
                />
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={status == "loading"}
                className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg hover:bg-blue-800 active:bg-blue-950 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all mt-6"
              >
                {status == "loading" ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Bottom Footer Logo */}
            <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
              {/* <img
                src="/pilipns.png"
                alt="Philippines"
                className="h-12 object-contain"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
