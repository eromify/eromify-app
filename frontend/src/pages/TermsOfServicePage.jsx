const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Terms of Service</h1>
          </div>

          {/* Content */}
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                By accessing and using Eromify, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">2. Use License</h2>
              <p className="text-sm lg:text-base leading-relaxed mb-4">
                Permission is granted to temporarily use Eromify for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm lg:text-base ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">3. AI Content Generation</h2>
              <p className="text-sm lg:text-base leading-relaxed mb-4">
                Eromify provides AI-powered content generation services. By using our services, you acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm lg:text-base ml-4">
                <li>Generated content is created by artificial intelligence</li>
                <li>You are responsible for reviewing and approving all generated content</li>
                <li>We do not guarantee the accuracy or appropriateness of generated content</li>
                <li>You must comply with all applicable laws when using generated content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">4. User Accounts</h2>
              <p className="text-sm lg:text-base leading-relaxed mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm lg:text-base ml-4">
                <li>Safeguarding the password and all activities under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Ensuring your account information remains accurate and up-to-date</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">5. Payment Terms</h2>
              <p className="text-sm lg:text-base leading-relaxed mb-4">
                Our services are provided on a subscription basis. By subscribing, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm lg:text-base ml-4">
                <li>Pay all fees associated with your subscription</li>
                <li>Automatic renewal unless cancelled before the renewal date</li>
                <li>No refunds for unused credits or partial subscription periods</li>
                <li>Price changes with 30 days notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">6. Prohibited Uses</h2>
              <p className="text-sm lg:text-base leading-relaxed mb-4">
                You may not use our service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm lg:text-base ml-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">7. Content Responsibility</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                You are solely responsible for the content you create, upload, or share using our services. You must ensure that your content does not violate any laws or infringe on the rights of others. We reserve the right to remove content that violates these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">8. Service Availability</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                We strive to maintain high service availability but do not guarantee uninterrupted access. We may temporarily suspend services for maintenance, updates, or technical issues without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                In no event shall Eromify, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                We reserve the right to modify or replace these Terms of Service at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through our support system.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage
