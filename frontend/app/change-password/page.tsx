"use client";

import React, { useState } from "react";
import Link from "next/link";
import { updatePasswordApi, passwordSchema, type PasswordInput } from "@/app/_lib/auth";
import AuthCard from "@/app/_components/AuthCard";
import AuthInput from "@/app/_components/AuthInput";
import SubmitButton from "@/app/_components/SubmitButton";
import AuthFormError from "@/app/_components/AuthFormError";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState<PasswordInput>({
    currentPassword: "",
    newPassword: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PasswordInput | "confirmPassword", string>>
  >({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");
    setFieldErrors({});

    // Client side checks
    if (formData.newPassword !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    const validation = passwordSchema.safeParse(formData);
    if (!validation.success) {
      const nextErrors: Partial<Record<keyof PasswordInput, string>> = {};
      for (const issue of validation.error.issues) {
        const key = issue.path[0] as keyof PasswordInput | undefined;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePasswordApi(validation.data);
      setSuccessMessage("Password changed successfully!");
      setFormData({ currentPassword: "", newPassword: "" });
      setConfirmPassword("");
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 px-4 py-12">
      {/* Subtle grid texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="z-10 w-full max-w-md">
        <AuthCard>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Update Password</h1>
              <p className="mt-1 text-sm text-slate-400">
                Secure your account with a new password
              </p>
            </div>
            <Link
              href="/"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-full transition-all"
            >
              Home
            </Link>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <AuthInput
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
              error={fieldErrors.currentPassword}
            />

            <AuthInput
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              error={fieldErrors.newPassword}
            />

            <AuthInput
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={fieldErrors.confirmPassword}
            />

            {successMessage && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 shrink-0"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {successMessage}
              </div>
            )}

            <AuthFormError message={submitError} />

            <SubmitButton loading={isSubmitting}>Change Password</SubmitButton>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
