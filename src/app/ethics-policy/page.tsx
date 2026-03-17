import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ethics Policy - Hotelier Africa',
  description: 'Ethics policy for Hotelier Africa publication',
};

export default function EthicsPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Ethics Policy
          </h1>
          <p className="text-xl text-gray-600">
            Hotelier Africa
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Overview</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                This Ethics Policy reflects the editorial principles and professional standards upheld
                by Hotelier Africa, a publication managed by Strategic Brand Focus
                Africa Limited (SBF Africa). It represents our commitment to responsible journalism, fair
                reporting, and ethical business conduct across our website, publications, social
                media platforms, events, and digital content.
              </p>

              <p>
                Hotelier Africa maintains a high ethical standard in all editorial, digital, and
                multimedia content published across our platforms. We are committed to accuracy,
                fairness, professionalism, and integrity in all information we provide to our readers,
                partners, and industry stakeholders.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Reporting Issues & Corrections</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                If you notice any information on our website, social media, publications, or video
                content that you believe is incorrect, misleading, or unethical, we encourage you to
                notify us at:
              </p>

              <p className="font-medium">
                <a href="mailto:info@sbfafrica.com" className="text-brand-blue hover:text-vibrant-blue">
                  info@sbfafrica.com
                </a>
              </p>

              <p>
                All feedback from readers, partners, and industry stakeholders is welcomed and
                appreciated. Where content is found to be factually inaccurate, misleading, or
                inconsistent with our editorial standards, we will review the matter and make
                corrections where necessary. Substantive corrections to published content will be
                clearly reflected for future readers.
              </p>

              <p>
                However, in line with the principles of independent journalism, Hotelier Africa does
                not alter editorial opinions, professional reviews, rankings, or industry commentary
                upon request unless a factual error has been identified. Editorial independence
                remains essential to our credibility and reputation.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Editorial Independence</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                Hotelier Africa maintains a strict separation between editorial content and
                commercial interests. Advertisers, sponsors, partners, or external parties do not
                influence editorial decisions, rankings, recognitions, or published opinions.
              </p>

              <p>
                We expect its editors, contributors, staff, partners, and representatives to
                deal fairly and honestly with readers, clients, suppliers, sponsors, and competitors.
                All interactions must be conducted in a manner that protects the credibility,
                reputation, and professionalism of the publication.
              </p>

              <p>
                Any reader, partner, advertiser, or stakeholder who engages with Hotelier Africa has
                the right to expect to be treated with fairness, honesty, transparency, and integrity.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Do Not Support</h2>
            
            <p className="text-gray-700 mb-4">
              We do not promote, support, or endorse:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Political propaganda or partisan agendas</li>
              <li>Illegal activities</li>
              <li>Hate speech, discrimination, or exploitation</li>
              <li>Cruelty toward humans or animals</li>
              <li>Conflict or illegal products</li>
              <li>Exploitative practices involving children, vulnerable groups, or communities</li>
              <li>Any activity that undermines ethical business conduct or professional integrity</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Professional Conduct</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                Hotelier Africa remains committed to responsible journalism, professional excellence,
                and ethical publishing in support of the growth and development of Africa's
                hospitality, tourism, and leisure industry.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Terms of Service</h2>
            
            <p className="text-gray-700">
              This Ethics Policy forms part of the general Terms & Conditions governing the use of
              Hotelier Africa websites, publications, and related services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Contact Us on Hotelier Website:</strong><br />
                Strategic Brand Focus Africa Limited<br />
                Head Office: 58 Mansour Street, Parakuo Estates, Dome - Accra, Ghana - West Africa<br />
                Email: <a href="mailto:marcom@sbfafrica.com" className="text-brand-blue hover:text-vibrant-blue">marcom@sbfafrica.com</a><br />
                Phone: <a href="tel:+233238454" className="text-brand-blue hover:text-vibrant-blue">+233 2384549</a>
              </p>

              <p className="text-sm text-gray-600">
                For partnerships, sponsorships, features, editorials, speaking engagements, and participation in our platforms, please contact our team.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
