'use client';

import { useState } from 'react';
import { Metadata } from 'next';

export default function ContractPublishingPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    workEmail: '',
    country: '',
    message: '',
    agreeToCommunications: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your inquiry! We will get back to you soon.');
      setFormData({
        firstName: '',
        lastName: '',
        companyName: '',
        workEmail: '',
        country: '',
        message: '',
        agreeToCommunications: false
      });
    }, 2000);
  };

  const pricingTiers = [
    {
      name: 'Standard',
      description: 'An efficient, digital-first publishing option for professionals and organizations seeking visibility with essential customization.',
      features: [
        'One-off digital publications',
        'Concise formats (10–30 pages)',
        'Streamlined template design',
        'Digital-only distribution',
        'Co-branding option with The Boardroom Magazine',
        'Core customization features'
      ],
      contactText: '📩 Contact Our Team'
    },
    {
      name: 'Professional',
      description: 'A versatile solution for leaders who want a balance of flexibility, impact, and design—with digital reach and print availability.',
      features: [
        'One-off or recurring publications',
        'Extended formats (30–50 pages)',
        'Multiple template options',
        'Co-branding option with The Boardroom Magazine',
        'Digital with optional print editions',
        'Enhanced customization'
      ],
      contactText: '📩 Contact Our Team',
      featured: true
    },
    {
      name: 'Premium',
      description: 'Our most exclusive publishing experience—crafted for maximum impact with full design freedom, high-quality production, and strategic distribution.',
      features: [
        'Comprehensive publications (recurring or one-off)',
        'Fully bespoke design and branding',
        'Unlimited length',
        'Co-branding option with The Boardroom Magazine',
        'Premium print and digital formats included',
        'Targeted distribution support',
        'Additional content creation services',
        'Optional launch event'
      ],
      contactText: '📩 Contact Our Team'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-blue via-blue-700 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Contract Publishing
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            The Boardroom Magazine
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Your Story, Published.<br />
            Your Brand, Elevated.
          </p>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            We provide tailored publishing solutions designed to spotlight your leadership, 
            amplify your brand, and connect with the audiences that matter. Select the level 
            of customization, format, and distribution that best fits your needs—whether it's 
            a special feature, a recurring series, or a bespoke flagship edition.
          </p>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Publishing Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the level of customization, format, and distribution that best fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl ${
                  tier.featured 
                    ? 'ring-4 ring-brand-blue transform scale-105' 
                    : 'hover:transform hover:scale-105'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-blue text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{tier.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{tier.description}</p>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Includes:</h4>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-brand-blue mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center">
                  <button className="w-full bg-brand-blue text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                    {tier.contactText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Reach us for more information
            </h2>
            <p className="text-xl text-gray-600">
              Get in touch to discuss your publishing needs and receive a personalized quote
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="workEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Work email *
              </label>
              <input
                type="email"
                id="workEmail"
                name="workEmail"
                value={formData.workEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country/Region
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              >
                <option value="">Select a country</option>
                <option value="ghana">Ghana</option>
                <option value="uae">United Arab Emirates</option>
                <option value="nigeria">Nigeria</option>
                <option value="south-africa">South Africa</option>
                <option value="kenya">Kenya</option>
                <option value="egypt">Egypt</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="Tell us about your publishing needs..."
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start mb-4">
                <input
                  type="checkbox"
                  id="agreeToCommunications"
                  name="agreeToCommunications"
                  checked={formData.agreeToCommunications}
                  onChange={handleInputChange}
                  className="mt-1 mr-3"
                />
                <label htmlFor="agreeToCommunications" className="text-sm text-gray-700">
                  I agree to receive communications from The Boardroom Magazine.
                </label>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                The Boardroom Magazine is committed to protecting and respecting your privacy. 
                We will only use your personal information to manage your account and deliver 
                the products and services you have requested from us.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                From time to time, we may wish to contact you regarding our publications, 
                features, and related content that we believe may be of interest to you. 
                You may unsubscribe from these communications at any time.
              </p>
              <p className="text-sm text-gray-600">
                By clicking "Submit" below, you consent to allow The Boardroom Magazine to 
                store and process the personal information provided above in order to deliver 
                the requested content.
              </p>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-blue text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              CONTACT US
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Africa Office */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Africa Office</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-brand-blue mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Ghana West-Africa - Accra</p>
                    <p className="text-gray-600">Kwabenya, Franko Estates.</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-brand-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@tgbboardroom.com" className="text-brand-blue hover:text-blue-700 font-semibold">
                    info@tgbboardroom.com
                  </a>
                </div>
              </div>
            </div>

            {/* International Office */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">International Office</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-brand-blue mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Business Center - First Floor, Incubator Building</p>
                    <p className="text-gray-600">Masdar City, Abu Dhabi - United Arab Emirates.</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-brand-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@arabiangovernance.com" className="text-brand-blue hover:text-blue-700 font-semibold">
                    info@arabiangovernance.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
