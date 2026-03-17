import { generateAboutMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = generateAboutMetadata();

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About Hotelier Africa
          </h1>
          <div className="w-24 h-1 bg-brand-blue mx-auto mb-8"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Hotelier Africa is the new digital destination for Africa's hospitality, catering, tourism,
              and leisure professionals, and the home of industry-leading hospitality publications
              on the web.
            </p>

            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Hotelier Africa delivers industry-specific intelligence to a targeted audience of hotel
              owners, general managers, hospitality executives, tourism operators, investors, and
              service providers across Africa. Our platform provides timely updates on industry
              trends, business developments, innovations, and the products and services shaping
              the future of hospitality on the continent.
            </p>

            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              We focus on Africa-wide and international hospitality news, exclusive interviews
              with hotel general managers and industry leaders, expert commentary and analysis,
              market intelligence, executive roundtable discussions, destination reports,
              investment insights, and product innovations relevant to the hospitality and tourism
              sector.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg my-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Reaching the key decision-makers in Africa's fast-growing hospitality industry
                is at the core of Hotelier Africa's mission. The publication offers hospitality suppliers,
                developers, consultants, and service providers a credible and effective platform to
                connect directly with industry leaders and influence purchasing, investment, and
                strategic decisions across the region.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Through our digital platforms, publications, rankings, and leadership events, Hotelier
                Africa serves as a trusted voice advancing professionalism, excellence, and
                growth in Africa's hospitality industry.
              </p>
            </div>

            <div className="mt-12 border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Advertising & Partnerships</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  For advertising enquiries, please contact:
                </p>
                <p>
                  <strong>Strategic Brand Focus Africa Limited</strong><br />
                  Head Office: 58 Mansour Street, Parakuo Estates, Dome- Accra, Ghana-West Africa<br />
                  <a href="mailto:marcom@sbfafrica.com" className="text-brand-blue hover:text-vibrant-blue">
                    marcom@sbfafrica.com
                  </a><br />
                  Phone: <a href="tel:+233238454" className="text-brand-blue hover:text-vibrant-blue">+233 2384549</a> / <a href="tel:+233505893884" className="text-brand-blue hover:text-vibrant-blue">+233 505893884</a>
                </p>
                <p className="text-sm text-gray-600 mt-6">
                  For partnerships, sponsorships, features, editorials, speaking engagements,
                  and participation in our platforms, please contact our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
