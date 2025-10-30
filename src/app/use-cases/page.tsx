import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Briefcase, Home, ShoppingBag, ChevronRight, Shield, ArrowRight } from "lucide-react";

export default function UseCasesPage() {
  const useCases = [
    {
      id: "dating",
      title: "Dating Safety",
      description: "Verify online dates before meeting them in person. TrueSight helps you ensure they are who they claim to be and flags any concerning behavior patterns.",
      icon: <Heart className="h-12 w-12 text-pink-500" />,
      benefits: [
        "Identify fake profiles and catfishing attempts",
        "Flag aggressive or toxic communication patterns",
        "Detect inconsistencies in personal stories",
        "Verify profile authenticity across platforms"
      ],
      testimonial: {
        quote: "TrueSight helped me avoid what could have been a dangerous situation. The person I matched with had a completely different identity online.",
        author: "Jessica, 28"
      }
    },
    {
      id: "hiring",
      title: "Hiring Pre-Check",
      description: "Make informed hiring decisions by understanding candidates' online presence. Identify red flags before making an offer.",
      icon: <Briefcase className="h-12 w-12 text-purple-600" />,
      benefits: [
        "Review public professional conduct",
        "Verify professional claims and experience",
        "Identify potential cultural fit issues",
        "Complement traditional background checks"
      ],
      testimonial: {
        quote: "As a small business owner, I can't afford bad hires. TrueSight gives me peace of mind about who I'm bringing onto my team.",
        author: "Michael, Founder"
      }
    },
    {
      id: "roommates",
      title: "Roommates & Co-founders",
      description: "Before committing to living together or starting a business, make sure your potential partner is trustworthy and compatible.",
      icon: <Home className="h-12 w-12 text-purple-500" />,
      benefits: [
        "Verify financial responsibility indicators",
        "Identify lifestyle compatibility factors",
        "Check for previous disputes or conflicts",
        "Ensure consistent personality presentation"
      ],
      testimonial: {
        quote: "My potential roommate seemed perfect until TrueSight revealed their history of not paying bills and disputes with previous roommates.",
        author: "Alex, 31"
      }
    },
    {
      id: "buying-selling",
      title: "Online Buying & Selling",
      description: "Stay safe when transacting with strangers online through marketplaces, classifieds, or peer-to-peer services.",
      icon: <ShoppingBag className="h-12 w-12 text-pink-600" />,
      benefits: [
        "Verify seller legitimacy and history",
        "Check for scam warning signs",
        "Review transaction patterns",
        "Identify suspicious communications"
      ],
      testimonial: {
        quote: "I almost sent a deposit to someone selling a car online, but TrueSight showed they had multiple seller accounts with different names.",
        author: "David, 42"
      }
    }
  ];

  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Background elements */}
      <div className="absolute top-40 left-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-60 right-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-16 text-center relative z-10">
        <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-800 font-medium text-sm mb-8 shadow-md">
          <Shield className="h-4 w-4 mr-2" />
          Real Solutions for Real Problems
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 text-transparent bg-clip-text">
          How TrueSight Keeps You Safe
        </h1>
        <p className="text-xl text-purple-800 max-w-3xl mx-auto">
          In today's digital world, trust is precious and risk is real. 
          See how our AI-powered analysis helps you make safer decisions in different scenarios.
        </p>
      </section>

      {/* Use Cases Cards */}
      <section className="container mx-auto px-4 mb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase) => (
            <div key={useCase.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-purple-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform duration-300 relative z-10">
                  {useCase.icon}
                </div>
                <h2 className="text-2xl font-bold mb-3 text-purple-900">{useCase.title}</h2>
                <p className="text-purple-700 mb-6 relative z-10">
                  {useCase.description}
                </p>
                
                <h3 className="font-semibold mb-3 text-purple-800">Key Benefits:</h3>
                <ul className="space-y-2 mb-6">
                  {useCase.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-gradient-to-r from-purple-200 to-pink-200 p-1 rounded-full mr-2 mt-0.5 shadow-sm">
                        <ChevronRight className="h-3 w-3 text-purple-700" />
                      </div>
                      <span className="text-purple-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Testimonial */}
                <div className="bg-gradient-to-br from-purple-100/80 to-pink-100/80 p-5 rounded-lg border border-purple-200 mb-6 shadow-inner">
                  <p className="italic text-sm mb-3 text-purple-800">"{useCase.testimonial.quote}"</p>
                  <p className="text-sm text-purple-600 font-medium">— {useCase.testimonial.author}</p>
                </div>
                
                <Link href="/login?signup=true&usecase={useCase.id}">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg group">
                    Start {useCase.title} Scan
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Use Case: Parent & School Safety */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-gradient-subtle rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-8">
                Special Use Case
              </div>
              <h2 className="text-3xl font-bold mb-4">Parent & School Safety</h2>
              <p className="text-muted-foreground mb-6">
                TrueSight offers special tools for parents and educational institutions to help protect minors from online predators, 
                cyberbullying, and harmful content.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="bg-accent/20 p-1 rounded-full mr-2 mt-0.5">
                    <ChevronRight className="h-4 w-4 text-accent" />
                  </div>
                  <span>Enhanced verification for school clubs and groups</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-accent/20 p-1 rounded-full mr-2 mt-0.5">
                    <ChevronRight className="h-4 w-4 text-accent" />
                  </div>
                  <span>Educator background verification</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-accent/20 p-1 rounded-full mr-2 mt-0.5">
                    <ChevronRight className="h-4 w-4 text-accent" />
                  </div>
                  <span>Special alerts for predatory behavior patterns</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button>
                  Contact Us for Educational Solutions
                </Button>
              </Link>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-elegant border border-border">
              <h3 className="font-bold text-xl mb-4">Case Study: Delhi Public School, Gurgaon</h3>
              <p className="mb-4">
                Delhi Public School in Gurgaon implemented TrueSight to verify club volunteers, extracurricular activity leaders, and online interactions, 
                resulting in the identification of five individuals with concerning online behavior patterns and protecting students from potential harm.
              </p>
              <div className="flex justify-between items-center text-sm mb-4">
                <span>Safety incidents:</span>
                <span className="font-bold text-green-500">Reduced by 78%</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <span>Parent confidence:</span>
                <span className="font-bold text-green-500">Increased by 92%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Implementation time:</span>
                <span className="font-bold">Only 10 days</span>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Link href="/case-studies/education" className="text-primary hover:underline flex items-center">
                  <span>Read full case study</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-card rounded-xl p-8 md:p-12 text-center shadow-elegant border border-border">
          <h2 className="text-3xl font-bold mb-4">Start Protecting Yourself Today</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            No matter your situation, TrueSight gives you the insights you need to make safer decisions 
            about who you trust in your digital and real-world interactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scan">
              <Button size="lg" className="px-8">Try Free Basic Scan</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="px-8">View Plans & Pricing</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
