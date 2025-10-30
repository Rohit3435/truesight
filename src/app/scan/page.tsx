"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Link2, User, Globe, Loader2, AlertCircle, Shield, Search, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ScanPage() {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [platform, setPlatform] = useState("");
  const [isConsent, setIsConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Show disclaimer modal instead of submitting directly
    setShowDisclaimer(true);
  };
  
  const processSubmission = () => {
    // Basic validation
    if (!name.trim()) {
      setError("Please enter a name or username");
      return;
    }

    if (!isConsent) {
      setError("Please confirm that you agree to the Terms of Service");
      return;
    }
    
    // Check if photo was uploaded (stored in session storage)
    if (!sessionStorage.getItem('profilePhoto')) {
      setError("Please upload a profile photo");
      return;
    }

    // Calculate behavioral score from questionnaire
    let behavioralScore = 0;
    let questionsAnswered = 0;
    
    // Get all answered questions
    const q1Value = (document.querySelector('input[name="q1"]:checked') as HTMLInputElement)?.value;
    const q2Value = (document.querySelector('input[name="q2"]:checked') as HTMLInputElement)?.value;
    const q3Value = (document.querySelector('input[name="q3"]:checked') as HTMLInputElement)?.value;
    const q4Value = (document.querySelector('input[name="q4"]:checked') as HTMLInputElement)?.value;
    const q5Value = (document.querySelector('input[name="q5"]:checked') as HTMLInputElement)?.value;
    
    // Add scores for answered questions
    if (q1Value) {
      behavioralScore += parseInt(q1Value);
      questionsAnswered++;
    }
    if (q2Value) {
      behavioralScore += parseInt(q2Value);
      questionsAnswered++;
    }
    if (q3Value) {
      behavioralScore += parseInt(q3Value);
      questionsAnswered++;
    }
    if (q4Value) {
      behavioralScore += parseInt(q4Value);
      questionsAnswered++;
    }
    if (q5Value) {
      behavioralScore += parseInt(q5Value);
      questionsAnswered++;
    }
    
    // Calculate percentage (normalize to 0-100 scale)
    // Apply a positive bias to make the profile more positive overall
    let behavioralPercentage = 65; // Default to slightly positive
    if (questionsAnswered > 0) {
      // Each question is worth -2 to +2, so max total range is -10 to +10 for 5 questions
      // Convert this to a 0-100 scale where:
      // -10 = 0%, 0 = 50%, +10 = 100%
      let rawPercentage = Math.round(((behavioralScore + 10) / 20) * 100);
      
      // Apply a positive bias (5-15% improvement)
      const positiveBias = Math.floor(Math.random() * 10) + 5;
      behavioralPercentage = Math.min(100, rawPercentage + positiveBias);
      behavioralPercentage = Math.max(50, behavioralPercentage); // Ensure it's at least neutral
    }

    // Show loading state
    setIsSubmitting(true);

    // Check if LinkedIn is selected as platform
    const isLinkedIn = platform === 'linkedin';
    
    // Simulate API call - in a real app this would be an actual API call
    setTimeout(() => {
      // Store scan data in session storage for persistence
      sessionStorage.setItem('scanData', JSON.stringify({
        name: name,
        platform: platform,
        link: link,
        behavioralScore: behavioralPercentage,
        scanStartTime: new Date().toISOString(),
        // Just store whether LinkedIn analysis is requested
        isLinkedIn: isLinkedIn
      }));
      
      router.push("/scanning");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full border-2 border-purple-300"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="text-xl font-bold text-purple-900 mb-2 flex items-center">
              <AlertCircle className="h-5 w-5 text-purple-600 mr-2" />
              Important Disclaimer
            </h3>
            <div className="prose prose-sm text-purple-800 mb-6">
              <p className="mb-3">
                TrueSight analyzes publicly available information to provide safety insights about online profiles. Please understand:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>This assessment is based on available online data and behavioral patterns.</li>
                <li>Results should be used as <strong>one factor</strong> in your personal safety decisions, not as the sole determining factor.</li>
                <li>No safety analysis tool can guarantee 100% accuracy in predicting human behavior.</li>
                <li>The analysis is performed for personal safety purposes only.</li>
                <li>By proceeding, you agree to use this information responsibly and ethically.</li>
              </ul>
            </div>
            <div className="flex justify-between gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-purple-300" 
                onClick={() => setShowDisclaimer(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-purple-800 to-purple-600 text-white"
                onClick={() => {
                  setShowDisclaimer(false);
                  processSubmission();
                }}
              >
                I Understand, Continue
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Animated background elements */}
      <div className="absolute top-40 left-1/4 w-64 h-64 bg-purple-400/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-60 right-1/3 w-80 h-80 bg-purple-800/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 py-24">
        <motion.div 
          className="max-w-3xl mx-auto relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 border-4 border-purple-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-10 -right-10 w-28 h-28 border-4 border-pink-200 rounded-full opacity-20"></div>
          {/* Header with navigation */}
          <div className="mb-8 flex items-center">
            <Link href="/" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="ml-auto flex items-center space-x-4">
              <Badge variant="outline" className="bg-purple-600/20 border-purple-400 text-purple-800 font-medium">
                <Shield className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="bg-pink-500/20 border-pink-400 text-pink-700 font-medium">
                <Lock className="h-3 w-3 mr-1" />
                Private & Secure
              </Badge>
            </div>
          </div>
          
          {/* Title and description */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 text-transparent bg-clip-text">Start Your Profile Scan</h1>
            <p className="text-purple-800 text-lg">
              Our AI analyzes public data to assess safety risks and authenticity.
            </p>
          </motion.div>

          {/* Main card with form */}
          <Card className="p-8 shadow-xl border-2 border-purple-300 overflow-hidden relative bg-white/80 backdrop-blur-sm rounded-xl">
            {/* Accent circles */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/30 rounded-full"></div>
            <div className="absolute top-1/2 right-1/2 w-60 h-60 bg-purple-800/10 rounded-full"></div>
            
            <div className="relative z-10">
              {/* Error Message */}
              {error && (
                <motion.div 
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <motion.form 
                className="space-y-6" 
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Name/Handle */}
                <div className="space-y-2">
                  <label htmlFor="nameHandle" className="block text-sm font-medium text-purple-900">
                    Name or Username <span className="text-pink-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-600" />
                    <Input
                      id="nameHandle"
                      placeholder="Enter name or username"
                      className="pl-10 border-purple-300 focus:border-purple-500 focus-visible:ring-purple-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Full name or online handle of the person you want to analyze
                  </p>
                </div>

                {/* Profile Link */}
                <div className="space-y-2">
                  <label htmlFor="profileLink" className="block text-sm font-medium text-purple-900">
                    Profile Link (optional)
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-600" />
                    <Input
                      id="profileLink"
                      placeholder="https://"
                      className="pl-10 border-purple-300 focus:border-purple-500 focus-visible:ring-purple-500"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Link to any social profile of the person
                  </p>
                </div>

                {/* Platform Selection */}
                <div className="space-y-2">
                  <label htmlFor="platform" className="block text-sm font-medium text-purple-900">
                    Platform
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-600" />
                    <select 
                      id="platform" 
                      className="w-full h-10 pl-10 rounded-md border border-purple-300 bg-white/80 text-purple-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                      value={platform}
                      onChange={(e) => {
                        setPlatform(e.target.value);
                        // Show LinkedIn section if LinkedIn is selected
                        const linkedInSection = document.getElementById('linkedInSection');
                        if (linkedInSection) {
                          if (e.target.value === 'linkedin') {
                            linkedInSection.classList.remove('hidden');
                          } else {
                            linkedInSection.classList.add('hidden');
                          }
                        }
                      }}
                    >
                      <option value="">Select platform (or All)</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="reddit">Reddit</option>
                      <option value="tiktok">TikTok</option>
                      <option value="all">All Platforms</option>
                    </select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select which platform to focus on or choose "All Platforms"
                  </p>
                </div>
                
                {/* LinkedIn Toggle - Simple notification */}
                <div 
                  id="linkedInSection" 
                  className="hidden mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">in</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800">LinkedIn Professional Analysis</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Your scan will include professional capability analysis with data from LinkedIn.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <label htmlFor="photo" className="block text-sm font-medium text-purple-900">
                    Photo Upload <span className="text-pink-600">*</span>
                  </label>
                  <input 
                    type="file" 
                    id="fileInput" 
                    accept="image/*"
                    className="hidden"
                    required
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        // Convert file to base64 for storage
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          // Store the base64 string in session storage
                          const result = reader.result as string;
                          sessionStorage.setItem('profilePhoto', result);
                          
                          // Create a preview element
                          const previewImage = document.getElementById('imagePreview') as HTMLImageElement;
                          const previewContainer = document.getElementById('imagePreviewContainer');
                          const uploadIcon = document.getElementById('uploadIcon');
                          const uploadText = document.getElementById('uploadText');
                          const imageSelectedText = document.getElementById('imageSelectedText');
                          
                          if (previewImage && previewContainer && uploadIcon && uploadText && imageSelectedText) {
                            previewImage.src = result;
                            previewContainer.classList.remove('hidden');
                            uploadIcon.classList.add('hidden');
                            uploadText.classList.add('hidden');
                            imageSelectedText.classList.remove('hidden');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div 
                    className="border-2 border-dashed border-purple-300 hover:border-purple-500 transition-colors rounded-lg p-6 text-center cursor-pointer bg-purple-50/50"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <div className="flex flex-col items-center">
                      {/* Image preview container - hidden by default */}
                      <div id="imagePreviewContainer" className="hidden mb-2">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-purple-300">
                          <img 
                            id="imagePreview" 
                            className="h-full w-full object-cover"
                            alt="Profile preview" 
                          />
                        </div>
                      </div>
                      
                      <div id="uploadIcon" className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                        <Upload className="h-6 w-6 text-purple-600" />
                      </div>
                      <p id="uploadText" className="mb-2 text-sm text-purple-800">Drag and drop a photo or</p>
                      <p id="imageSelectedText" className="mb-2 text-sm font-medium text-green-600 hidden">
                        <CheckCircle className="inline-block h-4 w-4 mr-1" /> Image Selected
                      </p>
                      <Button variant="outline" size="sm" type="button" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: JPG, PNG. Max size: 5MB (Required)
                  </p>
                </div>

                {/* Privacy Info */}
                <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Lock className="h-4 w-4 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm mb-1 text-purple-900">Privacy Guaranteed</h3>
                      <p className="text-xs text-purple-700 leading-relaxed">
                        TrueSight only analyzes publicly available information. No private messages or data behind login screens are accessed.
                        All information is processed securely and your search is not shared with the profile owner.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Consent Checkbox */}
                <div className="flex items-start space-x-3 pt-3">
                  <input 
                    id="consent" 
                    type="checkbox" 
                    className="h-4 w-4 mt-1 border-2 border-purple-400 rounded bg-white checked:bg-purple-600"
                    checked={isConsent}
                    onChange={(e) => setIsConsent(e.target.checked)}
                    required
                  />
                  <label htmlFor="consent" className="text-sm text-purple-800">
                    I confirm that this scan uses only publicly available data and complies with
                    <Link href="/terms" className="text-purple-600 hover:text-pink-600 hover:underline ml-1">
                      Terms of Service
                    </Link>.
                  </label>
                </div>

                {/* Digital Behavior Check Section */}
                <div className="mt-8 pt-6 border-t border-purple-200">
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-purple-900 mb-2">Digital Behavior Check</h3>
                    <p className="text-sm text-purple-700">
                      Complete this brief psychological screening to enhance your safety analysis. Your answers help us provide more personalized insights.
                    </p>
                  </motion.div>

                  <div className="space-y-8">
                    {/* Question 1 */}
                    <div className="space-y-3">
                      <p className="font-medium text-purple-800">1. When someone disagrees with you online, how do you usually respond?</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="radio" id="q1a" name="q1" className="mr-2" value="2" />
                          <label htmlFor="q1a" className="text-sm text-purple-700">I try to understand their point of view.</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q1b" name="q1" className="mr-2" value="1" />
                          <label htmlFor="q1b" className="text-sm text-purple-700">I calmly explain my side and move on.</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q1c" name="q1" className="mr-2" value="-1" />
                          <label htmlFor="q1c" className="text-sm text-purple-700">I get irritated and argue until they agree.</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q1d" name="q1" className="mr-2" value="-2" />
                          <label htmlFor="q1d" className="text-sm text-purple-700">I insult or block them immediately.</label>
                        </div>
                      </div>
                    </div>

                    {/* Question 2 */}
                    <div className="space-y-3">
                      <p className="font-medium text-purple-800">2. How do you usually feel after spending time on social media?</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="radio" id="q2a" name="q2" className="mr-2" value="2" />
                          <label htmlFor="q2a" className="text-sm text-purple-700">Inspired and motivated by others.</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q2b" name="q2" className="mr-2" value="1" />
                          <label htmlFor="q2b" className="text-sm text-purple-700">Relaxed, like I've had a break.</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q2c" name="q2" className="mr-2" value="-1" />
                          <label htmlFor="q2c" className="text-sm text-purple-700">Jealous or frustrated about what others post.</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q2d" name="q2" className="mr-2" value="-2" />
                          <label htmlFor="q2d" className="text-sm text-purple-700">Angry or upset about things I read.</label>
                        </div>
                      </div>
                    </div>

                    {/* Question 3 */}
                    <div className="space-y-3">
                      <p className="font-medium text-purple-800">3. If a stranger sends you a friend request, what's your first thought?</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="radio" id="q3a" name="q3" className="mr-2" value="1" />
                          <label htmlFor="q3a" className="text-sm text-purple-700">Could be a chance to meet someone interesting.</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q3b" name="q3" className="mr-2" value="2" />
                          <label htmlFor="q3b" className="text-sm text-purple-700">I'll check their profile before deciding.</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q3c" name="q3" className="mr-2" value="-1" />
                          <label htmlFor="q3c" className="text-sm text-purple-700">Probably fake, but I might still accept.</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="q3d" name="q3" className="mr-2" value="-2" />
                          <label htmlFor="q3d" className="text-sm text-purple-700">Doesn't matter — I just accept anyone.</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question 4 */}
                  <div className="space-y-3 mt-8">
                    <p className="font-medium text-purple-800">4. How do you typically interact with posts you disagree with?</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="radio" id="q4a" name="q4" className="mr-2" value="2" />
                        <label htmlFor="q4a" className="text-sm text-purple-700">I reflect before commenting and use respectful language.</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q4b" name="q4" className="mr-2" value="1" />
                        <label htmlFor="q4b" className="text-sm text-purple-700">I might comment politely or just scroll past.</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q4c" name="q4" className="mr-2" value="-1" />
                        <label htmlFor="q4c" className="text-sm text-purple-700">I sometimes leave critical comments.</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q4d" name="q4" className="mr-2" value="-2" />
                        <label htmlFor="q4d" className="text-sm text-purple-700">I often post strongly worded disagreements.</label>
                      </div>
                    </div>
                  </div>

                  {/* Question 5 */}
                  <div className="space-y-3 mt-8">
                    <p className="font-medium text-purple-800">5. When sharing personal information online, what's your approach?</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="radio" id="q5a" name="q5" className="mr-2" value="2" />
                        <label htmlFor="q5a" className="text-sm text-purple-700">I'm very careful about what I share and with whom.</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q5b" name="q5" className="mr-2" value="1" />
                        <label htmlFor="q5b" className="text-sm text-purple-700">I share selectively with friends I trust online.</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q5c" name="q5" className="mr-2" value="-1" />
                        <label htmlFor="q5c" className="text-sm text-purple-700">I occasionally share personal details in public posts.</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="q5d" name="q5" className="mr-2" value="-2" />
                        <label htmlFor="q5d" className="text-sm text-purple-700">I share most aspects of my life openly online.</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-700 font-medium">
                      🌟 Completing all questions will significantly improve your profile analysis and help us provide more personalized safety insights.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 hover:from-purple-900 hover:via-purple-700 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20 py-6 text-lg" 
                    type="submit"
                    disabled={isSubmitting}

                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Preparing Scan...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Run Scan
                      </>
                    )}
                  </Button>
                  <Button variant="outline" type="button" className="flex-1 border-2 border-purple-400 text-purple-800 hover:bg-purple-50 hover:border-purple-500" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </div>
              </motion.form>
              
              {/* Scan Features */}
              <motion.div 
                className="grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-purple-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 p-2 rounded-lg">
                  <div className="h-6 w-6 bg-purple-200 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3.5 w-3.5 text-purple-700" />
                  </div>
                  <span className="text-xs font-medium text-purple-900">Identity Verification</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-pink-100 p-2 rounded-lg">
                  <div className="h-6 w-6 bg-pink-200 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3.5 w-3.5 text-pink-700" />
                  </div>
                  <span className="text-xs font-medium text-pink-900">Risk Assessment</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-pink-100 p-2 rounded-lg">
                  <div className="h-6 w-6 bg-pink-200 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3.5 w-3.5 text-pink-700" />
                  </div>
                  <span className="text-xs font-medium text-pink-900">Sentiment Analysis</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 p-2 rounded-lg">
                  <div className="h-6 w-6 bg-purple-200 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3.5 w-3.5 text-purple-700" />
                  </div>
                  <span className="text-xs font-medium text-purple-900">Red Flag Detection</span>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
