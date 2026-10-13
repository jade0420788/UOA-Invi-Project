import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy - INVIGOV",
  description: "Privacy Policy for the INVIGOV platform.",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">INVIGOV | Effective October 2, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <p>
              This Privacy Policy explains how Invigov LLC (&quot;INVIGOV,&quot; &quot;we,&quot;
              &quot;us&quot;) collects, uses, and protects information when you use invigov.com and
              the INVIGOV platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account information:</strong> name, email address, and login credentials.
              </li>
              <li>
                <strong>Business information you provide:</strong> company name, UEI, CAGE code,
                NAICS codes, certifications, entity details, and the responses used to generate
                compliance documents.
              </li>
              <li>
                <strong>Billing information:</strong> payments are handled by our payment processor.
                We receive limited details such as plan, payment status, and card brand and last four
                digits. We do not store full card numbers.
              </li>
              <li>
                <strong>Usage and device information:</strong> IP address, browser type, pages
                viewed, and log data.
              </li>
              <li>
                <strong>Communications:</strong> messages you send to support.
              </li>
              <li>
                Cookies and similar technologies needed to keep you signed in and operate the site.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Information</h2>
            <p>
              We use information to provide the Service, generate documents, send deadline alerts and
              account notices, process payments, provide support, secure the platform, improve our
              features, and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. How We Share Information</h2>
            <p>
              We share information with service providers that help us operate the Service, such as
              hosting, payment processing, and email delivery, and only as needed for those purposes.
              We may disclose information when required by law, to protect rights and safety, or in
              connection with a business transfer. We do not sell your personal information or share
              it for cross-context behavioral advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Retention</h2>
            <p>
              We keep information while your account is active and as needed to provide the Service,
              resolve disputes, and meet legal obligations. You may request deletion at any time,
              subject to those obligations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Security</h2>
            <p>
              We use industry-standard safeguards, including encryption in transit, encryption of
              sensitive data at rest, and access controls. No system is completely secure, and we
              cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Your Choices and Rights</h2>
            <p>
              You may access, correct, export, or delete your information, and opt out of
              non-essential communications, by emailing{" "}
              <a href="mailto:support@invigov.com" className="text-blue-600 hover:underline">
                support@invigov.com
              </a>
              . Depending on where you live, such as Texas or California, you may have additional
              rights under state privacy laws, including the right to appeal a decision. We will not
              discriminate against you for exercising them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Children</h2>
            <p>
              The Service is intended for businesses and is not directed to anyone under 18. We do
              not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Where Data Is Processed</h2>
            <p>
              INVIGOV is based in the United States, and your information is processed and stored in
              the United States.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Changes</h2>
            <p>
              We may update this policy. Material changes will be posted here with a new effective
              date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Contact</h2>
            <p>
              Privacy questions or requests:{" "}
              <a href="mailto:support@invigov.com" className="text-blue-600 hover:underline">
                support@invigov.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
