import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const MedicalDisclaimerPage = () => {
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
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Medical Disclaimer</h1>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8">
            <p className="text-orange-900 font-semibold">
              ⚠️ IMPORTANT: This app is NOT a substitute for professional medical advice.
            </p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Not Medical Advice</h2>
            <p className="text-gray-700 mb-4">
              FaceGuard AI is an educational and informational tool designed to help you understand 
              your skin better. It is <strong>NOT</strong> intended to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Diagnose medical conditions</li>
              <li>Provide medical treatment recommendations</li>
              <li>Replace consultation with a licensed dermatologist</li>
              <li>Prescribe medications or treatments</li>
              <li>Offer professional medical advice</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">AI Limitations</h2>
            <p className="text-gray-700 mb-4">
              Our AI-powered analysis:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>May not be 100% accurate</li>
              <li>Cannot detect all skin conditions</li>
              <li>Should not be used for serious medical concerns</li>
              <li>Is based on visual analysis only</li>
              <li>Cannot replace professional examination</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">When to See a Doctor</h2>
            <p className="text-gray-700 mb-4">
              <strong>Consult a dermatologist immediately if you have:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Severe or persistent acne</li>
              <li>Unusual moles or skin growths</li>
              <li>Severe skin reactions or allergies</li>
              <li>Skin infections or open wounds</li>
              <li>Sudden changes in skin appearance</li>
              <li>Painful or bleeding skin conditions</li>
              <li>Any concerning skin symptoms</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Product Recommendations</h2>
            <p className="text-gray-700 mb-4">
              Our product recommendations are:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>General suggestions based on common skin types</li>
              <li>Not personalized medical prescriptions</li>
              <li>Should be verified with a dermatologist before use</li>
              <li>May not be suitable for everyone</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Always patch test new products</strong> and discontinue use if you experience 
              irritation, redness, or allergic reactions.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Use at Your Own Risk</h2>
            <p className="text-gray-700 mb-4">
              By using FaceGuard AI, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>You use the app at your own risk</li>
              <li>You are responsible for your skincare decisions</li>
              <li>We are not liable for any adverse effects</li>
              <li>You will consult professionals for medical concerns</li>
              <li>You understand the limitations of AI analysis</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">No Warranty</h2>
            <p className="text-gray-700 mb-4">
              FaceGuard AI is provided "as is" without any warranties, express or implied. 
              We do not guarantee:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Accuracy of AI analysis</li>
              <li>Effectiveness of recommendations</li>
              <li>Specific results or outcomes</li>
              <li>Suitability for your specific condition</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Professional Consultation</h2>
            <p className="text-gray-700 mb-4">
              <strong>We strongly recommend:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Consulting a licensed dermatologist for skin concerns</li>
              <li>Getting professional diagnosis before starting treatments</li>
              <li>Discussing any new skincare products with your doctor</li>
              <li>Seeking immediate medical attention for serious conditions</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              FaceGuard AI and its creators are not liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Any skin reactions or adverse effects</li>
              <li>Allergic reactions to recommended products</li>
              <li>Inaccurate AI analysis results</li>
              <li>Decisions made based on app recommendations</li>
              <li>Any damages resulting from app use</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For medical concerns, please consult a licensed dermatologist.
            </p>
            <p className="text-gray-700 mb-4">
              For app-related questions: <strong>support@faceguardai.com</strong>
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-8">
              <p className="text-red-900 font-semibold">
                ⚠️ REMEMBER: Always consult a healthcare professional for medical advice, 
                diagnosis, or treatment. FaceGuard AI is an educational tool, not a medical service.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedicalDisclaimerPage;
