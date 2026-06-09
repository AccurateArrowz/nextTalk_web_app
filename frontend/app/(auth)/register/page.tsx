"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import AuthCard from "@/app/_components/AuthCard";
import AuthInput from "@/app/_components/AuthInput";
import SubmitButton from "@/app/_components/SubmitButton";
import AuthFormError from "@/app/_components/AuthFormError";
import { registerAction } from "@/app/_actions/auth-actions";
import { registerSchema, type RegisterInput } from "@/app/_lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterInput>({
    fullName: "",
    email: "",
    password: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RegisterInput | "confirmPassword", string>>
  >({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const validation = registerSchema.safeParse(formData);
    const nextErrors: Partial<
      Record<keyof RegisterInput | "confirmPassword", string>
    > = {};

    if (!validation.success) {
      for (const issue of validation.error.issues) {
        const key = issue.path[0] as keyof RegisterInput | undefined;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    const validData = validation.success ? validation.data : formData;
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await registerAction(validData);
      router.push("/login");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-slate-400">
          Join NexTalk and start chatting instantly
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <AuthInput
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          value={formData.fullName}
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              fullName: event.target.value
            }))
          }
          error={fieldErrors.fullName}
        />

        <AuthInput
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(event) =>
            setFormData((current) => ({ ...current, email: event.target.value }))
          }
          error={fieldErrors.email}
        />

        <AuthInput
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          value={formData.password}
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              password: event.target.value
            }))
          }
          error={fieldErrors.password}
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={fieldErrors.confirmPassword}
        />

        <AuthFormError message={submitError} />

        <SubmitButton loading={isSubmitting}>Create account</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-400 hover:text-indigo-300"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
