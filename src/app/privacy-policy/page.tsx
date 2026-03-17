import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Hotelier Africa',
  description: 'Privacy policy for Hotelier Africa website',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Hotelier Africa
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">1. OUR APPROACH</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>1.1</strong> This website and related services (collectively, the "Site") are operated by
                Hotelier Africa, a publication and digital media platform managed by Strategic
                Brand Focus Africa Limited (SBF Africa) ("Hotelier Africa", "we", "us", or "our").
                SBF Africa is a communications, media, and business events company
                headquartered in Africa with regional operations across the continent.
              </p>

              <p>
                <strong>1.2</strong> This Privacy Policy explains how we collect, use, store, and protect personal
                information obtained through our Site. Some of this information may identify you
                directly and is referred to as Personal Data. We are committed to protecting your
                privacy and handling your Personal Data responsibly and in accordance with
                applicable data protection laws.
              </p>

              <p>
                <strong>1.3</strong> The terms "you", "your", "user", or "visitor" refer to any person who
                accesses, browses, or uses this Site.
              </p>

              <p>
                <strong>1.4</strong> Any Personal Data you provide to us through the Site, email, event registrations,
                subscriptions, or other communication channels will be processed in accordance
                with this Privacy Policy. If you provide personal information relating to another
                person, you confirm that you have their consent to share such information with us.
              </p>

              <p>
                <strong>1.5</strong> By accessing or using this Site, you agree to our Terms & Conditions and this
                Privacy Policy. If you do not agree with these terms, you should not use this Site.
              </p>

              <p>
                <strong>1.6</strong> If you have any questions regarding this Privacy Policy, you may contact us at:<br />
                Email: <a href="mailto:info@sbfafrica.com" className="text-brand-blue hover:text-vibrant-blue">info@sbfafrica.com</a><br />
                Operator: Strategic Brand Focus Africa Limited (SBF Africa)
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">2. CHANGES TO THIS PRIVACY POLICY</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>2.1</strong> We may update this Privacy Policy from time to time to reflect changes in our
                services, legal requirements, or operational practices. The version published on this
                Site at the time of your visit will apply.
              </p>

              <p>
                <strong>2.2</strong> Where significant changes are made, we may notify users through the website,
                email, or other appropriate communication channels. Continued use of the Site after
                changes means you accept the updated Policy.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">3. WHAT INFORMATION DO WE COLLECT?</h2>
            
            <p className="text-gray-700 mb-4">We may collect and store the following information:</p>
            
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Information you provide to us</h3>
                <p className="mb-4">You may provide personal information when you:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Subscribe to newsletters or publications</li>
                  <li>Register for events, conferences, awards, or summits</li>
                  <li>Submit nominations or applications</li>
                  <li>Contact us through forms or email</li>
                  <li>Participate in surveys, competitions, or promotions</li>
                </ul>
                <p className="mt-4 mb-4">This information may include:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Company / organization name</li>
                  <li>Job title / position</li>
                  <li>Country / location</li>
                  <li>Payment details (where applicable)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Information collected automatically</h3>
                <p className="mb-4">We may collect information about how you use our Site, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pages visited</li>
                  <li>Content viewed</li>
                  <li>Device type</li>
                  <li>Browser type</li>
                  <li>IP address</li>
                  <li>Date and time of visits</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Information generated from usage</h3>
                <p>We may analyse user activity to understand audience interests, improve content,
                and enhance our services, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>Subscription preferences</li>
                  <li>Event participation history</li>
                  <li>Content engagement</li>
                  <li>Advertising interaction</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">4. PURPOSES FOR WHICH WE USE PERSONAL DATA</h2>
            
            <p className="text-gray-700 mb-4">We may use your Personal Data for the following purposes:</p>
            <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
              <li>To create and manage user accounts or subscriptions</li>
              <li>To provide access to publications, newsletters, rankings, and digital content</li>
              <li>To process event registrations, award nominations, and conference participation</li>
              <li>To respond to inquiries, requests, or applications</li>
              <li>To send updates about industry news, events, awards, and publications</li>
              <li>To process payments for services, advertising, sponsorship, or event participation</li>
              <li>To improve our website, publications, and services</li>
              <li>To ensure security and prevent fraud or misuse</li>
              <li>To send marketing or promotional communications (only where permitted)</li>
              <li>To comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">5. SECURITY</h2>
            
            <p className="text-gray-700">
              We are committed to protecting your Personal Data.
              We use appropriate technical, administrative, and organisational measures to
              safeguard information against unauthorized access, loss, misuse, or disclosure.
              However, because the Internet is not completely secure, we cannot guarantee
              absolute security of data transmitted online.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">6. DISCLOSURE OF USER INFORMATION</h2>
            
            <p className="text-gray-700 mb-4">We may share your information only where necessary and in accordance with the
            law, including with:</p>
            <ul className="list-decimal list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Our parent company, affiliates, or partners</li>
              <li>Service providers (hosting, payment processing, email services, event management)</li>
              <li>Advertising and media partners (for marketing or sponsorship activities)</li>
              <li>Event partners or co-organizers where required for participation</li>
              <li>Legal authorities where required by law</li>
              <li>Third parties where you have given consent</li>
            </ul>
            <p className="text-gray-700">We do not sell personal data to unauthorized third parties.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">7. INTERNATIONAL DATA TRANSFERS</h2>
            
            <p className="text-gray-700">
              Because Hotelier Africa operates across multiple countries, your Personal Data may
              be stored or processed in different jurisdictions.
              Where data is transferred internationally, we take reasonable steps to ensure it is
              protected in accordance with applicable data protection laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">8. COOKIES</h2>
            
            <p className="text-gray-700">
              Our Site may use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-2 mb-4">
              <li>Improve user experience</li>
              <li>Understand website traffic</li>
              <li>Remember user preferences</li>
              <li>Deliver relevant content and advertising</li>
            </ul>
            <p className="text-gray-700">
              By using this Site, you consent to the use of cookies unless you disable them in your
              browser settings.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">9. CHILDREN</h2>
            
            <p className="text-gray-700">
              This Site is intended for professionals and industry users.
              We do not knowingly collect personal data from children under the age of 18.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">10. LINKS TO OTHER WEBSITES</h2>
            
            <p className="text-gray-700">
              Our Site may contain links to external websites.
              We are not responsible for the privacy practices of those websites, and users should
              review their policies separately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">11. CONTACT</h2>
            
            <p className="text-gray-700">
              For any privacy-related inquiries, please contact:<br /><br />
              <strong>Hotelier Africa</strong><br />
              Operated by Strategic Brand Focus Africa Limited<br />
              Email: <a href="mailto:marcom@sbfafrica.com" className="text-brand-blue hover:text-vibrant-blue">marcom@sbfafrica.com</a><br />
              Website: <a href="https://www.hotelierafricamag.com" className="text-brand-blue hover:text-vibrant-blue">www.hotelierafricamag.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
