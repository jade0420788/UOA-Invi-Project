import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Contact - INVIGOV",
  description: "Contact INVIGOV support for account, billing, and product questions.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="INVIGOV" width={32} height={32} unoptimized />
            <span className="font-bold text-gray-900">INVIGOV</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact</h1>
        <p className="text-sm text-gray-500 mb-10">
          Questions about your account, billing, or the platform
        </p>

        <div className="max-w-lg mx-auto">
          <div className="rounded-xl border border-gray-200 p-8 text-center">
            <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-5 mx-auto">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Email support</h2>
            <p className="text-sm text-gray-600 mb-4">
              For account support, billing, product questions, partnerships, or bug reports:
            </p>
            <a
              href="mailto:support@invigov.com"
              className="inline-block text-lg font-medium text-blue-600 hover:text-blue-500"
            >
              support@invigov.com
            </a>
            <p className="text-xs text-gray-500 mt-4">
              We typically respond within 1–2 business days.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
