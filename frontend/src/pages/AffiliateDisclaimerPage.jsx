import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign } from 'lucide-react';

const AffiliateDisclaimerPage = () => {
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
            <DollarSign className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Affiliate Disclaimer</h1>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
            <p className="text-blue-900 font-semibold">
              ℹ️ Transparency Notice: We may earn commissions from product purchases.
            </p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Affiliate Relationships</h2>
            <p className="text-gray-700 mb-4">
              FaceGuard AI participates in affiliate marketing programs. This means we may earn 
              a commission when you purchase products through links in our app.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Affiliate Partners</h2>
            <p className="text-gray-700 mb-4">
              We are affiliates of:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Amazon Associates Program</strong> - We earn from qualifying purchases</li>
              <li><strong>Flipkart Affiliate Program</strong> - We earn commissions on sales</li>
              <li><strong>Other Skincare Brands</strong> - Direct affiliate partnerships</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How It Works</h2>
            <p className="text-gray-700 mb-4">
              When you click on a product link in our app and make a purchase:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
              <li>You are redirected to the retailer's website (Amazon, Flipkart, etc.)</li>
              <li>The link contains our unique affiliate tracking code</li>
              <li>If you complete a purchase, we may earn a small commission</li>
              <li><strong>You pay the same price</strong> - no extra cost to you</li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">No Extra Cost to You</h2>
            <p className="text-gray-700 mb-4">
              <strong>Important:</strong> Using our affiliate links does NOT increase the price 
              you pay. The commission comes from the retailer's marketing budget, not from your pocket.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Recommendations Are Genuine</h2>
            <p className="text-gray-700 mb-4">
              We only recommend products that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Are suitable for your skin type and concerns</li>
              <li>Have good reviews and proven effectiveness</li>
              <li>We believe will genuinely help you</li>
              <li>Are recommended by our AI based on your analysis</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Our recommendations are NOT influenced by commission rates.</strong> We 
              prioritize your skin health over affiliate earnings.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Choice</h2>
            <p className="text-gray-700 mb-4">
              You are free to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Purchase products through our links (supports us)</li>
              <li>Search for products independently</li>
              <li>Buy from any retailer you prefer</li>
              <li>Choose alternative products</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">No Endorsement</h2>
            <p className="text-gray-700 mb-4">
              Product recommendations do not constitute endorsement. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Product quality or effectiveness</li>
              <li>Retailer policies or customer service</li>
              <li>Product availability or pricing</li>
              <li>Shipping or delivery issues</li>
              <li>Adverse reactions to products</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Product Research</h2>
            <p className="text-gray-700 mb-4">
              We encourage you to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Research products before purchasing</li>
              <li>Read reviews and ingredients</li>
              <li>Check for allergens</li>
              <li>Consult a dermatologist if unsure</li>
              <li>Patch test new products</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Commission Disclosure</h2>
            <p className="text-gray-700 mb-4">
              Typical commission rates range from 5-15% of the product price. These commissions 
              help us:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Maintain and improve the app</li>
              <li>Keep the basic service free</li>
              <li>Develop new features</li>
              <li>Provide customer support</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Updates to This Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              We may update this affiliate disclaimer as we add new partners or change our 
              affiliate relationships. Check this page periodically for updates.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Questions?</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about our affiliate relationships or product recommendations, 
              contact us at: <strong>support@faceguardai.com</strong>
            </p>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-8">
              <p className="text-green-900">
                ✓ Thank you for supporting FaceGuard AI by using our affiliate links! 
                Your purchases help us keep the app free and continuously improving.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AffiliateDisclaimerPage;
