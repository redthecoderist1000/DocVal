"use client";
import { useProtectedRoute } from "@/helper/ProtectedRoutes";
import LoadingScreen from "@/components/LoadingScreen";

export default function profile() {
  const { session, status, isChecking } = useProtectedRoute();

  if (isChecking) {
    return <LoadingScreen />;
  }

  return <div>profile</div>;
}
