"use client";

"use client";

import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/hero";
import { Twitter, Instagram, Github, Linkedin } from "lucide-react";

export default function Home() {
  // Function to handle smooth scrolling for anchor links
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100, // Offset for header
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-lg z-50 py-4 border-b border-purple-200">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/truesight-logo.svg" alt="TrueSight Logo" width={40} height={40} className="mr-2" />
            <span className="text-xl font-bold">True<span className="bg-gradient-to-r from-purple-800 to-pink-600 text-transparent bg-clip-text">Sight</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-purple-900 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="/how-it-works" className="text-purple-900 hover:text-purple-600 transition-colors">
              How It Works
            </Link>
            <Link href="/use-cases" className="text-purple-900 hover:text-purple-600 transition-colors">
              Use Cases
            </Link>
            <Link href="/pricing" className="text-purple-900 hover:text-purple-600 transition-colors">
              Pricing
            </Link>
            <Link 
              href="#documentation" 
              className="text-purple-900 hover:text-purple-600 transition-colors"
              onClick={(e) => scrollToSection(e, 'documentation')}
            >
              Documentation
            </Link>
            <Link 
              href="#features" 
              className="text-purple-900 hover:text-purple-600 transition-colors"
              onClick={(e) => scrollToSection(e, 'features')}
            >
              Features
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-purple-800 hover:text-purple-600 transition-colors px-4 py-2">
              Login
            </Link>
            <Link href="/signup" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white transition-colors rounded-full px-4 py-2 shadow-md shadow-purple-500/20">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        <HeroSection />
        
        {/* How TrueSight Works Section */}
        <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 relative">
          {/* Animated background elements */}
          <div className="absolute top-40 left-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16 relative">
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10 animate-float">
                How <span className="bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 text-transparent bg-clip-text">TrueSight</span> Works
              </h2>
              <p className="text-xl text-purple-800 max-w-3xl mx-auto relative z-10">
                Our AI-powered platform combines advanced technology with ethical data analysis to 
                give you the insights you need to stay safe online.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-2xl -z-10 blur-3xl opacity-50"></div>
              {/* Card 1 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-500/20 p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-2 border-purple-300/50 overflow-hidden relative group">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-400/30 rounded-full animate-pulse-glow group-hover:bg-purple-500/40 transition-all duration-500"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-pink-400/30 rounded-full animate-pulse-glow animation-delay-1000 group-hover:bg-pink-500/40 transition-all duration-500"></div>
                
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <div className="text-white text-2xl font-bold">1</div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 group-hover:text-purple-700 transition-colors duration-300">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-900 group-hover:text-purple-800 transition-colors duration-300">Enter Profile Info</h3>
                  <p className="text-purple-700 group-hover:text-purple-800 transition-colors duration-300">
                    Simply enter a name, username, or upload a photo to get started with your safety analysis.
                  </p>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-pink-500/10 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-pink-200 overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-400/20 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-pink-400/20 rounded-full"></div>
                
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <div className="text-white text-2xl font-bold">2</div>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600">
                      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                      <line x1="16" x2="2" y1="8" y2="22"></line>
                      <line x1="17.5" x2="9" y1="15" y2="15"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-pink-900">AI + OSINT Scan</h3>
                  <p className="text-pink-700">
                    Our advanced AI scans public data sources and social media using Open Source Intelligence techniques.
                  </p>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-500/10 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-purple-200 overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-400/20 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-pink-400/20 rounded-full"></div>
                
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-purple-700 to-purple-400 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <div className="text-white text-2xl font-bold">3</div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <path d="M3 3v18h18"></path>
                      <path d="m19 9-5 5-4-4-3 3"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-900">Behavior Analysis</h3>
                  <p className="text-purple-700">
                    Deep analysis of posting patterns, language toxicity, and behavioral indicators for comprehensive insights.
                  </p>
                </div>
              </div>
              
              {/* Card 4 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-pink-500/10 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-pink-200 overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-400/20 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-pink-400/20 rounded-full"></div>
                
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-pink-600 to-pink-400 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <div className="text-white text-2xl font-bold">4</div>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-pink-900">Safety Dashboard</h3>
                  <p className="text-pink-700">
                    Get a detailed safety score and actionable insights with evidence from reliable sources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden" id="features">
          {/* Animated background elements */}
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '4s' }}></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-float">
                <span className="bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 text-transparent bg-clip-text">Key Features</span>
              </h2>
              <p className="text-xl text-purple-800 max-w-3xl mx-auto">
                Advanced tools and technology that set TrueSight apart in online safety assessment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Feature 1 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-200 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-3 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2 group-hover:text-purple-700 transition-colors">AI-Powered OSINT</h3>
                    <p className="text-purple-700">Our advanced AI combines Open Source Intelligence (OSINT) techniques with natural language processing to analyze public profiles across multiple platforms.</p>
                    <Link href="/scan" className="inline-flex items-center text-purple-600 font-medium mt-3 hover:text-purple-800 group-hover:underline">
                      Try it now
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-200 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                      <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                      <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                      <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
                      <path d="M17.8 8.2a4 4 0 0 0-5.6 0"></path>
                      <path d="M8.2 17.8a4 4 0 0 0 5.6 0"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2 group-hover:text-purple-700 transition-colors">Behavioral Analysis</h3>
                    <p className="text-purple-700">Advanced pattern recognition detects potential red flags in communication patterns, engagement history, and content sentiment across platforms.</p>
                    <Link href="/results" className="inline-flex items-center text-purple-600 font-medium mt-3 hover:text-purple-800 group-hover:underline">
                      View sample analysis
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-200 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="bg-gradient-to-br from-purple-700 to-purple-400 p-3 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2 group-hover:text-purple-700 transition-colors">Identity Verification</h3>
                    <p className="text-purple-700">Cross-reference data points across multiple platforms to determine the authenticity of profiles and detect potential impersonation attempts.</p>
                    <Link href="/use-cases" className="inline-flex items-center text-purple-600 font-medium mt-3 hover:text-purple-800 group-hover:underline">
                      Explore use cases
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-200 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="bg-gradient-to-br from-pink-600 to-pink-400 p-3 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M3 3v18h18"></path>
                      <path d="m19 9-5 5-4-4-3 3"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2 group-hover:text-purple-700 transition-colors">Comprehensive Dashboard</h3>
                    <p className="text-purple-700">Visualize safety analysis with intuitive charts, scores, and actionable recommendations based on our AI's findings.</p>
                    <Link href="/pricing" className="inline-flex items-center text-purple-600 font-medium mt-3 hover:text-purple-800 group-hover:underline">
                      Compare plans
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section className="py-24 bg-white relative overflow-hidden" id="documentation">
          {/* Animated background elements */}
          <div className="absolute top-20 left-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-60 right-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-float">
                <span className="bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 text-transparent bg-clip-text">Documentation</span>
              </h2>
              <p className="text-xl text-purple-800 max-w-3xl mx-auto">
                A comprehensive guide to our AI-powered safety tool, its key features, and various applications.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 md:p-10 border border-purple-100 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-400/20 rounded-full blur-3xl"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
                {/* Column 1: Getting Started */}
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <div className="mb-4 bg-gradient-to-br from-purple-600 to-pink-500 p-3 rounded-xl w-14 h-14 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M5 22h14"></path>
                      <path d="M5 2h14"></path>
                      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
                      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-purple-900 mb-3">Getting Started</h3>
                  <div className="space-y-4 text-purple-800">
                    <p><strong className="text-purple-700">Landing Page:</strong> Quick access with our tagline "See who they really are — before you trust them."</p>
                    <p><strong className="text-purple-700">Search Bar:</strong> Enter a name, username, or upload a photo to start a scan.</p>
                    <p><strong className="text-purple-700">Scan Input Form:</strong> Fill out a clean form with Name/Handle, Profile Link, and Platform selection.</p>
                  </div>
                  <Link href="/scan" className="inline-flex items-center text-purple-600 font-medium mt-4 hover:text-purple-800 group-hover:underline">
                    Try scanning now
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </Link>
                </div>
                
                {/* Column 2: How It Works */}
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <div className="mb-4 bg-gradient-to-br from-purple-600 to-pink-500 p-3 rounded-xl w-14 h-14 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-purple-900 mb-3">Understanding Results</h3>
                  <div className="space-y-4 text-purple-800">
                    <p><strong className="text-purple-700">Safety Score:</strong> A numerical score (0-100) with risk label.</p>
                    <p><strong className="text-purple-700">Detailed Insights:</strong> Identity likelihood, toxicity level, harassment cues, bot probability, and impersonation signals.</p>
                    <p><strong className="text-purple-700">Evidence Snippets:</strong> Direct links to source material with recommendations.</p>
                  </div>
                  <Link href="/results" className="inline-flex items-center text-purple-600 font-medium mt-4 hover:text-purple-800 group-hover:underline">
                    See sample results
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </Link>
                </div>
                
                {/* Column 3: Use Cases */}
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <div className="mb-4 bg-gradient-to-br from-purple-600 to-pink-500 p-3 rounded-xl w-14 h-14 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-purple-900 mb-3">Applications & Plans</h3>
                  <div className="space-y-4 text-purple-800">
                    <p><strong className="text-purple-700">Use Cases:</strong> Dating safety, hiring pre-check, roommates/co-founders, and online buying/selling.</p>
                    <p><strong className="text-purple-700">Pricing Tiers:</strong> Free (3 scans/month), Pro (50 scans/month), and Business (bulk scans with admin dashboard).</p>
                    <p><strong className="text-purple-700">Enterprise Features:</strong> Team management, bulk CSV upload, audit logs, and evidence retention settings.</p>
                  </div>
                  <Link href="/pricing" className="inline-flex items-center text-purple-600 font-medium mt-4 hover:text-purple-800 group-hover:underline">
                    View pricing plans
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="mt-10 text-center">
                <Link href="/how-it-works" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 px-8 rounded-full shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <span className="mr-2">Learn More</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Terms of Service Section */}
        <section className="py-24 bg-gradient-to-br from-purple-900/95 to-pink-900/90 text-white relative overflow-hidden" id="terms">
          {/* Animated background elements */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-40 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }}></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-float text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                Terms of Service
              </h2>
              <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                Please review our terms of service before using TrueSight.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10 border border-white/20 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl"></div>
              
              <div className="space-y-8 text-purple-100 relative">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-400 p-2 rounded-lg w-10 h-10 flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white">1</span>
                    </div>
                    Acceptance of Terms
                  </h3>
                  <p>By creating an account, accessing our services, or clicking "I agree," you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and any other policies referenced herein.</p>
                  <Link href="/signup" className="inline-flex items-center text-purple-300 font-medium mt-4 hover:text-white group-hover:underline">
                    Create an account
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </Link>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-400 p-2 rounded-lg w-10 h-10 flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white">2</span>
                    </div>
                    Service Description & User Responsibilities
                  </h3>
                  <p className="mb-4">TrueSight provides an AI-powered analysis of public data (Open-Source Intelligence or "OSINT") to generate a safety score and behavioral insights about an online profile.</p>
                  <p>You agree to use TrueSight only for lawful purposes and must not use it to scan individuals without legitimate reason, harass or stalk any individual, misrepresent findings, or violate privacy rights.</p>
                  <Link href="/use-cases" className="inline-flex items-center text-purple-300 font-medium mt-4 hover:text-white group-hover:underline">
                    Explore legitimate use cases
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </Link>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-400 p-2 rounded-lg w-10 h-10 flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white">3</span>
                    </div>
                    Disclaimers & Limitations
                  </h3>
                  <p className="mb-4">TrueSight is provided "as is" without warranties of any kind. We do not guarantee accuracy, completeness, or reliability of scan results.</p>
                  <p>Our liability for any claims is limited to the amount you paid for services in the twelve months preceding the claim.</p>
                  <Link href="/pricing" className="inline-flex items-center text-purple-300 font-medium mt-4 hover:text-white group-hover:underline">
                    View our pricing plans
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="mt-10 text-center flex flex-wrap justify-center gap-4">
                <Link href="/" className="inline-flex items-center bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white py-3 px-8 rounded-full shadow-lg shadow-purple-800/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <span className="mr-2">Back to Home</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </Link>
                <Link href="/privacy" className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white py-3 px-8 rounded-full border border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <span className="mr-2">Privacy Policy</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 text-white py-12 mt-0 relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
          <div className="absolute top-40 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center mb-4">
                <Image src="/truesight-logo.svg" alt="TrueSight Logo" width={36} height={36} className="mr-2" />
                <span className="text-xl font-bold">True<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Sight</span></span>
              </Link>
              <p className="text-purple-200">
                See the truth behind online profiles. AI-powered safety analysis for a safer digital world.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/how-it-works" className="text-purple-200 hover:text-pink-300 transition-colors">How It Works</Link></li>
                <li><Link href="#features" className="text-purple-200 hover:text-pink-300 transition-colors" onClick={(e) => scrollToSection(e, 'features')}>Features</Link></li>
                <li><Link href="/pricing" className="text-purple-200 hover:text-pink-300 transition-colors">Pricing</Link></li>
                <li><Link href="#documentation" className="text-purple-200 hover:text-pink-300 transition-colors" onClick={(e) => scrollToSection(e, 'documentation')}>Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Use Cases</h3>
              <ul className="space-y-2">
                <li><Link href="/use-cases/dating" className="text-purple-200 hover:text-pink-300 transition-colors">Dating Safety</Link></li>
                <li><Link href="/use-cases/hiring" className="text-purple-200 hover:text-pink-300 transition-colors">Hiring Pre-Check</Link></li>
                <li><Link href="/use-cases/roommates" className="text-purple-200 hover:text-pink-300 transition-colors">Roommates</Link></li>
                <li><Link href="/use-cases/buying-selling" className="text-purple-200 hover:text-pink-300 transition-colors">Online Marketplaces</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-purple-200 hover:text-pink-300 transition-colors">About Us</Link></li>
                <li><Link href="/privacy" className="text-purple-200 hover:text-pink-300 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#terms" className="text-purple-200 hover:text-pink-300 transition-colors" onClick={(e) => scrollToSection(e, 'terms')}>Terms of Service</Link></li>
                <li><Link href="/" className="text-purple-200 hover:text-pink-300 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-purple-500/30 text-center">
            <div className="flex justify-center space-x-6 mb-4">
              <Link href="#" className="text-purple-300 hover:text-pink-400 transition-all hover:scale-110">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-purple-300 hover:text-pink-400 transition-all hover:scale-110">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-purple-300 hover:text-pink-400 transition-all hover:scale-110">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-purple-300 hover:text-pink-400 transition-all hover:scale-110">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
            <p className="text-purple-200">© {new Date().getFullYear()} TrueSight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
