import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const AffiliatePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <img src="/logo.png" alt="Eromify" className="h-40 w-auto" />
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Home</Link>
                <Link to="/marketplace" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Marketplace</Link>
                <a href="/#features" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Features</a>
                <a href="/#pricing" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Pricing</a>
                <Link to="/affiliate" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Affiliate</Link>
                <a href="/#faq" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">FAQ</a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
            </div>
            {/* Mobile buttons and menu */}
            <div className="md:hidden flex items-center space-x-2">
              <Link to="/login" className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <Link to="/marketplace" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Marketplace</Link>
              <a href="/#features" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Features</a>
              <a href="/#pricing" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
              <Link to="/affiliate" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">Affiliate</Link>
              <a href="/#faq" className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium">FAQ</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-transparent border border-pink-400 text-white mb-6">
            Affiliate Program
          </div>
          
          <h1 className="text-5xl md:text-7xl font-medium mb-6">
            Get Paid{' '}
            <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
              $200/Month
            </span>
            <br />
            for Posting Daily Content!
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Join the{' '}
            <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent font-medium">
              Eromify Affiliate Program
            </span>
            {' '}and earn guaranteed pay for sharing your faceless content. Minimum view threshold ensures you get paid.
          </p>
          
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <a href="https://whop.com/eromify/eromify-affiliate/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-500 transition-all text-center">
                      Join Now
                    </a>
                  </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="-mt-12 mb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
            <video 
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            >
              <source src="/affiliate.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-4">How It Works</p>
            <h2 className="text-5xl md:text-6xl font-semibold mb-4">
              <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                Step-by-Step
              </span>
              , 20 Min/Day
            </h2>
            <p className="text-xl text-gray-400">
              Earn <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent font-medium">$200/month</span> in Just 20 Minutes a Day
            </p>
          </div>

          {/* Steps */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1: Sign Up */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">1</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                    Sign Up
                  </span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Fill out a quick form with your name, email, and PayPal — you're instantly in the program.
                </p>
              </div>
            </div>

            {/* Step 2: Account Creation */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                    Account Creation
                  </span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Create a new Instagram account. Use the format: aimoney + an American male name. Example: aimoneynick
                </p>
              </div>
            </div>

            {/* Step 3: Account Setup */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                    Account Setup
                  </span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Choose a luxury or wealth-themed photo for your profile picture. Set your bio as follows: "AI girls made me $270k DM 'print' to learn how" Add this link to your bio: https://www.eromify.com/
                </p>
              </div>
            </div>

            {/* Step 4: Warm Up */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">4</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                    Warm Up
                  </span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Spend 2 days warming up your account before posting. Activities to do: scroll, like, comment, share, follow, and repost. Start posting after the 2-day warm-up.
                </p>
              </div>
            </div>

            {/* Step 5: Edit Content */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">5</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                    Edit Content
                  </span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Get your content assets and open Canva to create the image as shown above. Use CapCut to edit videos: add a black fade and keep the clip around 6–8 seconds. Logo must be clearly visible in reels.
                </p>
              </div>
            </div>

            {/* Step 6: Post Daily */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">6</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                    Post Daily
                  </span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Post your videos on the account. Recommended frequency: 1–3 posts per day. Post caption: link in bio or comment 'print' for the full guide. You must send out guide in DMs.
                </p>
              </div>
            </div>

            {/* Step 7: Get Paid */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">7</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                    Get Paid
                  </span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Once your content hits a minimum of 100k views in 30 days, you automatically earn $200/month via PayPal. Each additional 1 million views earns $100 in bonuses. No maximum earnings limit.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <a href="https://whop.com/eromify/eromify-affiliate/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-12 py-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-500 transition-all text-xl">
              Join Now
            </a>
          </div>

          {/* Tips for Success */}
          <div className="max-w-5xl mx-auto mt-20">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                Tips for Success
              </span>
            </h3>
            <p className="text-xl text-gray-400 mb-12 text-center">
              Maximize views, engagement, and earnings with these proven strategies.
            </p>
            <div className="bg-black border border-gray-800 rounded-2xl p-10">
              <ul className="space-y-6 text-gray-300 text-lg">
                <li className="flex items-start">
                  <span className="text-pink-400 mr-4 text-xl">•</span>
                  <span>Stick to the posting schedule.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-4 text-xl">•</span>
                  <span>Engage with other accounts in the same niche.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-4 text-xl">•</span>
                  <span>Consistency + style = higher virality potential.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-4 text-xl">•</span>
                  <span>Don't post the same video repeatedly - mix it up to keep your audience engaged.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-4 text-xl">•</span>
                  <span>Ask ChatGPT for engaging text hooks to make your captions and comments more attention-grabbing.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-400 mr-4 text-xl">•</span>
                  <span>Check the following accounts for inspiration: @aimoneynick, @jimprintss</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AffiliatePage

