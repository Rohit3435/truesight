"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ShoppingBag,
  Star,
  ArrowRight,
  Menu,
  Search,
  Heart,
  User,
  Shield,
} from "lucide-react";
import { aurauiMotion } from "@/lib/motion";
import Image from "next/image";

const HeroSection = () => {
  // Use the TrueSight logo
  const logoSrc = "/truesight-logo.svg";

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-background to-pink-200/30" />
      
      {/* Animated background elements */}
      <div className="absolute top-40 left-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-60 right-1/3 w-80 h-80 bg-purple-800/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Navbar */}
      <motion.nav
        className="relative p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <a href="#" title="TrueSight">
                <Image
                  className="w-auto h-8"
                  src={logoSrc}
                  alt="TrueSight Logo"
                  width={100}
                  height={32}
                />
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="/how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              How It Works
            </a>
            <a
              href="/use-cases"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Use Cases
            </a>
            <a
              href="/pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </a>
            <a
              href="/scan"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Start Scan
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex bg-gray-100/20 hover:bg-gray-100/30"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex bg-gray-100/20 hover:bg-gray-100/30"
            >
              <User className="w-4 h-4" />
            </Button>
            <Button size="sm" asChild>
              <a href="/scan">
                <Shield className="w-4 h-4 mr-2" />
                Start Scan
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 pt-12 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={aurauiMotion.container}
          >
            <motion.div variants={aurauiMotion.item}>
              <Badge
                variant="secondary"
                className="mb-6 bg-purple-600/20 border-purple-400 text-purple-800 font-medium"
              >
                AI-Powered Profile Analysis
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your <span className="bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 text-transparent bg-clip-text">Online Safety</span> Guardian
              </h1>
            </motion.div>

            <motion.p
              className="text-xl text-muted-foreground leading-relaxed"
              variants={aurauiMotion.item}
            >
              TrueSight analyzes social media profiles and online content to identify potential risks
              and safety concerns, helping you make informed decisions about your online connections.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={aurauiMotion.item}
            >
              <Button 
                size="lg" 
                className="text-lg px-8 bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 hover:from-purple-900 hover:via-purple-700 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20" 
                asChild
              >
                <a href="/scan">
                  Start Scanning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 border-2 border-purple-400 text-purple-800 hover:bg-purple-50 hover:border-purple-500"
                asChild
              >
                <a href="/how-it-works">
                  How It Works
                </a>
              </Button>
            </motion.div>

            <motion.div
              className="flex items-center gap-6 pt-4"
              variants={aurauiMotion.item}
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  4.9/5 from 2k+ users
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right content - Features showcase */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="p-4 auraui-glass border-purple-300 shadow-lg shadow-purple-500/10 overflow-hidden relative">
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-400/20 rounded-full"></div>
                  <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-pink-400/20 rounded-full"></div>
                  <div className="relative z-10">
                    <div className="aspect-square bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg mb-4 flex items-center justify-center">
                      <Search className="w-16 h-16 text-purple-600/60" />
                    </div>
                    <h3 className="font-semibold mb-1 text-purple-900">Profile Analysis</h3>
                    <p className="text-sm text-purple-700 mb-2">
                      Deep content scanning
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text">Fast</span>
                      <Badge variant="secondary" className="bg-purple-600/20 border-purple-400 text-purple-800 font-medium">
                        AI-Powered
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="pt-8"
              >
                <Card className="p-4 auraui-glass border-pink-300 shadow-lg shadow-pink-500/10 overflow-hidden relative">
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-400/20 rounded-full"></div>
                  <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-pink-400/20 rounded-full"></div>
                  <div className="relative z-10">
                    <div className="aspect-square bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-lg mb-4 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-pink-600/60" />
                    </div>
                    <h3 className="font-semibold mb-1 text-pink-900">Safety Reports</h3>
                    <p className="text-sm text-pink-700 mb-2">
                      Comprehensive insights
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-700 text-transparent bg-clip-text">Detailed</span>
                      <Badge
                        variant="secondary"
                        className="bg-pink-500/20 border-pink-400 text-pink-700 font-medium"
                      >
                        Premium
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="p-4 auraui-glass border-2 border-gradient-purple-pink relative overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-400/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-pink-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700">
                      Try TrueSight
                    </p>
                    <p className="font-semibold text-purple-900">Free for first 3 scans</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-purple-600/10 to-pink-500/10 text-purple-800 border-purple-300"
                  >
                    Limited Time
                  </Badge>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
