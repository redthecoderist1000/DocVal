"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "@deemlol/next-icons";
import { ChevronLeft } from "@deemlol/next-icons";
import LoadingScreen from "@/components/LoadingScreen";

// icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import axiosInstance from "@/helper/Axios";
import { Button } from "@mui/material";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("home");

  // Set active menu based on current route
  useEffect(() => {
    const currentPath = pathname.split("/").filter(Boolean)[0] || "home";
    setActiveMenu(currentPath);
  }, [pathname]);

  const menuUserItems = [
    {
      path: "home",
      label: "Home",
      icon: <HomeRoundedIcon />,
    },
    {
      path: "files",
      label: "Files",
      icon: <ArticleRoundedIcon />,
    },
    // {
    //   path: "profile",
    //   label: "Profile",
    //   icon: <AccountCircleRoundedIcon />,
    // },
  ];

  const menuAdminItems = [
    {
      path: "home",
      label: "Home",
      icon: <HomeRoundedIcon />,
    },
    {
      path: "files",
      label: "Files",
      icon: <ArticleRoundedIcon />,
    },
    {
      path: "utilities",
      label: "Utilities",
      icon: <SettingsRoundedIcon />,
    },
    // {
    //   path: "profile",
    //   label: "Profile",
    //   icon: <AccountCircleRoundedIcon />,
    // },
  ];

  const testEmail = () => {
    axiosInstance
      .post("/email/test", { name: "Red" })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Show loading while checking auth
  if (status === "loading") return <LoadingScreen />;

  return (
    <>
      <header className="bg-white p-3 flex justify-between items-center border-b-2 border-gray-300/30 sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-blue-950">DocVal</h2>
        <div className="text-sm text-gray-600">
          Hello, {session.user?.full_name}
        </div>
      </header>
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } h-[calc(100vh-60px)] bg-white border-r-2 border-gray-300/30 flex flex-col transition-all overflow-hidden sticky top-[60px]`}
        >
          {/* Toggle Button */}
          <div className="p-4 flex justify-end">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <ChevronLeft size={24} color="#d0d0d0ff" />
              ) : (
                <Menu size={24} color="#d0d0d0ff" />
              )}
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
            <p className="text-xs text-gray-500 text-center">
              {session.user?.role}
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {(session.user?.role === "administrator"
              ? menuAdminItems
              : menuUserItems
            ).map((item, index) => (
              <Link key={index} href={`/${item.path}`}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeMenu === item.path
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  } ${!sidebarOpen && "justify-center px-2"}`}
                  onClick={() => setActiveMenu(item.path)}
                >
                  <span className={`${!sidebarOpen && "mr-0"} mr-2`}>
                    {item.icon}
                  </span>
                  {sidebarOpen && item.label}
                </button>
              </Link>
            ))}
          </nav>

          <Button onClick={testEmail}>Test Email</Button>

          {/* Logout Button */}
          <div className={`p-4 ${!sidebarOpen && "flex justify-center"}`}>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className={`py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition ${
                sidebarOpen ? "w-full" : "p-2"
              }`}
            >
              {sidebarOpen ? "LOGOUT" : <LogoutRoundedIcon />}
            </button>
          </div>

          {/* Bottom Logos */}
          <div
            className={`p-4 flex justify-center gap-3 ${
              !sidebarOpen && "flex-col"
            }`}
          >
            <Image
              src="/dict_logo.png"
              alt="DICT Logo"
              width={40}
              height={40}
            />
            <Image
              src="/bagong_pilipinas.png"
              alt="Bagong Pilipinas Logo"
              width={40}
              height={40}
            />
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col">
          <main className="h-full bg-gray-50 p-10">
            {/* <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8"> */}
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
