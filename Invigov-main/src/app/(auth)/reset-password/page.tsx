"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/api";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password cannot be longer than 72 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { error: toastError, success: toastSuccess } = useToast();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toastError("This reset link is invalid or incomplete.", "Invalid link");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      setDone(true);
      toastSuccess("Your password has been updated.", "Password reset");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      const detail = e.response?.data?.detail;
      toastError(
        typeof detail === "string" ? detail : "Unable to reset password. Request a new link.",
        "Reset failed"
      );
    }
  };

  if (!token) {
    return (
      <AuthLayout
        title="Invalid reset link"
        subtitle="This password reset link is missing or incomplete"
        footer={
          <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
            Request a new reset link
          </Link>
        }
      >
        <p className="text-sm text-gray-600 text-center">
          Please use the link from your email, or request a new password reset.
        </p>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout
        title="Password updated"
        subtitle="You can now sign in with your new password"
        footer={
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Go to Sign in
          </Link>
        }
      >
        <p className="text-sm text-gray-600 text-center">Redirecting you to sign in…</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password for your INVIGOV account"
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
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          hint="Must include uppercase letter and number"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />

        <Button type="submit" loading={isSubmitting} className="w-full">
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Reset password" subtitle="Loading…">
          <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </AuthLayout>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
