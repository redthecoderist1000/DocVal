"use client";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/helper/Axios";
import { useError } from "@/helper/ErrorContext";
import ResetPasswordContent from "./ResetPasswordContent";

export default function ResetPassword() {
  const { setError } = useError();
  const router = useRouter();
  const [step, setStep] = useState("otp"); // "otp" or "password"
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(30);

  // get user_id from router state
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");

  // Timer effect for resend OTP button
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!otp) {
      setErrors("Please enter the OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      axiosInstance
        .post("/auth/password/verify_otp", {
          otp: otp,
          user_id: user_id,
        })
        .then(() => {
          setError("OTP verified. You can now reset your password.", "success");
          setStep("password");
          setIsSubmitting(false);
        })
        .catch((err) => {
          const message = err.message || err.error || "Invalid OTP";
          console.log("OTP verify error:", err);
          setError(message, "error");
          setIsSubmitting(false);
        });
    } catch (err) {
      setError(err.message || "Failed to verify OTP", "error");
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    if (!password) {
      setErrors("Please enter your new password");
      return;
    }

    if (!confirmPassword) {
      setErrors("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setErrors("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setErrors("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      axiosInstance
        .post("/auth/password/reset", {
          user_id: user_id,
          new_pass: password,
        })
        .then(() => {
          setError("Password reset successful. Please sign in.", "success");
          router.push("/auth/signin", { replace: true });
          setIsSubmitting(false);
        })
        .catch((err) => {
          setError(
            err.message || err.error || "Failed to reset password",
            "error",
          );
          setIsSubmitting(false);
        });
    } catch (err) {
      setError(err.message || "Failed to reset password", "error");
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    setIsSubmitting(true);
    try {
      axiosInstance
        .post("/auth/password/resend_otp", { user_id: user_id })
        .then(() => {
          setTimer(30); // Start 30-second timer
          setError("OTP resent to your email.", "success");
          setIsSubmitting(false);
        })
        .catch((err) => {
          setError(err.message || err.error || "Failed to resend OTP", "error");
          setIsSubmitting(false);
          setTimer(0); // Reset timer on error
        });
    } catch (err) {
      setError(err.message || "Failed to resend OTP", "error");
      setIsSubmitting(false);
      setTimer(0); // Reset timer on error
    }
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
