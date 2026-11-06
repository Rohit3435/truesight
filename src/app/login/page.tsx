"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight, User, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginPageContent() {
  const [isSignup, setIsSignup] = useState(false);
  const [planType, setPlanType] = useState("");
  const [useCase, setUseCase] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if this is signup mode
    const signupParam = searchParams.get('signup');
    if (signupParam === 'true') {
      setIsSignup(true);
    }
    
    // Get plan type if present
    const plan = searchParams.get('plan');
    if (plan) {
      setPlanType(plan);
    }
    
    // Get use case if present
    const usecase = searchParams.get('usecase');
    if (usecase) {
      setUseCase(usecase);
    }
  }, [searchParams]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    // For demo purposes, redirect to scan page
    router.push('/scan');
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Background elements */}
      <div className="absolute top-40 left-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-60 right-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>
      
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center mb-4">
              <Image src="/truesight-logo.svg" alt="TrueSight Logo" width={44} height={44} className="mr-2" />
              <span className="text-2xl font-bold">True<span className="bg-gradient-to-r from-purple-700 to-pink-500 text-transparent bg-clip-text">Sight</span></span>
            </Link>
            <h1 className="text-2xl font-bold mb-2 text-purple-900">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
            <p className="text-purple-700">
              {isSignup 
                ? 'Get started with your TrueSight journey' 
                : 'Sign in to your TrueSight account'}
            </p>
            
            {planType && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700">
                <Check className="h-4 w-4 mr-2" />
                Selected plan: <span className="font-medium ml-1 text-purple-900">{planType.charAt(0).toUpperCase() + planType.slice(1)}</span>
              </div>
            )}
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-purple-100">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {isSignup && (
                <div className="space-y-2">
                  <label htmlFor="fullname" className="block text-sm font-medium text-purple-800">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="John Smith"
                      className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-purple-800">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-purple-800">
                    Password
                  </label>
                  {!isSignup && (
                    <Link href="/reset-password" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              </div>
              
              {isSignup && (
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-purple-800">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
              )}
              
              {!isSignup && (
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 border border-purple-200 rounded bg-white"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-purple-700">
                    Remember me for 30 days
                  </label>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white group"
              >
                {isSignup ? 'Create Account' : 'Sign In'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-purple-600">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200">
                  <svg className="h-5 w-5 mr-2 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                  </svg>
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-purple-700">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              {" "}
              <Link 
                href={isSignup ? "/login" : "/signup"} 
                className="text-purple-600 font-medium hover:text-purple-800 hover:underline transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignup(!isSignup);
                }}
              >
                {isSignup ? 'Sign in' : 'Sign up for free'}
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <footer className="text-center py-4 text-sm text-purple-600">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-4">
            <Link href="/terms" className="hover:text-purple-800 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-purple-800 transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-purple-800 transition-colors">Contact</Link>
          </div>
          <p className="mt-2">© {new Date().getFullYear()} TrueSight. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
