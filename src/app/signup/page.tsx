"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Extract parameters
    const plan = searchParams.get('plan');
    const usecase = searchParams.get('usecase');
    
    // Redirect to login page with signup=true and any other parameters
    const params = new URLSearchParams();
    params.append('signup', 'true');
    
    if (plan) params.append('plan', plan);
    if (usecase) params.append('usecase', usecase);
    
    router.push(`/login?${params.toString()}`);
  }, [router, searchParams]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        <p className="mt-4 text-lg text-purple-800">Redirecting to signup...</p>
      </div>
    </div>
  );
}
