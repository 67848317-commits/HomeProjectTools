import React from 'react';
import { Container } from '../components/common/Container.tsx';
import { Breadcrumbs } from '../components/common/Breadcrumbs.tsx';
import { Scale, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-8 md:py-12">
      <Container>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Terms of Use', href: '/terms' },
          ]}
          onNavigate={onNavigate}
        />

        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#f1ede4] border border-[#e3ded4] text-xs font-mono text-[#78716c] uppercase tracking-wider mb-4">
            <Scale className="h-3.5 w-3.5 text-[#b8532b]" />
            Terms & Disclaimers
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1c1917] tracking-tight mb-4">
            Terms of Use
          </h1>
          <p className="text-sm font-mono text-[#78716c]">
            Effective Date: February 20, 2026 • Last Reviewed: February 2026
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl space-y-8 text-[#57534e]">
          {/* Summary Banner */}
          <div className="bg-[#fcf4ee] border border-[#f3c8b4] rounded-lg p-6 text-sm leading-relaxed text-[#7c2d12]">
            <h2 className="font-serif text-base font-bold text-[#7c2d12] mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#b8532b]" />
              Important Planning Notice
            </h2>
            <p>
              Home Project Planner provides free informational worksheets to assist with residential project planning and
              material budgeting. These tools do not provide professional engineering calculations, architectural blueprints,
              building-code compliance certifications, or guaranteed merchant quotes. Always verify field measurements,
              product specifications, and local code requirements before buying materials or beginning physical work.
            </p>
          </div>

          {/* Section 1: Acceptance of Terms */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm leading-relaxed">
              By accessing and using Home Project Planner (the "Website"), you agree to be bound by these Terms of Use and our
              Privacy Policy. If you do not agree to these terms, please discontinue use of our calculators, tools, and guides.
            </p>
          </section>

          {/* Section 2: Informational and Planning Nature */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              2. Informational & Planning Purpose Only
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                All calculations, material quantity recommendations, packaging estimates, waste factors, and cost ranges
                are provided solely for preliminary planning and educational purposes.
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#57534e]">
                <li>
                  <strong>Not Professional Engineering:</strong> Our tools do not evaluate structural integrity, soil load capacities,
                  foundation settling, span ratings, or seismic/wind engineering requirements.
                </li>
                <li>
                  <strong>Not Building Code Compliance:</strong> Local building codes, frost depth requirements, zoning setbacks,
                  and permit mandates vary substantially by municipality and state. The Website does not determine legal or code compliance.
                </li>
                <li>
                  <strong>Not Official Contractor Bids:</strong> Cost estimates are national planning benchmarks and do not constitute
                  a contract, bid, or guarantee of actual retailer pricing or contractor labor rates.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: User Verification Responsibility */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              3. User Verification Responsibility
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Real-world jobsites possess unique variances—such as out-of-square walls, uneven subgrade slope, varying
                lumber moisture content, and manufacturer packaging changes.
              </p>
              <p>
                As a user of this Website, you are solely responsible for:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4]">
                  <span className="font-semibold text-[#1c1917] block mb-1">Field Measurements</span>
                  Physically measuring actual site dimensions, door openings, and angles before placing orders.
                </div>
                <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4]">
                  <span className="font-semibold text-[#1c1917] block mb-1">Product Specifications</span>
                  Verifying current package coverage (sq ft/carton, bag yields, stick lengths) with your retailer.
                </div>
                <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4]">
                  <span className="font-semibold text-[#1c1917] block mb-1">Building Permits & Codes</span>
                  Checking local jurisdiction requirements, utility call-before-you-dig (811) checks, and permits.
                </div>
                <div className="p-3 rounded bg-[#f7f5f0] border border-[#e3ded4]">
                  <span className="font-semibold text-[#1c1917] block mb-1">Safety & Installation</span>
                  Adhering to manufacturer safety instructions, personal protective equipment (PPE), and cure times.
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Intellectual Property */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              4. Intellectual Property
            </h2>
            <p className="text-sm leading-relaxed">
              The design, interactive calculator source code, calculation architectures, companion guides, and text content
              on Home Project Planner are protected by copyright and intellectual property laws. You may use our worksheets for
              personal or internal business planning. You may not reproduce, scrape, republish, or redistribute our software
              engines or content without prior written permission.
            </p>
          </section>

          {/* Section 5: Limitation of Liability */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              5. Disclaimer of Warranties & Limitation of Liability
            </h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                The Website and its tools are provided on an "as is" and "as available" basis without warranties of any kind,
                either express or implied.
              </p>
              <p>
                To the fullest extent permissible under applicable law, Home Project Planner and its contributors disclaim all
                warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and
                non-infringement. Under no circumstances shall Home Project Planner be liable for any direct, indirect, incidental,
                consequential, or special damages (including, without limitation, material shortages, material surplus, restocking
                fees, construction delays, or structural damage) arising from the use of or inability to use our tools.
              </p>
            </div>
          </section>

          {/* Section 6: Contact */}
          <section className="bg-[#ffffff] border border-[#e3ded4] rounded-lg p-6 md:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#1c1917]">
              6. Contact Information
            </h2>
            <p className="text-sm leading-relaxed">
              If you have questions regarding these Terms of Use, please reach out via our{' '}
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
