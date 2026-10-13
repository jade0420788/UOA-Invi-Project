import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/#platform", label: "Platform" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer id="footer" className="border-t bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-sm text-gray-500"
        >
          {FOOTER_LINKS.map((link, index) => (
            <span key={link.href} className="inline-flex items-center gap-x-3">
              {index > 0 && <span aria-hidden="true" className="text-gray-300">|</span>}
              <Link href={link.href} className="hover:text-gray-700 transition-colors">
                {link.label}
              </Link>
            </span>
          ))}
        </nav>

        <p
          id="footer-disclaimer"
          className="mt-6 text-xs text-gray-500 text-center max-w-4xl mx-auto leading-relaxed"
        >
          INVIGOV is not affiliated with or endorsed by SAM.gov or the U.S. Government.
          INVIGOV provides software tools and general information, not legal advice.
          Use of the platform does not create an attorney-client relationship.
        </p>

        <p className="mt-4 text-sm text-gray-500 text-center">
          &copy; 2026 Invigov LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
