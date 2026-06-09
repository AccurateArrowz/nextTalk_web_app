"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import AuthCard from "@/app/_components/AuthCard";
import AuthInput from "@/app/_components/AuthInput";
import SubmitButton from "@/app/_components/SubmitButton";
import AuthFormError from "@/app/_components/AuthFormError";
import { loginAction } from "@/app/_actions/auth-actions";
import { loginSchema, type LoginInput } from "@/app/_lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: ""
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginInput, string>>
  >({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const nextErrors: Partial<Record<keyof LoginInput, string>> = {};
      for (const issue of validation.error.issues) {
        const key = issue.path[0] as keyof LoginInput | undefined;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    const validData = validation.data;
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await loginAction(validData);
      router.push("/dashboard");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-400">
          Sign in to continue to NexTalk
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              password: event.target.value
            }))
          }
          error={fieldErrors.password}
        />

        <AuthFormError message={submitError} />

        <SubmitButton loading={isSubmitting}>Sign in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-indigo-400 hover:text-indigo-300"
        >
          Register
        </Link>
      </p>
    </AuthCard>
  );
}
