import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfUsePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>
          </div>

          <p className="text-sm text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              By using FaceGuard AI, you agree to these Terms of Use. If you do not agree, 
              please do not use our service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Responsibilities</h2>
            <p className="text-gray-700 mb-4">By using this app, you agree that:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>You are responsible for your own decisions regarding skincare</li>
              <li>You understand the app provides recommendations for educational purposes only</li>
              <li>You will not rely solely on the app for medical advice</li>
              <li>Use of the app is at your own risk</li>
              <li>You are at least 13 years of age</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Prohibited Activities</h2>
            <p className="text-gray-700 mb-4">You must not:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Upload illegal, offensive, or inappropriate content</li>
              <li>Misuse or abuse the service</li>
              <li>Attempt to hack, reverse engineer, or compromise the system</li>
              <li>Share your account credentials with others</li>
              <li>Use the service for commercial purposes without permission</li>
              <li>Upload photos of other people without their consent</li>
              <li>Scrape or copy our content without authorization</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content, features, and functionality of FaceGuard AI are owned by us and 
              protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 mb-4">
              You retain ownership of photos you upload, but grant us a license to use them 
              for providing our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Subscription and Payments</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Premium subscriptions are billed monthly or yearly</li>
              <li>Payments are processed securely through Razorpay/Stripe</li>
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>Refunds are subject to our refund policy</li>
              <li>We reserve the right to change pricing with notice</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Account Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to suspend or terminate your account if you violate these 
              terms or engage in prohibited activities.
            </p>
            <p className="text-gray-700 mb-4">
              You may delete your account at any time from the settings page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              FaceGuard AI is provided "as is" without warranties of any kind. We are not 
              liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Any skin reactions or adverse effects from following recommendations</li>
              <li>Inaccuracies in AI analysis</li>
              <li>Service interruptions or data loss</li>
              <li>Third-party product quality or availability</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Disclaimer of Medical Advice</h2>
            <p className="text-gray-700 mb-4">
              <strong>Important:</strong> FaceGuard AI is not a substitute for professional 
              medical advice. Always consult a dermatologist for serious skin concerns.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We may update these terms from time to time. Continued use of the service after 
              changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms are governed by the laws of India. Any disputes will be resolved 
              in the courts of [Your City], India.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms of Use, contact us at:
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Email:</strong> support@faceguardai.com<br />
              <strong>Website:</strong> https://faceguardai.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfUsePage;
