import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MarketplacePage = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock model data
  const models = [
    {
      id: 1,
      name: "Audrey Sinclair",
      images: ["/preview_1.png", "/preview_2.png", "/preview_3.png", "/preview_4.png", "/preview_5.png"],
      isLive: true,
      claimed: "2/5",
      fullyClaimed: false,
      hair: "brown",
      body: "slim",
      ethnicity: "caucasian",
      age: "19",
      tier: "Classic",
      about: "A timeless beauty with an effortless grace that channels old Hollywood glamour into modern sophistication. Her classic style and refined presence create an aspirational yet approachable persona that resonates across generations.",
    },
    {
      id: 2,
      name: "Mackenzie Cole",
      images: ["/model2 1.png", "/model2 2.png", "/model2 3.png", "/model2 4.png", "/model2 5.png"],
      claimed: "2/5",
      fullyClaimed: false,
      hair: "honey blonde",
      body: "slim",
      ethnicity: "caucasian",
      age: "20",
      tier: "Classic",
      about: "A warm and approachable creator with an effortlessly charming personality that draws viewers in naturally. Her authentic, down-to-earth content style combines relatable humor with genuine connection, making every interaction feel like catching up with your favorite friend.",
    },
    {
      id: 3,
      name: "Bailey Summers",
      images: ["/model3 1.png", "/model3 2.png", "/model3 3.png", "/model3 4.png", "/model3 5.png"],
      claimed: "1/5",
      fullyClaimed: false,
      hair: "light blonde",
      body: "athletic",
      ethnicity: "caucasian",
      age: "23",
      tier: "Classic",
      about: "A warm and genuine presence with an infectious smile that lights up every room. Bailey brings a refreshing authenticity to her content, combining girl-next-door charm with a natural confidence that makes everyone feel like her best friend.",
    },
    {
      id: 4,
      name: "Briar Westbrook",
      images: ["/model4 1.png", "/model4 2.png", "/model4 3.png", "/model4 4.png", "/model4 5.png"],
      claimed: "1/5",
      fullyClaimed: false,
      hair: "dark blonde",
      body: "slim",
      ethnicity: "caucasian",
      age: "21",
      tier: "Classic",
      about: "A creative spirit with an eye for unconventional beauty, Briar brings an artistic edge to everything she creates. Her unique perspective and effortlessly cool aesthetic have cultivated a devoted following who appreciate her authentic, unfiltered approach to content.",
    },
    {
      id: 5,
      name: "Model 5",
      images: ["/preview_1.png"],
      claimed: "5/5",
      fullyClaimed: true,
      isBlackedOut: true,
      hair: "n/a",
      body: "n/a",
      ethnicity: "n/a",
      age: "0",
      tier: "Classic",
    },
    {
      id: 6,
      name: "Chloe Morales",
      images: ["/model6 1.png", "/model6 2.png", "/model6 3.png", "/model6 4.png", "/model6 5.png"],
      claimed: "1/5",
      fullyClaimed: false,
      hair: "dark blonde",
      body: "slim",
      ethnicity: "hispanic",
      age: "23",
      tier: "Classic",
      about: "Cleo is a rising star whose authentic approach and stunning features set her apart. Her professional yet personable style makes every interaction memorable.",
    },
    {
      id: 7,
      name: "Emma Reed",
      images: ["/model7 1.png", "/model7 2.png", "/model7 3.png", "/model7 4.png", "/model7 5.png"],
      claimed: "1/5",
      fullyClaimed: false,
      hair: "light brown",
      body: "slim",
      ethnicity: "caucasian",
      age: "18",
      tier: "Classic",
      about: "Emma is a rising star whose authentic approach and stunning features set her apart. Her professional yet personable style makes every interaction memorable.",
    },
    {
      id: 8,
      name: "Holly Arlington",
      images: ["/model8 1.png", "/model8 2.png", "/model8 3.png", "/model8 4.png", "/model8 5.png"],
      claimed: "1/5",
      fullyClaimed: false,
      hair: "brown",
      body: "slim",
      ethnicity: "caucasian",
      age: "24",
      tier: "Classic",
      about: "Combining natural beauty with genuine personality, Holly Arlington creates content that feels both aspirational and accessible. Her classic appeal adds depth to her engaging presence.",
    },
    {
      id: 9,
      name: "Sloane Bennett",
      images: ["/model9 1.png", "/model9 2.png", "/model9 3.png", "/model9 4.png", "/model9 5.png"],
      claimed: "1/5",
      fullyClaimed: false,
      hair: "brown",
      body: "slim",
      ethnicity: "caucasian",
      age: "18",
      tier: "Classic",
      about: "A refined international beauty with an effortless elegance that translates across cultures. Her sophisticated presence and natural grace make her a sought-after face for luxury brands worldwide. Born in Connecticut but educated in Switzerland, she brings a unique blend of American warmth and European sophistication to her work.",
    },
    {
      id: 10,
      name: "Aria Chen",
      images: ["/model10 1.png", "/model10 2.png", "/model10 3.png", "/model10 4.png", "/model10 5.png"],
      claimed: "2/5",
      fullyClaimed: false,
      hair: "black",
      body: "slim",
      ethnicity: "asian",
      age: "21",
      tier: "Classic",
      about: "A fresh face in the modeling world with an effortlessly cool aesthetic that blends California surf culture with Manhattan sophistication. Known for her natural beauty and authentic social media presence, she brings a refreshing realness to every collaboration.",
    },
    {
      id: 11,
      name: "Model 11",
      images: ["/preview_1.png"],
      claimed: "5/5",
      fullyClaimed: true,
      isBlackedOut: true,
      hair: "n/a",
      body: "n/a",
      ethnicity: "n/a",
      age: "0",
      tier: "Classic",
    },
    {
      id: 12,
      name: "Model 12",
      images: ["/preview_1.png"],
      claimed: "5/5",
      fullyClaimed: true,
      isBlackedOut: true,
      hair: "n/a",
      body: "n/a",
      ethnicity: "n/a",
      age: "0",
      tier: "Classic",
    },
    {
      id: 13,
      name: "Mia Rodriguez",
      images: ["/model13 1.png", "/model13 2.png", "/model13 3.png", "/model13 4.png", "/model13 5.png"],
      claimed: "1/5",
      fullyClaimed: false,
      hair: "dark brown",
      body: "slim",
      ethnicity: "latina",
      age: "20",
      tier: "Classic",
      about: "A timeless beauty with an effortless grace that captures both old Hollywood glamour and modern sophistication. Charlotte brings a refined elegance to every frame, with a natural poise that makes luxury feel approachable and authentic.",
    },
    {
      id: 14,
      name: "Nina Patel",
      images: ["/model14 1.png", "/model14 2.png", "/model14 3.png", "/model14 4.png", "/model14 5.png"],
      claimed: "2/5",
      fullyClaimed: false,
      hair: "black",
      body: "slim",
      ethnicity: "indian",
      age: "22",
      tier: "Classic",
      about: "Combining natural beauty with genuine personality, Hope Jay creates content that feels both aspirational and accessible. Her classic appeal adds depth to her engaging presence.",
    },
    {
      id: 15,
      name: "Zara Hassan",
      images: ["/model15 1.png", "/model15 2.png", "/model15 3.png", "/model15 4.png", "/model15 5.png"],
      claimed: "1/5",
      fullyClaimed: false,
      hair: "dark brown",
      body: "slim",
      ethnicity: "middle eastern",
      age: "23",
      tier: "Classic",
      about: "Former D1 volleyball player bringing athletic grace and natural confidence to her content creation. Her midwest roots and competitive spirit shine through in her engaging, down-to-earth personality that connects with audiences seeking authentic, strong feminine energy.",
    },
        {
          id: 16,
          name: "Zoey Paige",
          images: ["/model16 1.png", "/model16 2.png", "/model16 3.png", "/model16 4.png", "/model16 5.png"],
          claimed: "2/5",
          fullyClaimed: false,
          hair: "brown",
          body: "slim",
          ethnicity: "caucasian",
          age: "19",
          tier: "Classic",
          about: "19yo radiant brunette with deep blue eyes, effortlessly glamorous and sun-kissed, exuding confident beach vibes and elegant evening allure.",
        },
    {
      id: 17,
      name: "Zara Vee",
      images: ["/model17 1.png", "/model17 2.png", "/model17 3.png", "/model17 4.png", "/model17 5.png"],
      claimed: "2/5",
      fullyClaimed: false,
      hair: "black",
      body: "slim",
      ethnicity: "hispanic",
      age: "23",
      tier: "Classic",
      about: "23yo playful soul with long dark hair and captivating eyes, slaying a bold look with a sleek black dress.",
    },
    {
      id: 18,
      name: "Mila Dash",
      images: ["/model18 1.png", "/model18 2.png", "/model18 3.png", "/model18 4.png", "/model18 5.png"],
      claimed: "3/5",
      fullyClaimed: false,
      hair: "black",
      body: "slim",
      ethnicity: "asian",
      age: "22",
      tier: "Classic",
      about: "22yo confident beauty with flawless skin, posing in a vibrant red dress against a luxurious interior backdrop, bringing elegance to the moment.",
    },
  ];

  const nextImage = () => {
    if (selectedModel) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedModel.images.length);
    }
  };

  const prevImage = () => {
    if (selectedModel) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedModel.images.length) % selectedModel.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <img src="/logo.png" alt="Eromify" className="h-40 w-auto" />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Home</Link>
                <Link to="/marketplace" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Marketplace</Link>
                <Link to="/#features" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Features</Link>
                <Link to="/#pricing" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Pricing</Link>
                <Link to="/#faq" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">FAQ</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-white hover:text-gray-300 text-sm font-medium">Sign In</Link>
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-4">AI Model Collection</p>
          <h1 className="text-5xl md:text-6xl font-semibold mb-4">
            50+ Exclusive <span className="bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">Models</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Pre-trained and ready to use. Pick your model and start creating immediately.
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {models.map((model) => (
            <div 
              key={model.id}
              onClick={() => {
                if (!model.fullyClaimed && !model.isBlackedOut) {
                  setCurrentImageIndex(0);
                  setSelectedModel(model);
                }
              }}
              className={`bg-black rounded-2xl overflow-hidden border border-gray-800 ${
                model.fullyClaimed || model.isBlackedOut ? 'opacity-75' : 'cursor-pointer hover:border-gray-600'
              } transition-colors relative`}
            >
              <div className="aspect-[3/4] bg-gray-800 relative flex items-center justify-center">
                {!model.isBlackedOut ? (
                  <img 
                    src={model.images[0]} 
                    alt={model.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-900" />
                )}
                
                {!model.isBlackedOut && (
                  <>
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded">V2 Model</span>
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded">{model.tier}</span>
                    </div>
                  </>
                )}
                
                {/* Fully Claimed Overlay */}
                {model.fullyClaimed && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center px-4 z-20 pt-32">
                    <div className="bg-red-900 border-2 border-red-600 text-white px-6 py-3 rounded-lg font-bold text-sm mb-3 text-center">
                      FULLY CLAIMED
                    </div>
                    <p className="text-white text-xs text-center mb-1">All 5 licenses taken</p>
                    <p className="text-gray-400 text-xs text-center">Check back for new models</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                {!model.isBlackedOut ? (
                  <>
                    <h3 className="font-semibold text-white mb-2">
                      {model.name} <span className="text-gray-400">({model.age})</span>
                    </h3>
                    
                    {/* Attributes */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300">{model.hair}</span>
                      <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300">{model.body}</span>
                      <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300">{model.ethnicity}</span>
                    </div>
                    
                    {/* Claimed Status */}
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {model.claimed} claimed
                    </div>
                  </>
                ) : (
                  <div className="h-20"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4">
            Ready to start creating?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Sign up now and get instant access to all models
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center justify-center gap-2 bg-transparent border border-purple-500 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-900/20 transition-all"
          >
            Get Started
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Footer Logo */}
        <div className="flex justify-center mb-12">
          <img src="/logo.png" alt="Eromify" className="h-32 w-auto opacity-50" />
        </div>
      </main>

      {/* Model Detail Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 lg:p-4">
          <div className="bg-black border-0 lg:border border-gray-800 rounded-none lg:rounded-2xl max-w-6xl w-full h-full lg:max-h-[90vh] overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 relative bg-gray-900 flex-shrink-0">
              <div className="aspect-[3/4] lg:h-full relative">
                {/* Model image */}
                <img 
                  src={selectedModel.images[currentImageIndex]} 
                  alt={selectedModel.name}
                  className="w-full h-full object-cover object-top"
                />
                
                {/* V2 Model Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-500 text-white text-xs px-3 py-1.5 rounded-full">V2 Model</span>
                </div>

                {/* Navigation Arrows */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {selectedModel.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="lg:w-1/2 p-6 lg:p-8 lg:overflow-y-auto">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedModel(null)}
                className="fixed lg:absolute top-4 right-4 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Model Name */}
              <h2 className="text-3xl font-bold mb-4">{selectedModel.name}</h2>

              {/* Status Badges */}
              <div className="flex items-center gap-3 mb-6">
                {selectedModel.isLive && (
                  <div className="flex items-center gap-2 text-green-500 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    LIVE
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] rounded-full text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {selectedModel.claimed} claimed
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#1a1a1a] p-4 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Hair</div>
                  <div className="text-white font-medium">{selectedModel.hair}</div>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Body</div>
                  <div className="text-white font-medium">{selectedModel.body}</div>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Ethnicity</div>
                  <div className="text-white font-medium">{selectedModel.ethnicity}</div>
                </div>
                <div className="bg-[#1a1a1a] p-4 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Age</div>
                  <div className="text-white font-medium">{selectedModel.age}</div>
                </div>
              </div>

              {/* About Section */}
              {selectedModel.about && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-2">ABOUT</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedModel.about}</p>
                </div>
              )}

              {/* Tier */}
              <div className="bg-[#1a1a1a] p-4 rounded-xl mb-6 flex items-center justify-between">
                <span className="text-gray-400 text-sm">Tier</span>
                <span className="text-white font-medium">{selectedModel.tier}</span>
              </div>

              {/* Claim Button */}
              <Link to="/login" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2">
                Claim Model
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Social Proof */}
              <p className="text-center text-gray-500 text-sm mt-4">
                Join {selectedModel.claimed.split('/')[0]} others who have claimed this model
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;

