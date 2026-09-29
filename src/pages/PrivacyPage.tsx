import React from 'react';
import { Container } from '../components/common/Container.tsx';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import { ShieldCheck, Lock, EyeOff, Server, Cookie } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy', href: '/privacy' },
          ]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#f1ede4] border border-[#e3ded4] text-xs font-mono text-[#78716c] uppercase tracking-wider mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2d6a4f]" />
            Data Protection & Privacy
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1c1917] tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm font-mono text-[#78716c]">
            Effective Date: February 20, 2026 • Last Reviewed: February 2026
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl space-y-8 text-[#57534e]">
          {/* Summary Box */}
          <div className="bg-[#f2f8f5] border border-[#b7dfcb] rounded-lg p-6 text-sm leading-relaxed text-[#1b4332]">
            <h2 className="font-serif text-base font-bold text-[#1b4332] mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#2d6a4f]" />
              Privacy Summary in Plain English
            </h2>
            <p>
              Home Project Planner is an open, client-side informational planning resource. We do not require user accounts,
              we do not use advertising cookies or cross-site behavioral profiling networks, and we do not store your room
              dimensions or project inputs on our servers. All calculations execute directly in your browser. We use Google
              Analytics 4 strictly for aggregate, non-personally identifiable site performance and traffic measurement.
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              1. Information We Collect
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                <strong>No Personal Accounts or Registration:</strong> You are not required to create an account, register,
                or provide personal identifying information (such as your name, physical address, or phone number) to access
                our calculators, guides, and tools.
              </p>
              <p>
                <strong>Client-Side Calculator Inputs:</strong> When you enter measurements (such as room length, wall height,
                concrete slab thickness, or waste percentages) into our calculators, those values are processed exclusively in
                your web browser’s active memory using client-side JavaScript. <strong>We do not save, record, or transmit your
                project dimensions to our servers or any third-party database.</strong> When you close or refresh your browser tab,
                your inputs are reset.
              </p>
            </div>
          </section>

          {/* Section 2: Cookies and Local Storage */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917] flex items-center gap-2">
              <Cookie className="h-5 w-5 text-[#b8532b]" />
              2. Cookies & Analytics
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                To provide transparency regarding how data is handled when you browse Home Project Planner, we clearly distinguish between commercial advertising trackers and privacy-conscious aggregate analytics:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm text-[#57534e]">
                <li>
                  <strong>Advertising Cookies:</strong> We do not use third-party advertising cookies, retargeting pixels, or commercial ad network scripts.
                </li>
                <li>
                  <strong>Behavioral Advertising & Profiling:</strong> We do not engage in behavioral profiling, interest-based user targeting, keystroke recording, or session replays.
                </li>
                <li>
                  <strong>Cross-Site Advertising Trackers:</strong> We do not deploy social media tracking pixels (such as Meta Pixel) or cross-site advertising beacons that track you across other domains.
                </li>
                <li>
                  <strong>Aggregate Analytics:</strong> We collect only high-level, aggregate metrics (such as total page visits, popular calculator usage rates, and general referral channels) to identify broken links, optimize calculator load times, and prioritize new project guides.
                </li>
                <li>
                  <strong>Google Analytics 4 (GA4):</strong> We utilize Google Analytics 4 configured with strict privacy safeguards. GA4 uses first-party cookies (such as <code className="font-mono text-xs bg-[#f5f2eb] px-1 py-0.5 rounded">_ga</code>) solely to distinguish anonymous, aggregated browser sessions. It does not collect personally identifiable information (PII), and it never captures your room measurements, custom price inputs, or project results.
                </li>
              </ul>
              <p>
                <strong>Client-Side Computation:</strong> All mathematical estimates, packaging conversions, and waste allowances run directly within your browser session without persisting personal project files on remote servers.
              </p>
            </div>
          </section>

          {/* Section 3: Server Logging */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917] flex items-center gap-2">
              <Server className="h-5 w-5 text-[#78716c]" />
              3. Server Logs
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Like virtually all web servers, the infrastructure hosting this site may automatically log standard,
                non-personally identifiable technical connection data. These log entries typically include:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-[#78716c] font-mono">
                <li>Internet Protocol (IP) address of the requesting device</li>
                <li>Browser type, operating system, and user-agent string</li>
                <li>Requested URL path and HTTP response status code</li>
                <li>Date and time timestamp of the request</li>
              </ul>
              <p>
                These logs are used solely for server security monitoring, DDoS mitigation, network diagnostics, and maintaining
                the operational stability of the hosting environment.
              </p>
            </div>
          </section>

          {/* Section 4: Third-Party Links & Services */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              4. Third-Party Links & External Services
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Our guides may occasionally reference standard industry organizations, municipal building codes, or manufacturing
                guidelines for informational context. We do not operate or control third-party websites and are not responsible for
                their privacy practices or content. We encourage you to review the privacy policies of any third-party website you visit.
              </p>
              <p>
                We do not participate in third-party advertising networks (such as Google AdSense) or affiliate tracking networks.
              </p>
            </div>
          </section>

          {/* Section 5: Children's Privacy */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              5. Children's Privacy
            </h2>
            <p className="text-sm leading-relaxed">
              Home Project Planner is intended for general audiences planning residential home improvement and DIY projects.
              We do not knowingly collect or solicit personal information from children under the age of 13.
            </p>
          </section>

          {/* Section 6: Updates & Contact */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              6. Policy Updates & Contact
            </h2>
            <p className="text-sm leading-relaxed">
              We may update this Privacy Policy from time to time to reflect site enhancements or technical changes. Any revisions
              will be posted directly on this page with an updated effective date.
            </p>
            <p className="text-sm leading-relaxed">
              If you have questions regarding this Privacy Policy or our data practices, please visit our{' '}
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/contact');
                }}
                className="text-[#b8532b] underline font-medium"
              >
                Contact & Feedback page
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
};
