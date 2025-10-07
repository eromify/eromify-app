const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          </div>

          {/* Content */}
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="text-sm lg:text-base leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm lg:text-base ml-4">
                <li>Name and email address</li>
                <li>Payment information (processed securely by third-party providers)</li>
                <li>Content you create using our AI services</li>
                <li>Communications with our support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-sm lg:text-base leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm lg:text-base ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze usage and trends</li>
                <li>Detect, investigate, and prevent security incidents</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p className="text-sm lg:text-base leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm lg:text-base ml-4">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">5. AI Content and Data Processing</h2>
              <p className="text-sm lg:text-base leading-relaxed mb-4">
                When you use our AI services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm lg:text-base ml-4">
                <li>Your input prompts are processed to generate content</li>
                <li>Generated content is stored temporarily for service delivery</li>
                <li>We do not use your content to train our AI models without explicit consent</li>
                <li>You retain ownership of content you create</li>
                <li>We may use anonymized, aggregated data to improve our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
              <p className="text-sm lg:text-base leading-relaxed mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm lg:text-base ml-4">
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our service</li>
                <li>Provide personalized content and features</li>
                <li>Improve our service performance</li>
              </ul>
              <p className="text-sm lg:text-base leading-relaxed mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal or regulatory purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">8. Your Rights</h2>
              <p className="text-sm lg:text-base leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm lg:text-base ml-4">
                <li>Access and receive a copy of your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your personal information</li>
                <li>Restrict or object to certain processing activities</li>
                <li>Data portability (receive your data in a structured format)</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">10. International Data Transfers</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">11. Changes to This Policy</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
              <p className="text-sm lg:text-base leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us through our support system.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
