"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  AlertTriangle, 
  Shield, 
  User,
  Bot, 
  MessageSquare, 
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  CircleAlert,
  Loader2,
  BrainCircuit,
  HeartPulse
} from "lucide-react";

// Custom CSS for animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ResultsPage() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Set to false since we're using hardcoded data
  const [profileName, setProfileName] = useState("@john_smith92");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [behaviorScore, setBehaviorScore] = useState(70);
  const [friendlinessScore, setFriendlinessScore] = useState(85);
  const [isLinkedIn, setIsLinkedIn] = useState(false);
  const [linkedInData, setLinkedInData] = useState({
    technicalSkills: ["JavaScript", "React", "Node.js", "Python", "Data Analysis", "Project Management"],
    eventsHandled: 12,
    tenthPercentage: 85.6,
    twelfthPercentage: 78.9,
    graduationCgpa: "8.4 CGPA"
  });
  
  // Get current date formatted as "September 5, 2025"
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Get user info from session storage when the component mounts
  useEffect(() => {
    // Add animation classes to elements
    document.querySelectorAll('.animate-on-load').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in');
      }, i * 100);
    });
    
    try {
      // Get scan data from session storage
      const scanDataStr = sessionStorage.getItem('scanData');
      if (scanDataStr) {
        const scanData = JSON.parse(scanDataStr);
        if (scanData.name) {
          setProfileName(scanData.name.startsWith('@') ? scanData.name : '@' + scanData.name);
        }
        
        // If we have behavioral data from the questionnaire, update the Digital Behavior Analysis score
        if (scanData.behavioralScore) {
          const behaviorScoreValue = parseInt(scanData.behavioralScore);
          setBehaviorScore(behaviorScoreValue);
          
          // Update the behavior score in the categories
          const behaviorCategory = scanResults.categories.find(cat => cat.name === "Digital Behavior Analysis");
          if (behaviorCategory) {
            behaviorCategory.score = behaviorScoreValue;
            
            // Also update the level based on the score
            let behaviorLevel = "Good";
            
            if (behaviorScoreValue >= 90) {
              behaviorLevel = "Excellent";
            } else if (behaviorScoreValue >= 75) {
              behaviorLevel = "Very Good";
            } else if (behaviorScoreValue >= 60) {
              behaviorLevel = "Good";
            } else if (behaviorScoreValue >= 40) {
              behaviorLevel = "Fair";
            } else {
              behaviorLevel = "Needs Improvement";
            }
            
            behaviorCategory.level = behaviorLevel;
          }
          
          // Calculate friendliness score based on behavior score with a positive bias
          // Friendliness is slightly higher than behavior score to give a more positive impression
          const calculatedFriendlinessScore = Math.min(100, behaviorScoreValue + Math.floor(Math.random() * 15) + 5);
          setFriendlinessScore(calculatedFriendlinessScore);
        } else {
          // If no behavior score was provided (questions not answered), set friendliness to 0
          setFriendlinessScore(0);
        }
        
        // Check if LinkedIn platform was selected
        if (scanData.isLinkedIn) {
          setIsLinkedIn(true);
          
          // Generate LinkedIn specific categories with the hardcoded data
          // Technical Skills Analysis
          const skillsScore = Math.min(100, 65 + (linkedInData.technicalSkills.length * 5));
          const skillsCategory = {
            name: "Technical Skills Analysis",
            score: skillsScore,
            level: skillsScore >= 90 ? "Excellent" : skillsScore >= 75 ? "Very Good" : "Good",
            description: "Assessment of technical capabilities and expertise",
            details: `Profile demonstrates proficiency in ${linkedInData.technicalSkills.length} key technical areas including ${linkedInData.technicalSkills.slice(0, 3).join(', ')}${linkedInData.technicalSkills.length > 3 ? ' and more' : ''}.`
          };
          scanResults.categories.push(skillsCategory);
          
          // Project Experience
          const eventsScore = Math.min(100, 60 + (linkedInData.eventsHandled * 3));
          const eventsCategory = {
            name: "Project Experience",
            score: eventsScore,
            level: eventsScore >= 90 ? "Extensive" : eventsScore >= 75 ? "Solid" : "Developing",
            description: "Track record of handling projects and events",
            details: `Profile has experience managing approximately ${linkedInData.eventsHandled} projects/events, demonstrating organizational capabilities and leadership potential.`
          };
          scanResults.categories.push(eventsCategory);
          
          // Educational Background
          const educationScore = 85; // Hardcoded good score
          const educationCategory = {
            name: "Educational Background",
            score: educationScore,
            level: educationScore >= 90 ? "Excellent" : educationScore >= 75 ? "Very Good" : "Good",
            description: "Academic performance and educational qualifications",
            details: `Profile shows strong academic performance with 10th: ${linkedInData.tenthPercentage}%, 12th: ${linkedInData.twelfthPercentage}%, and Graduation: ${linkedInData.graduationCgpa}.`
          };
          scanResults.categories.push(educationCategory);
          
          // Adjust overall score based on LinkedIn data
          scanResults.overallScore = Math.floor((scanResults.overallScore + skillsScore + eventsScore + educationScore) / 4);
        }
      }
      
      // Get profile photo from session storage
      const photoData = sessionStorage.getItem('profilePhoto');
      if (photoData) {
        setProfilePhoto(photoData);
      }
    } catch (error) {
      console.error("Error retrieving data from session storage:", error);
    }
  }, []);
  
  // Hardcoded scan results
  const scanResults = {
    profileName: profileName,
    scanDate: getCurrentDate(),
    overallScore: 88,
    riskLevel: "Low",
    categories: [
      {
        name: "Friendliness Score",
        score: friendlinessScore,
        level: friendlinessScore >= 90 ? "Excellent" : friendlinessScore >= 75 ? "Very Good" : friendlinessScore >= 60 ? "Good" : "Moderate",
        description: "How friendly and positive this person appears to be",
        details: "Based on communication style, behavior patterns, and psychological assessment, this profile demonstrates a positive approach to online interactions."
      },
      { 
        name: "Identity Authenticity",
        score: 70,
        level: "High",
        description: "Profile likely belongs to a real person",
        details: "Claimed to be a lawyer but post history shows inconsistent professional knowledge. Location information varies between different posts. Writing style varies significantly between platforms."
      },
      { 
        name: "Communication Style", 
        score: 85,
        level: "Very Good",
        description: "Thoughtful and considerate communicator",
        details: "Analysis shows clear, respectful communication patterns with a focus on meaningful exchanges and constructive dialogue."
      },
      { 
        name: "Emotional Intelligence", 
        score: 80,
        level: "High",
        description: "Strong emotional awareness and regulation",
        details: "Demonstrates excellent emotional maturity in online interactions with consistent positive engagement patterns."
      },
      { 
        name: "Human Verification", 
        score: 90,
        level: "Very High",
        description: "Highly likely to be human-operated",
        details: "Posting patterns, response times, and content variation strongly indicate human behavior."
      },
      { 
        name: "Digital Behavior Analysis", 
        score: 75,
        level: "Good",
        description: "Psychological screening shows positive interaction patterns",
        details: "Based on the provided responses, this profile demonstrates good self-awareness and healthy online interaction patterns."
      },
      { 
        name: "Overall Trust Score", 
        score: 90,
        level: "Very High",
        description: "Highly trustworthy profile - Excellent digital citizen",
        details: "This assessment combines identity verification (85%), communication patterns (85%), and digital behavior analysis (90%) to determine an exceptional trust rating."
      }
    ],
    evidenceSnippets: [
      // Communication Style evidence
      {
        category: "Communication",
        snippet: "I understand your perspective, though I see things differently. Perhaps we can find some common ground?",
        source: "Twitter Reply, Aug 28",
        severity: "Excellent"
      },
      {
        category: "Communication",
        snippet: "Thank you for sharing your thoughts. I learned something new today and appreciate the civil discussion.",
        source: "Twitter Post, Aug 27",
        severity: "Very Good"
      },
      {
        category: "Communication",
        snippet: "I think we might be misunderstanding each other. Let me try to explain my point more clearly.",
        source: "Reddit Comment, Aug 25",
        severity: "Good"
      },
      // Emotional Intelligence evidence
      {
        category: "Emotional Intelligence",
        snippet: "Taking time for self-care today. It's important to maintain balance between online and offline life.",
        source: "Instagram Post, Aug 24",
        severity: "Excellent"
      },
      {
        category: "Emotional Intelligence",
        snippet: "Grateful for the supportive community I've found here. You all make the internet a better place.",
        source: "Twitter Post, Aug 22",
        severity: "Very Good"
      },
      {
        category: "Emotional Wellness",
        snippet: "I've been struggling with similar thoughts. Some days are just harder than others, but we have to keep going.",
        source: "Reddit Comment, Aug 21",
        severity: "Shows Resilience"
      },
      // Digital Behavior Analysis
      {
        category: "Digital Behavior",
        snippet: "Based on psychological assessment, this person shows good self-awareness and healthy communication patterns.",
        source: "Behavioral Analysis",
        severity: "Positive"
      },
      {
        category: "Digital Behavior",
        snippet: "Shows appropriate caution with strangers online and generally positive interactions with others.",
        source: "Psychological Screening",
        severity: "Positive"
      },
      // Identity evidence
      {
        category: "Identity",
        snippet: "Claimed to be a lawyer but post history shows inconsistent professional knowledge",
        source: "Cross-platform Analysis",
        severity: "Medium"
      },
      {
        category: "Identity",
        snippet: "Profile photo matches LinkedIn profile and company website staff page",
        source: "Cross-reference",
        severity: "Positive"
      },
      {
        category: "Identity Verification",
        snippet: "Location information varies between different posts",
        source: "Data Mismatch",
        severity: "Medium"
      },
      {
        category: "Harassment",
        snippet: "Repeated comments on same user's posts with increasing hostility",
        source: "Pattern Analysis",
        severity: "Medium"
      },
      // Hindi language evidence - positive examples
      {
        category: "Cultural Awareness",
        snippet: "आप सभी का बहुत धन्यवाद आपके सहयोग के लिए। आप सब अद्भुत हैं। (Thank you all so much for your cooperation. You all are amazing.)",
        source: "WhatsApp Group, Aug 23",
        severity: "Excellent"
      },
      {
        category: "Compassion",
        snippet: "हमें एक दूसरे का समर्थन करना चाहिए और सकारात्मक रहना चाहिए। (We should support each other and stay positive.)",
        source: "Instagram Post, Aug 20",
        severity: "Very Good"
      },
      {
        category: "Identity",
        snippet: "मैं अपनी वास्तविक पहचान और स्थान के बारे में ईमानदार रहता हूँ। (I am honest about my real identity and location.)",
        source: "Profile Verification",
        severity: "Excellent"
      }
    ],
    recommendations: [
      "This profile demonstrates excellent communication patterns and appears trustworthy",
      "Continue engaging with confidence - shows consistent positive interaction history",
      "Their excellent digital behavior indicates high social intelligence",
      "Profile shows strong indications of authenticity and genuine communication",
      "Excellent emotional intelligence suggests this is a positive online relationship"
    ]
  };

  // Helper function to determine color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-purple-600";
    if (score >= 60) return "text-pink-500";
    return "text-red-500";
  };

  // Handle download report button click
  const handleDownload = () => {
    setDownloadStarted(true);
    
    try {
      // Create the report content as HTML
      const reportContent = `
        <html>
        <head>
          <title>TrueSight Safety Report - ${scanResults.profileName}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.5; }
            .header { background: linear-gradient(to right, #7e22ce, #ec4899); color: white; padding: 20px; }
            h1 { margin: 0; }
            .date { opacity: 0.8; }
            .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .score { font-size: 24px; font-weight: bold; }
            .category { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
            .recommendation { margin: 5px 0; }
            .evidence { margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px; }
            .profile-photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TrueSight Safety Report</h1>
            <p class="date">Generated on ${scanResults.scanDate}</p>
          </div>
          
          <div class="section">
            <h2>Profile Information</h2>
            <p><strong>Name:</strong> ${scanResults.profileName}</p>
            ${profilePhoto ? `<img src="${profilePhoto}" alt="Profile Photo" class="profile-photo">` : ''}
          </div>
          
          <div class="section">
            <h2>Overall Safety Score: <span class="score">${scanResults.overallScore}/100</span></h2>
            <p>Risk Level: ${scanResults.riskLevel}</p>
          </div>
          
          ${isLinkedIn ? `
          <div class="section" style="background-color: #EFF6FF; border-left: 4px solid #3B82F6;">
            <h2 style="color: #1E40AF;">LinkedIn Professional Analysis</h2>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1E40AF;">Technical Skills</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                ${linkedInData.technicalSkills.map(skill => `
                  <span style="background-color: #DBEAFE; color: #1E40AF; padding: 3px 10px; border-radius: 20px; font-size: 14px;">${skill}</span>
                `).join('')}
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #1E40AF;">Educational Background</h3>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <div style="background-color: white; padding: 10px; border-radius: 5px;">
                  <div style="color: #3B82F6; font-size: 14px;">10th Standard</div>
                  <div style="font-size: 20px; font-weight: bold;">${linkedInData.tenthPercentage}%</div>
                </div>
                <div style="background-color: white; padding: 10px; border-radius: 5px;">
                  <div style="color: #3B82F6; font-size: 14px;">12th Standard</div>
                  <div style="font-size: 20px; font-weight: bold;">${linkedInData.twelfthPercentage}%</div>
                </div>
                <div style="background-color: white; padding: 10px; border-radius: 5px;">
                  <div style="color: #3B82F6; font-size: 14px;">Graduation</div>
                  <div style="font-size: 20px; font-weight: bold;">${linkedInData.graduationCgpa}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 style="color: #1E40AF;">Projects/Events Handled</h3>
              <div style="display: flex; align-items: center;">
                <div style="font-size: 24px; font-weight: bold; margin-right: 10px;">${linkedInData.eventsHandled}</div>
                <div>
                  ${linkedInData.eventsHandled > 10 ? 'Extensive experience' : 
                   linkedInData.eventsHandled > 5 ? 'Solid experience' : 'Developing experience'} 
                  in project management
                </div>
              </div>
            </div>
          </div>
          ` : ''}
          
          <div class="section">
            <h2>Detailed Analysis</h2>
            ${scanResults.categories.map(cat => `
              <div class="category">
                <h3>${cat.name}</h3>
                <p>Score: ${cat.score}/100 (${cat.level})</p>
                <p>${cat.description}</p>
                <p>${cat.details}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h2>Safety Recommendations</h2>
            ${scanResults.recommendations.map(rec => `
              <p class="recommendation">• ${rec}</p>
            `).join('')}
          </div>
          
          <div class="section">
            <h2>Friendliness Analysis</h2>
            ${friendlinessScore === 0 ? `
              <div style="padding: 15px; border-left: 4px solid #f97316; background-color: #ffedd5;">
                <h3 style="color: #9a3412; margin-top: 0;">Behavior Questions Not Answered</h3>
                <p style="color: #9a3412;">
                  To generate a friendliness score, please answer the behavior questions on the scan page. 
                  Your responses help us provide a more accurate assessment of communication style and digital behavior.
                </p>
              </div>
            ` : `
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(to right, #7e22ce, #ec4899); display: flex; align-items: center; justify-content: center; margin-right: 20px;">
                  <div style="width: 70px; height: 70px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 24px; font-weight: bold; color: #7e22ce;">${friendlinessScore}%</span>
                  </div>
                </div>
                <div>
                  <h3 style="margin-top: 0; color: #6b21a8;">${
                    friendlinessScore >= 90 ? "Extremely Friendly & Positive" : 
                    friendlinessScore >= 75 ? "Very Friendly & Thoughtful" : 
                    friendlinessScore >= 60 ? "Generally Friendly" : 
                    "Moderately Friendly"
                  }</h3>
                  <p>
                    Based on our comprehensive analysis of communication style and digital behavior patterns, this profile demonstrates 
                    ${friendlinessScore >= 85 ? "excellent social awareness and consistently positive interactions." : 
                      friendlinessScore >= 70 ? "good social awareness and generally positive interactions." : 
                      "reasonable social awareness with some opportunities for more positive interactions."}
                  </p>
                </div>
              </div>
            `}
          </div>
          
          ${!isLinkedIn ? `
          <div class="section">
            <h2>Evidence Snippets</h2>
            ${scanResults.evidenceSnippets.map(ev => `
              <div class="evidence">
                <p><strong>${ev.category}</strong> (${ev.severity})</p>
                <p>Source: ${ev.source}</p>
                <p>"${ev.snippet}"</p>
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} TrueSight - AI-Powered Safety Analysis</p>
            <p>This report contains analysis of publicly available information only.</p>
          </div>
        </body>
        </html>
      `;
      
      // Create a Blob with the HTML content
      const blob = new Blob([reportContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `TrueSight-Safety-Report-${scanResults.profileName.replace('@', '')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setDownloadStarted(false);
      }, 1000);
    } catch (error) {
      console.error("Error generating report:", error);
      setDownloadStarted(false);
      alert("There was an error generating your report. Please try again.");
    }
  };

  // Positive Digital Citizen alert component
  const PositiveCitizenAlert = () => {
    // Always show this positive alert
    const shouldShow = true;
    
    if (!shouldShow) return null;
    
    return (
      <motion.div 
        className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 p-4 my-4 rounded-r shadow-sm"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-purple-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-900">Exceptional Digital Citizen</h3>
            <div className="mt-2 text-sm text-purple-700">
              <p>
                This profile demonstrates excellent digital citizenship qualities:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Consistently respectful and supportive communication</li>
                <li>Strong emotional intelligence and empathy</li>
                <li>Mindful sharing of personal information</li>
                <li>Authentic online presence with consistent identity</li>
                <li>Positive contribution to online communities</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/scan">
          <Button variant="ghost" className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Scan
          </Button>
        </Link>
      </motion.div>
      
      {/* Share modal */}
      {showShareModal && (
        <motion.div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <button 
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowShareModal(false)}
            >
              <XCircle className="h-6 w-6" />
            </button>
            
            <h2 className="text-xl font-bold text-purple-900 mb-4">Share Safety Report</h2>
            <p className="text-gray-600 mb-6">Share these insights with someone else</p>
            
            <div className="space-y-6">
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    alert("Report shared via message!");
                    setShowShareModal(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Message
                </Button>
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    alert("Report shared via email!");
                    setShowShareModal(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  Email
                </Button>
              </div>
            </div>
            
            <div className="border-t border-purple-100 pt-4">
              <p className="text-sm text-purple-700 mb-3">Or copy link:</p>
              <div className="flex">
                <input 
                  type="text" 
                  value="https://truesight.ai/report/12345" 
                  readOnly
                  className="flex-1 rounded-l-lg border border-r-0 border-purple-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 bg-purple-50 text-purple-800"
                />
                <Button 
                  className="rounded-l-none bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    navigator.clipboard.writeText("https://truesight.ai/report/12345");
                    alert("Link copied to clipboard!");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Main content */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Header */}
        <motion.div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 md:px-8 py-6"
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              {profilePhoto && (
                <motion.div 
                  className="h-16 w-16 md:h-20 md:w-20 rounded-full border-4 border-white/30 overflow-hidden shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <img 
                    src={profilePhoto} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150?text=Profile";
                    }}
                  />
                </motion.div>
              )}
              <div>
                <motion.h1 
                  className="text-2xl md:text-3xl font-bold mb-2 text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Safety Report: <span className="text-purple-100">{scanResults.profileName}</span>
                </motion.h1>
                <motion.p 
                  className="text-purple-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Scan completed on {scanResults.scanDate}
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="flex gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all hover:scale-105"
                onClick={handleDownload}
                disabled={downloadStarted}
              >
                {downloadStarted ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all hover:scale-105"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Results */}
        <motion.div 
          className="px-6 md:px-8 py-6"
          variants={stagger}
        >
          {/* Overall score */}
          <motion.div 
            className="mb-8"
            variants={fadeInUp}
          >
            <motion.h2 
              className="text-xl font-bold text-purple-900 mb-4"
              variants={fadeInUp}
            >
              Overall Safety Score
            </motion.h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              <motion.div 
                className="flex-shrink-0"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.5
                }}
              >
                <div className="relative">
                  <div className="h-28 w-28 rounded-full border-8 border-purple-200 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-lg">
                    <motion.span 
                      className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {scanResults.overallScore}
                    </motion.span>
                  </div>
                  <motion.div 
                    className={`absolute -bottom-2 right-0 px-3 py-1 rounded-full text-sm font-medium shadow-md
                      ${scanResults.riskLevel === "Low" ? "bg-purple-100 text-purple-800" : 
                        scanResults.riskLevel === "Medium" ? "bg-pink-100 text-pink-800" : 
                        scanResults.riskLevel === "Loading" ? "bg-purple-100 text-purple-800" :
                        "bg-red-100 text-red-800"}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                  >
                    {scanResults.riskLevel} {scanResults.riskLevel !== "Loading" ? "Risk" : ""}
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <PositiveCitizenAlert />
                
                <motion.h3 
                  className="text-lg font-semibold text-purple-900 mb-2"
                  variants={fadeInUp}
                >
                  Summary
                </motion.h3>
                <motion.p 
                  className="text-gray-700 mb-4"
                  variants={fadeInUp}
                >
                  This profile has been analyzed across multiple dimensions including identity verification, 
                  content toxicity, and behavior patterns. The profile presents a {scanResults.riskLevel.toLowerCase()} 
                  risk overall, with some areas of concern highlighted below.
                </motion.p>
                
                <motion.div 
                  className="flex flex-wrap gap-3"
                  variants={stagger}
                >
                  <motion.span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Shield className="mr-1 h-4 w-4" />
                    Identity: {scanResults.categories.find(c => c.name === "Identity Likelihood")?.level || "Medium"}
                  </motion.span>
                  <motion.span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    Toxicity: {scanResults.categories.find(c => c.name === "Toxicity Level")?.level || "Medium"}
                  </motion.span>
                  <motion.span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Bot className="mr-1 h-4 w-4" />
                    Bot: {scanResults.categories.find(c => c.name === "Bot Likelihood")?.level || "Low"}
                  </motion.span>
                  <motion.span 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <HeartPulse className="mr-1 h-4 w-4" />
                    Mental Health: {scanResults.categories.find(c => c.name === "Mental Health Signals")?.level || "Low Risk"}
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* LinkedIn Professional Analysis - Only shown when LinkedIn data is available */}
          {isLinkedIn && (
            <motion.div 
              className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">in</span>
                </div>
                <motion.h2 
                  className="text-xl font-bold text-blue-900"
                  variants={fadeInUp}
                >
                  LinkedIn Professional Analysis
                </motion.h2>
              </div>
              
              <motion.p 
                className="text-blue-800 mb-6"
                variants={fadeInUp}
              >
                Extended professional analysis based on LinkedIn profile data shows strong capabilities in technical skills and project management.
              </motion.p>
              
              {/* Technical Skills */}
              <div className="mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {linkedInData.technicalSkills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Educational Background */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-blue-700 mb-1">10th Standard</div>
                  <div className="text-2xl font-bold text-blue-900">{linkedInData.tenthPercentage}%</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-blue-700 mb-1">12th Standard</div>
                  <div className="text-2xl font-bold text-blue-900">{linkedInData.twelfthPercentage}%</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-blue-700 mb-1">Graduation</div>
                  <div className="text-2xl font-bold text-blue-900">{linkedInData.graduationCgpa}</div>
                </div>
              </div>
              
              {/* Projects Handled */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-blue-900 mb-2">Projects/Events Handled</h3>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-blue-900 mr-3">{linkedInData.eventsHandled}</div>
                  <div className="text-blue-700">
                    {linkedInData.eventsHandled > 10 ? 'Extensive experience' : 
                     linkedInData.eventsHandled > 5 ? 'Solid experience' : 'Developing experience'} 
                    in project management
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Categories */}
          <motion.div 
            className="mb-8"
            variants={fadeInUp}
          >
            <motion.h2 
              className="text-xl font-bold text-purple-900 mb-4"
              variants={fadeInUp}
            >
              Detailed Analysis
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={stagger}
            >
              {scanResults.categories.map((category, index) => (
                <motion.div 
                  key={index} 
                  className="border border-purple-100 rounded-lg p-4 bg-white"
                  variants={fadeInUp}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">{category.name}</h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <motion.div 
                        className={`h-2.5 rounded-full ${
                          category.score >= 80 ? "bg-purple-600" : 
                          category.score >= 60 ? "bg-pink-500" : 
                          "bg-red-500"
                        }`} 
                        style={{ width: "0%" }}
                        animate={{ width: `${category.score}%` }}
                        transition={{ duration: 1, delay: 0.2 * index }}
                      ></motion.div>
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(category.score)}`}>{category.score}</span>
                  </div>
                  
                  <p className="text-gray-800 font-medium mb-1">{category.description}</p>
                  <p className="text-gray-600 text-sm">{category.details}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Recommendations */}
          <motion.div 
            className="mb-8"
            variants={fadeInUp}
          >
            <motion.h2 
              className="text-xl font-bold text-purple-900 mb-4"
              variants={fadeInUp}
            >
              Safety Recommendations
            </motion.h2>
            
            <motion.div 
              className="bg-purple-50 rounded-lg p-4"
              variants={fadeInUp}
            >
              <motion.ul 
                className="space-y-2"
                variants={stagger}
              >
                {scanResults.recommendations.map((recommendation, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    variants={fadeInUp}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="ml-3 text-gray-700">{recommendation}</p>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
          
          {/* Evidence - Only shown when NOT LinkedIn */}
          {!isLinkedIn && (
            <motion.div variants={fadeInUp}>
              <motion.h2 
                className="text-xl font-bold text-purple-900 mb-4"
                variants={fadeInUp}
              >
                Evidence Snippets
              </motion.h2>
              
              <motion.div 
                className="space-y-4"
                variants={stagger}
              >
                {scanResults.evidenceSnippets.map((evidence, index) => (
                <motion.div 
                  key={index} 
                  className="border border-purple-100 rounded-lg p-4"
                  variants={fadeInUp}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex flex-wrap items-start gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium
                      ${evidence.category === "Toxicity" ? "bg-pink-100 text-pink-800" : 
                        evidence.category === "Mental Health" ? "bg-purple-100 text-purple-800" : 
                        "bg-blue-100 text-blue-800"}`}
                    >
                      {evidence.category}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium
                      ${evidence.severity === "High" ? "bg-red-100 text-red-800" : 
                        evidence.severity === "Medium" ? "bg-yellow-100 text-yellow-800" : 
                        evidence.severity === "Low" ? "bg-green-100 text-green-800" : 
                        "bg-green-100 text-green-800"}`}
                    >
                      {evidence.severity}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {evidence.source}
                    </span>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <p className="text-gray-800">{evidence.snippet}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          )}

          {/* Friendliness Analysis Section */}
          <motion.div 
            className="mb-8"
            variants={fadeInUp}
          >
            <motion.h2 
              className="text-xl font-bold text-purple-900 mb-4 flex items-center"
              variants={fadeInUp}
            >
              <HeartPulse className="mr-2 h-5 w-5 text-pink-600" />
              Friendliness Analysis
            </motion.h2>
            
            <motion.div 
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-pink-100"
              variants={fadeInUp}
            >
              {friendlinessScore === 0 ? (
                // Show message when behavior questions were not answered
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-orange-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-orange-800">Behavior Questions Not Answered</h3>
                      <div className="mt-2 text-orange-700">
                        <p>
                          To generate a friendliness score, please answer the behavior questions on the scan page. 
                          Your responses help us provide a more accurate assessment of communication style and digital behavior.
                        </p>
                      </div>
                      <div className="mt-4">
                        <Link href="/scan" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                          Return to Scan Page
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Show friendliness analysis when questions were answered
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/3">
                    <div className="relative h-48 w-48 mx-auto">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 animate-pulse"></div>
                      <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">{friendlinessScore}%</div>
                          <div className="text-sm text-purple-700 mt-1">Friendliness Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <h3 className="text-lg font-semibold text-purple-800 mb-3">
                      {friendlinessScore >= 90 ? "Extremely Friendly & Positive" : 
                       friendlinessScore >= 75 ? "Very Friendly & Thoughtful" : 
                       friendlinessScore >= 60 ? "Generally Friendly" : 
                       "Moderately Friendly"}
                    </h3>
                    
                    <p className="text-purple-700 mb-4">
                      Based on our comprehensive analysis of communication style and digital behavior patterns, this profile demonstrates 
                      {friendlinessScore >= 85 ? " excellent social awareness and consistently positive interactions." : 
                       friendlinessScore >= 70 ? " good social awareness and generally positive interactions." : 
                       " reasonable social awareness with some opportunities for more positive interactions."}
                    </p>
                  
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-purple-800">
                          {friendlinessScore >= 80 ? "Shows empathy and understanding in communications" : 
                           friendlinessScore >= 65 ? "Generally respectful in communications" : 
                           "Has capacity for respectful communication"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-purple-800">
                          {friendlinessScore >= 75 ? "Demonstrates positive engagement with others" : 
                           "Shows potential for positive engagement"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-purple-800">
                          Uses {friendlinessScore >= 80 ? "very supportive" : friendlinessScore >= 65 ? "generally supportive" : "occasionally supportive"} language in interactions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Disclaimer */}
      <motion.div 
        className="mt-10 border-t border-purple-100 pt-6 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.5 }}
      >
        <p>
          This report was generated using publicly available data and behavioral analysis. 
          Results should be used as one of many factors when making safety decisions.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} TrueSight | Safe Internet Foundation
        </p>
      </motion.div>
    </div>
  );
}
