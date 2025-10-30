"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, Circle, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ScanningPage() {
  const router = useRouter();
  const [scanProgress, setScanProgress] = useState(10);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds countdown
  
  // In a real application, these would come from your backend/API
  const [scanSteps, setScanSteps] = useState([
    { id: 1, name: "Sources discovered", completed: true, current: false },
    { id: 2, name: "Data fetched", completed: true, current: false },
    { id: 3, name: "Content analyzed", completed: false, current: true },
    { id: 4, name: "Risk detected", completed: false, current: false },
    { id: 5, name: "Score building", completed: false, current: false },
  ]);

  // Auto-progress the scan
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 1000);
    
    // Auto-redirect to results after scan completes
    const redirectTimer = setTimeout(() => {
      router.push('/results');
    }, 30000); // Redirect after 30 seconds
    
    // Countdown timer
    const countdownTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Update scan steps as progress increases
    const stepTimer = setTimeout(() => {
      setScanSteps(prev => {
        const updated = [...prev];
        updated[2].completed = true;
        updated[2].current = false;
        updated[3].current = true;
        return updated;
      });
    }, 10000);
    
    const stepTimer2 = setTimeout(() => {
      setScanSteps(prev => {
        const updated = [...prev];
        updated[3].completed = true;
        updated[3].current = false;
        updated[4].current = true;
        return updated;
      });
    }, 20000);
    
    return () => {
      clearInterval(progressTimer);
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer);
      clearTimeout(stepTimer);
      clearTimeout(stepTimer2);
    };
  }, [router]);

  const logEntries = [
    { time: "00:01", message: "Initializing scan for @username..." },
    { time: "00:03", message: "Discovered 7 social profiles" },
    { time: "00:25", message: "Analyzing text sentiment patterns..." },
    { time: "00:32", message: "Checking for harassment indicators..." },
    { time: "00:40", message: "Processing language tone and patterns..." },
    { time: "00:52", message: "Detecting potential inconsistencies..." },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Scanning Profile</h1>
            <p className="text-muted-foreground">
              We're analyzing public data to generate a comprehensive safety report.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between text-sm mb-2">
              <span>Scan in progress...</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Timeline Steps */}
            <div className="md:col-span-2 bg-card rounded-xl p-6 shadow-elegant">
              <h2 className="font-semibold mb-6">Scan Progress</h2>
              <ol className="relative border-l border-muted">
                {scanSteps.map((step) => (
                  <li className="mb-6 ml-6" key={step.id}>
                    <span className="absolute flex items-center justify-center -left-3">
                      {step.completed ? (
                        <CheckCircle className="h-6 w-6 text-primary bg-background rounded-full" />
                      ) : step.current ? (
                        <Loader2 className="h-6 w-6 text-primary bg-background rounded-full animate-spin" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground bg-background rounded-full" />
                      )}
                    </span>
                    <h3 className={`font-medium ${step.current ? "text-primary" : step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.name}
                    </h3>
                    {step.current && (
                      <p className="text-xs text-muted-foreground mt-1">
                        In progress...
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {/* Live Log */}
            <div className="md:col-span-3">
              <div className="bg-card rounded-xl p-6 shadow-elegant h-full">
                <h2 className="font-semibold mb-4 flex justify-between">
                  <span>Live Scan Log</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    Auto-updating
                  </span>
                </h2>
                <div className="font-mono text-sm bg-background rounded-lg p-4 max-h-80 overflow-y-auto border border-border">
                  {logEntries.map((entry, index) => (
                    <div key={index} className="pb-2 mb-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">[{entry.time}]</span> {entry.message}
                    </div>
                  ))}
                  <div className="animate-pulse">
                    <span className="text-muted-foreground">[00:54]</span> <span className="text-primary">Analyzing behavioral patterns...</span>
                  </div>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="mt-6 bg-accent/10 rounded-xl p-6 text-center">
                <p className="text-lg">
                  Estimated completion time: <span className="font-semibold">{Math.floor(timeLeft / 60)} minute {timeLeft % 60} seconds</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  The report will be automatically displayed when ready
                </p>
                <div className="w-full bg-background h-1 mt-4 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300"
                    style={{ width: `${100 - (timeLeft / 90) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* For Demo Purposes: Skip to results button */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Demo Mode: Skip waiting
            </p>
            <Button 
              asChild
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-2 rounded-lg shadow-lg group"
            >
              <Link 
                href="/results"
                className="flex items-center"
              >
                View sample results now 
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
