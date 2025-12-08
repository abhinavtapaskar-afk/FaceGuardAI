import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicyPage = () => {
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
            <Shield className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>

          <p className="text-sm text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">We Respect Your Privacy</h2>
            <p className="text-gray-700 mb-4">
              At FaceGuard AI, we analyze your uploaded photos only to generate your skin results. 
              We do not sell your images or personal data to third parties.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Email Address:</strong> For account creation and communication</li>
              <li><strong>Photos You Upload:</strong> For skin analysis and progress tracking</li>
              <li><strong>Analytics Data:</strong> Usage patterns, device information, IP address</li>
              <li><strong>Scan Results:</strong> AI-generated skin analysis data</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why We Collect This Data</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>To improve AI accuracy and recommendations</li>
              <li>To show your personalized results</li>
              <li>To provide personalized skincare recommendations</li>
              <li>To track your progress over time with before/after comparisons</li>
              <li>To improve our services and user experience</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Store Your Images</h2>
            <p className="text-gray-700 mb-4">
              Images may be stored for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Progress tracking and historical comparison</li>
              <li>Before/After transformation visualization</li>
              <li>Improving our AI models (anonymized)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              All images are stored securely with encryption and access controls.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Services</h2>
            <p className="text-gray-700 mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>OpenAI:</strong> For AI-powered skin analysis</li>
              <li><strong>Supabase:</strong> For secure data storage</li>
              <li><strong>Razorpay/Stripe:</strong> For payment processing (we do not store card details)</li>
              <li><strong>Amazon/Flipkart:</strong> Affiliate links for product recommendations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Request deletion of your data anytime</li>
              <li>Download your data</li>
              <li>Opt-out of analytics</li>
              <li>Delete your account and all associated data</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise these rights, contact us at: <strong>support@faceguardai.com</strong>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Encryption in transit and at rest</li>
              <li>Secure authentication (JWT tokens)</li>
              <li>Regular security audits</li>
              <li>Access controls and monitoring</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our service is not intended for users under 13 years of age. We do not knowingly 
              collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicyPage;
