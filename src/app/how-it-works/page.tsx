"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Database, Cpu, BarChart, Search, Shield, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HowItWorksPage() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Animation for the title
  const titleAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Process steps with icons
  const steps = [
    {
      id: 1,
      title: "Enter Profile Information",
      description:
        "Provide a name, username, social media handle, or upload a photo to begin the scanning process.",
      icon: <Search className="h-12 w-12 text-pink-500" />,
      bgColor: "bg-pink-100",
      iconBg: "bg-pink-500/10",
      borderColor: "border-pink-200"
    },
    {
      id: 2,
      title: "AI + OSINT Scan",
      description:
        "Our AI collects and analyzes publicly available information from across the web using OSINT techniques.",
      icon: <Database className="h-12 w-12 text-purple-500" />,
      bgColor: "bg-purple-100",
      iconBg: "bg-purple-500/10",
      borderColor: "border-purple-200"
    },
    {
      id: 3,
      title: "Behavior Analysis",
      description:
        "Advanced algorithms detect patterns related to authenticity, toxicity, and potential safety risks.",
      icon: <Cpu className="h-12 w-12 text-purple-700" />,
      bgColor: "bg-purple-100",
      iconBg: "bg-purple-700/10",
      borderColor: "border-purple-300"
    },
    {
      id: 4,
      title: "Results Dashboard",
      description:
        "Review a comprehensive report with safety scores, evidence, and actionable recommendations.",
      icon: <BarChart className="h-12 w-12 text-pink-600" />,
      bgColor: "bg-pink-100",
      iconBg: "bg-pink-600/10",
      borderColor: "border-pink-300"
    },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Animated background elements */}
      <div className="absolute top-40 left-1/4 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-24 text-center relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            className="mb-6 inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text font-bold text-lg px-4 py-1 rounded-full border border-purple-200">
              Innovative Technology
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 text-transparent bg-clip-text"
            variants={titleAnimation}
            animate={{
              scale: [1, 1.02, 1],
              transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" as const
              }
            }}
          >
            How TrueSight Works
          </motion.h1>
          
          <motion.p className="text-xl text-purple-900/80 max-w-3xl mx-auto">
            Our powerful AI-driven platform analyzes public data to reveal the truth about online profiles.
            Here's how we help you stay safe in the digital world.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-6 rounded-xl shadow-lg shadow-purple-200 group transition-all duration-300"
              size="lg"
              asChild
            >
              <Link href="/scan" className="flex items-center">
                <span>Start Your First Scan</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-300 text-purple-800 hover:bg-purple-100 px-8 py-6 rounded-xl"
              size="lg"
            >
              Watch Demo Video
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section className="container mx-auto px-4 mb-24 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`${step.bgColor} rounded-xl p-8 shadow-lg relative border ${step.borderColor} backdrop-blur-sm`}
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-600 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                {step.id}
              </div>
              
              {/* Icon */}
              <motion.div 
                className={`mb-6 flex justify-center items-center w-20 h-20 mx-auto rounded-full ${step.iconBg}`}
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {step.icon}
              </motion.div>
              
              {/* Title & Description */}
              <h3 className="text-xl font-bold mb-3 text-center text-purple-900">{step.title}</h3>
              <p className="text-purple-700 text-center">{step.description}</p>
              
              {/* Arrow (except for the last step) */}
              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="h-8 w-8 text-pink-500" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 mb-24 bg-gradient-to-r from-purple-100 to-pink-50 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium mb-3 border border-purple-200">
              Powered By
            </span>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-800 to-pink-600 text-transparent bg-clip-text">
              Our Technology Stack
            </h2>
            <p className="text-purple-700 max-w-2xl mx-auto">
              TrueSight combines cutting-edge technologies to deliver accurate and comprehensive profile assessments
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
          >
            <motion.div 
              className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-purple-200"
              variants={fadeIn}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="h-14 w-14 bg-purple-100 rounded-full mb-6 flex items-center justify-center">
                <Search className="h-7 w-7 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-purple-900">Advanced OSINT</h3>
              <p className="text-purple-700 mb-6">
                We ethically gather publicly available information using Open Source Intelligence techniques
                to create a comprehensive profile.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-pink-100 p-1 rounded-full mr-2 text-pink-500">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Social media analysis</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-pink-100 p-1 rounded-full mr-2 text-pink-500">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Public records search</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-pink-100 p-1 rounded-full mr-2 text-pink-500">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Digital footprint mapping</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-purple-200"
              variants={fadeIn}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="h-14 w-14 bg-purple-100 rounded-full mb-6 flex items-center justify-center">
                <Cpu className="h-7 w-7 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-purple-900">AI Analysis</h3>
              <p className="text-purple-700 mb-6">
                Our custom AI models process and analyze data to detect patterns and behaviors that 
                might indicate potential risks.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-pink-100 p-1 rounded-full mr-2 text-pink-500">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Sentiment analysis</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-pink-100 p-1 rounded-full mr-2 text-pink-500">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Behavior pattern detection</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-pink-100 p-1 rounded-full mr-2 text-pink-500">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Language processing</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-purple-200"
              variants={fadeIn}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="h-14 w-14 bg-purple-100 rounded-full mb-6 flex items-center justify-center">
                <BarChart className="h-7 w-7 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-purple-900">Safety Metrics</h3>
              <p className="text-purple-700 mb-6">
                We evaluate multiple dimensions of online safety to provide a comprehensive view of 
                potential risks.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-pink-100 p-1 rounded-full mr-2 text-pink-500">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Identity verification score</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-pink-100 p-1 rounded-full mr-2 text-pink-500">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Toxicity assessment</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-pink-100 p-1 rounded-full mr-2 text-pink-500">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Risk prediction</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="container mx-auto px-4 mb-24 relative z-10">
        <motion.div 
          className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl p-8 md:p-12 shadow-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-800 to-pink-600 text-transparent bg-clip-text">
                Privacy & Ethics First
              </h2>
              <p className="text-purple-700 mb-6">
                At TrueSight, we take privacy and ethics very seriously. Our analysis only uses publicly 
                available information, and we never store personal data longer than necessary. All our 
                processes comply with relevant data protection regulations.
              </p>
              <ul className="space-y-4 mb-8">
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-pink-100 p-1 rounded-full mr-2 mt-1 text-pink-500">
                    <Shield className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Only public data is used in our analysis</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="bg-pink-100 p-1 rounded-full mr-2 mt-1 text-pink-500">
                    <Shield className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Clear consent mechanisms for all data processing</span>
                </motion.li>
                <motion.li 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="bg-pink-100 p-1 rounded-full mr-2 mt-1 text-pink-500">
                    <Shield className="h-4 w-4" />
                  </span>
                  <span className="text-purple-800">Regular privacy audits and compliance checks</span>
                </motion.li>
              </ul>
            </div>
            <motion.div 
              className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-full max-w-md">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-purple-200">
                  <motion.div 
                    className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center"
                    animate={{ 
                      boxShadow: ['0 0 0 0 rgba(168, 85, 247, 0.4)', '0 0 0 20px rgba(168, 85, 247, 0)', '0 0 0 0 rgba(168, 85, 247, 0)'],
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 2,
                    }}
                  >
                    <Shield className="h-10 w-10 text-purple-700" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-purple-900">Our Privacy Promise</h3>
                  <p className="text-purple-700 mb-6 italic">
                    "We only analyze what's already public, and we do it responsibly. Your trust is our priority."
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    Read Our Privacy Policy
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 md:p-12 text-center overflow-hidden relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          {/* Background pattern */}
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('/pattern.svg')] bg-repeat"></div>
          </div>
          
          <motion.h2 
            className="text-4xl font-bold mb-4 text-white"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Ready to See the Truth?
          </motion.h2>
          
          <motion.p 
            className="text-purple-100 mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Start using TrueSight today to make safer decisions about who you trust online.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="px-8 py-6 bg-white text-purple-700 hover:bg-purple-50 shadow-xl group transition-all duration-300"
              asChild
            >
              <Link href="/scan">
                Start a Free Scan <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 border-white text-white hover:bg-white/20"
              asChild
            >
              <Link href="/results">
                View Sample Report
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
