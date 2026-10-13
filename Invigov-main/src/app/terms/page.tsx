import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Terms of Service - INVIGOV",
  description: "Terms of Service for the INVIGOV platform.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">INVIGOV | Effective October 2, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Agreement</h2>
            <p>
              By creating an account or using invigov.com or the INVIGOV platform (the &quot;Service&quot;),
              you agree to these Terms. The Service is operated by Invigov LLC (&quot;INVIGOV,&quot;
              &quot;we,&quot; &quot;us&quot;). If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. The Service</h2>
            <p>
              INVIGOV provides software tools for federal contracting compliance, including a guided
              SAM.gov registration workflow, preparation of FAR/DFARS certification drafts and
              compliance documents, renewal deadline tracking, and email alerts. Available features
              depend on your plan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Not Legal Advice</h2>
            <p>
              INVIGOV provides software tools and general information, not legal advice. Use of the
              Service does not create an attorney-client relationship. For advice on your specific
              situation, consult a qualified attorney.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. No Government Affiliation; SAM.gov Is Free
            </h2>
            <p>
              INVIGOV is an independent software platform. It is not affiliated with or endorsed by
              SAM.gov, the General Services Administration, or the U.S. Government. Registering and
              renewing in SAM.gov is free when done directly with the government. You pay INVIGOV
              for software tools, not for registration.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Your Responsibilities</h2>
            <p>
              You are solely responsible for the accuracy and completeness of the information you
              enter; for reviewing every generated document and certification before you rely on or
              submit it; for submitting your registration and any filings to SAM.gov or any agency;
              and for meeting all deadlines. Generated documents are drafts based on the information
              you provide.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Accounts</h2>
            <p>
              You must be at least 18 and authorized to act for your business. Provide accurate
              information, keep your credentials secure, and notify us promptly of unauthorized
              access. You are responsible for activity under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Plans, Billing, and Trials</h2>
            <p>
              Paid plans are billed in advance, monthly or annually, through our payment processor.
              Prices are shown on the Pricing page and are exclusive of applicable taxes.
            </p>
            <p className="mt-3">
              If a free trial is offered, no credit card is required to start. The trial lasts for
              the stated period (currently 7 days) and then simply ends. You will not be charged
              automatically when the trial ends. Paid access continues only if you choose to
              upgrade and complete checkout.
            </p>
            <p className="mt-3">
              After you subscribe to a paid plan, subscriptions renew automatically until canceled.
              You may cancel at any time in your account; access continues through the end of the
              paid period.
            </p>
            <p className="mt-3">
              Fees are non-refundable except where required by law. We will give at least 30 days’
              notice of price changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Alerts and Monitoring</h2>
            <p>
              Deadline tracking and alerts are a convenience and are not guaranteed. Delivery can be
              affected by email filtering, outages, incorrect information, or changes to SAM.gov or
              other government systems. Always confirm your registration status and deadlines
              directly in SAM.gov.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Acceptable Use</h2>
            <p>
              You agree not to use the Service for unlawful purposes; submit false or misleading
              information; interfere with or disrupt the Service; scrape, reverse engineer, or
              attempt to access non-public areas; or resell the Service without our written
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Your Data</h2>
            <p>
              You retain ownership of the data you submit. You grant us a limited license to process
              it solely to provide and improve the Service. Our Privacy Policy explains how we handle
              personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Our Intellectual Property</h2>
            <p>
              The Service, including its software, design, and content, is owned by INVIGOV and its
              licensors. While you hold an account, we grant you a limited, non-exclusive,
              non-transferable license to use it in accordance with these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Third-Party Services</h2>
            <p>
              The Service relies on third-party providers, such as payment, hosting, email delivery,
              and government data sources. We are not responsible for their availability, accuracy,
              or changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">13. Disclaimers</h2>
            <p className="uppercase">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITHOUT WARRANTIES
              OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT YOUR REGISTRATION WILL BE
              ACCEPTED OR MAINTAINED, THAT YOU WILL REMAIN ELIGIBLE FOR ANY CONTRACT OR AWARD, THAT
              GENERATED DOCUMENTS WILL SATISFY ANY REQUIREMENT, OR THAT THE SERVICE WILL BE
              UNINTERRUPTED OR ERROR-FREE.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">14. Limitation of Liability</h2>
            <p className="uppercase">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, INVIGOV WILL NOT BE LIABLE FOR INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS,
              CONTRACTS, OR AWARDS. OUR TOTAL LIABILITY FOR ANY CLAIM RELATED TO THE SERVICE WILL NOT
              EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM AROSE.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">15. Indemnification</h2>
            <p>
              You agree to indemnify and hold INVIGOV harmless from claims, losses, and expenses
              arising from your misuse of the Service, your violation of these Terms, or inaccurate
              information you submit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">16. Termination</h2>
            <p>
              You may stop using the Service at any time. We may suspend or terminate access for
              violation of these Terms or to protect the Service or other users. Sections that by
              their nature should survive termination will survive.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">17. Changes</h2>
            <p>
              We may update these Terms. Material changes will be posted on this page with a new
              effective date, and continued use after the change means you accept it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">18. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Texas, without regard to
              conflict-of-law rules. Any dispute will be brought in the state or federal courts
              located in Texas, and you consent to their jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">19. Contact</h2>
            <p>
              Questions about these Terms:{" "}
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
