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
            About Finance Abu Dhabi
          </h1>
          <div className="w-24 h-1 bg-brand-blue mx-auto mb-8"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Finance Abu Dhabi is a premium digital and print publication dedicated to capturing the
              evolving finance, investment, and economic landscape of the GCC region. Positioned as one
              of the region's authoritative voices on financial leadership, the magazine delivers high-level
              insights into banking, fintech, capital markets, economic diversification, sovereign wealth
              strategies, and the future of finance across Abu Dhabi and the wider Gulf.
            </p>

            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Published from Masdar City, Abu Dhabi, Finance Abu Dhabi is an initiative of Rad
              Communications Limited, a leading media, events, and corporate communications
              organisation committed to elevating thought leadership and industry excellence across the
              Middle East and Africa.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg my-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To provide authoritative, insightful, and forward-thinking coverage of the financial
                landscape in the GCC region, connecting leaders, investors, and decision-makers with
                the information and perspectives they need to navigate the evolving world of finance.
              </p>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Cover</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Banking and financial services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Fintech innovation and digital transformation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Capital markets and investment strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Economic diversification initiatives</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Sovereign wealth fund strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Executive interviews and thought leadership</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Industry events and conferences</span>
                </li>
              </ul>
            </div>

            <div className="mt-12 border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Finance Abu Dhabi Magazine</strong><br />
                  Business Center – First Floor, Incubator Building<br />
                  Masdar City, Abu Dhabi<br />
                  United Arab Emirates
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:marcom@radcommgroup.com" className="text-brand-blue hover:text-vibrant-blue">
                    marcom@radcommgroup.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
