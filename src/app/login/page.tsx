"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight, User, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (isSignup && password !== confirmPassword) { setMessage("Passwords do not match."); return; }
    setBusy(true);
    try {
      const response = await fetch(isSignup ? "/api/auth/signup" : "/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Authentication failed.");
      router.push(searchParams.get("returnTo") || "/scan");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
      setBusy(false);
    }
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
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
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
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
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
                  {!isSignup && <span className="text-xs text-purple-500">Secure session · 14 days</span>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
                  <Input
                    id="password"
                    type="password"
                      required
                      minLength={isSignup ? 10 : undefined}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
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
                      required
                      minLength={10}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="••••••••"
                      className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
              )}
              
              {message && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{message}</p>}
              <Button 
                type="submit" 
                disabled={busy}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white group"
              >
                {busy ? "Please wait…" : isSignup ? 'Create Account' : 'Sign In'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            
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
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" />}>
      <LoginContent />
    </Suspense>
  );
}
