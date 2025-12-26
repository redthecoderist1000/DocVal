"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

function AuthButton({ children }) {
  const { data: session } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-7-4m0 0l-2-3m2 3v10a1 1 0 001 1h12a1 1 0 001-1v-10m-9-4l7-4"
          />
        </svg>
      ),
    },
    {
      id: "files",
      label: "Files",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "utilities",
      label: "Utilities",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg
          className="w-5 h-5 inline mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  if (session) {
    return (
      <>
        {/* {session.user?.full_name}{" "}
        <button onClick={() => signOut()}>Sign out</button> */}
        <header className="bg-white shadow-2xl shadow-grey-400/20 backdrop-blur-sm p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-950">DocVal</h2>
          <div className="text-sm text-black-400">
            Hello, {session.user?.full_name}
          </div>
        </header>
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div
            className={`${
              sidebarOpen ? "w-64" : "w-20"
            } bg-white shadow-2xl shadow-blue-400/40 border-r-2 border-blue-300/30 flex flex-col transition-all overflow-hidden`}
          >
            {/* Toggle Button */}
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Profile Section */}
            <div
              className={`p-6 flex flex-col items-center ${
                !sidebarOpen && "hidden"
              }`}
            >
              <h2 className="font-semibold text-gray-800 text-center">
                {session.user?.full_name}
              </h2>
              <p className="text-xs text-gray-500 text-center">
                {session.user?.division_abrv}
              </p>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={
                    item.id === "dashboard"
                      ? "/dashboard"
                      : `/dashboard/${item.id}`
                  }
                >
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      activeMenu === item.id
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    } ${!sidebarOpen && "justify-center px-2"}`}
                  >
                    <span className={`${!sidebarOpen && "mr-0"} mr-2`}>
                      {item.icon}
                    </span>
                    {sidebarOpen && item.label}
                  </button>
                </Link>
              ))}
            </nav>

            {/* Logout Button */}
            <div className={`p-4 ${!sidebarOpen && "flex justify-center"}`}>
              <button
                onClick={() => signOut()}
                className={`py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition ${
                  sidebarOpen ? "w-full" : "p-2"
                }`}
              >
                {sidebarOpen ? "LOGOUT" : "🚪"}
              </button>
            </div>

            {/* Bottom Logos */}
            <div
              className={`p-4 flex justify-center gap-3 ${
                !sidebarOpen && "flex-col"
              }`}
            >
              {/* <Image
                src="/dict.png"
                alt="DICT Logo"
                width={40}
                height={40}
                className="cursor-pointer hover:opacity-80"
              />
              <Image
                src="/Pilipns.png"
                alt="Bagong Pilipinas Logo"
                width={40}
                height={40}
                className="cursor-pointer hover:opacity-80"
              /> */}
            </div>
          </div>

          {/* Main area */}
          <div className="flex-1 flex flex-col">
            {/* <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8"> */}
            {children}
            {/* </main> */}
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      not signed in{" "}
      <button onClick={() => signIn("credentials", { callbackUrl: "/" })}>
        Sign in
      </button>
    </>
  );
}

export default function NavBar() {
  return (
    <div>
      <AuthButton />
    </div>
  );
}
