"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { error: toastError, success: toastSuccess } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/auth/forgot-password", { email: data.email });
      setSubmitted(true);
      toastSuccess(
        "If an account exists for that email, a reset link has been sent.",
        "Check your email"
      );
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      toastError(
        e.response?.data?.detail || "Unable to send reset email. Please try again.",
        "Request failed"
      );
    }
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="Password reset instructions were sent if the account exists"
        footer={
          <>
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </>
        }
      >
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            We sent a password reset link to{" "}
            <span className="font-medium text-gray-900">{getValues("email")}</span> if that
            address is registered.
          </p>
          <p className="text-xs text-gray-500">
            The link expires in 1 hour. Check spam if you don&apos;t see it.
          </p>
          <Button variant="secondary" className="w-full" onClick={() => setSubmitted(false)}>
            Try another email
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send a reset link"
      footer={
        <>
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" loading={isSubmitting} className="w-full">
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
}
