'use client';

import { useState } from 'react';
import { submitContractInquiry } from '@/app/actions';

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors when user starts typing
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      const result = await submitContractInquiry({
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        workEmail: formData.workEmail,
        country: formData.country || undefined,
        message: formData.message || undefined,
        agreeToCommunications: formData.agreeToCommunications,
      });

      if (result.success) {
        setSubmitSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          companyName: '',
          workEmail: '',
          country: '',
          message: '',
          agreeToCommunications: false
        });
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to submit your inquiry. Please try again or contact us directly at marcom@radcommgroup.com'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricingTiers = [
    {
      name: 'Standard',
      description: 'A streamlined, digital-first solution ideal for executives and organisations seeking professional visibility with essential customization.',
      features: [
        'One-off digital publications',
        'Concise editorial formats (10–30 pages)',
        'Clean, template-driven design',
        'Digital-only distribution',
        'Co-branding with Finance Abu Dhabi Magazine',
        'Core editorial customization'
      ],
      contactText: '📩 Contact Our Team'
    },
    {
      name: 'Professional',
      description: 'A balanced, high-impact publishing package offering extended storytelling, design flexibility, and both digital and print options.',
      features: [
        'One-off or recurring publications',
        'Extended formats (30–50 pages)',
        'Multiple design templates and layouts',
        'Co-branding with Finance Abu Dhabi Magazine',
        'Digital distribution with optional premium print editions',
        'Enhanced editorial and design customization'
      ],
      contactText: '📩 Contact Our Team',
      featured: true
    },
    {
      name: 'Premium',
      description: 'Our most exclusive publishing experience—crafted for maximum executive impact with full creative freedom and strategic regional distribution.',
      features: [
        'Comprehensive publications (one-off or recurring)',
        'Fully bespoke design, branding, and editorial structure',
        'Unlimited page length',
        'Co-branding with Finance Abu Dhabi Magazine',
        'High-quality premium print and digital editions',
        'Strategic and targeted distribution support',
        'Additional content creation services (interviews, photography, reporting)',
        'Optional launch event or executive unveiling'
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
            Finance Abu Dhabi Magazine
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Your Story, Published.<br />
            Your Leadership, Elevated.
          </p>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Finance Abu Dhabi Magazine offers bespoke publishing solutions crafted to spotlight
            visionary leaders, celebrate organisational excellence, and position your brand at the forefront
            of the regional and global financial landscape. Whether you require a dedicated feature, a recurring executive series, or a fully customised
            flagship edition, our publishing options are designed to amplify your influence and reach the
            audiences that matter most.
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
              Contact Us
            </h2>
            <p className="text-xl text-gray-600">
              Connect with our editorial and publishing team to discuss your requirements and receive a
              tailored quotation.
            </p>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Thank you for your inquiry!</h3>
                  <p className="text-green-700">
                    We've received your contract publishing inquiry and will get back to you soon. Our team will review your requirements and provide a tailored quotation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Submission Error</h3>
                  <p className="text-red-700">{submitError}</p>
                </div>
              </div>
            </div>
          )}

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
                <option value="">(Select your country)</option>
                <option value="uae">United Arab Emirates</option>
                <option value="saudi-arabia">Saudi Arabia</option>
                <option value="kuwait">Kuwait</option>
                <option value="qatar">Qatar</option>
                <option value="bahrain">Bahrain</option>
                <option value="oman">Oman</option>
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
                placeholder="Tell us about your publishing needs…"
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
                  I agree to receive communications from Finance Abu Dhabi Magazine.
                </label>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Finance Abu Dhabi Magazine is committed to safeguarding your privacy. Your personal
                information will only be used to manage your account and deliver the services you request.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                We may occasionally contact you regarding publications, features, and related content that
                may be of interest. You may unsubscribe at any time.
              </p>
              <p className="text-sm text-gray-600">
                By clicking Submit, you consent to Finance Abu Dhabi Magazine storing and processing the
                information provided to fulfil your request.
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
              Contact Us
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-brand-blue mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Finance Abu Dhabi Magazine</p>
                    <p className="text-gray-600">Business Center – First Floor, Incubator Building</p>
                    <p className="text-gray-600">Masdar City, Abu Dhabi</p>
                    <p className="text-gray-600">United Arab Emirates</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-brand-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:marcom@radcommgroup.com" className="text-brand-blue hover:text-blue-700 font-semibold">
                    marcom@radcommgroup.com
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
