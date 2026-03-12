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
              Hotelier Africa is a premium digital and print magazine dedicated to the evolving
              hospitality and tourism landscape across Africa. The publication provides in-depth insights
              into the hotel industry, luxury and business travel, tourism development, hospitality
              investments, and emerging trends shaping the sector.
            </p>

            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Through expert analysis, industry features, and exclusive interviews with leading hoteliers,
              investors, and tourism stakeholders, Hotelier Africa highlights innovations, best practices,
              and opportunities driving growth within Africa's vibrant hospitality ecosystem. This is an
              initiative of Strategic Brand Focus Africa LTD.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg my-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To provide authoritative, insightful, and forward-thinking coverage of the hospitality
                and tourism landscape across Africa, connecting hoteliers, investors, and decision-makers
                with the information and perspectives they need to navigate the evolving world of African
                hospitality.
              </p>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Cover</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Hotel industry news and developments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Luxury and business travel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Tourism development across Africa</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Hospitality investments and opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Emerging trends shaping the hospitality sector</span>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">•</span>
                  <span>Exclusive interviews with leading hoteliers and tourism stakeholders</span>
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
                  <strong>Hotelier Africa Magazine</strong><br />
                  An initiative of Strategic Brand Focus Africa LTD
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
