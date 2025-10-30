import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Shield, X, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const pricingPlans = [
    {
      id: "free",
      name: "Free",
      description: "Try TrueSight with limited features",
      price: "₹0",
      period: "forever",
      features: [
        { name: "3 basic scans per month", included: true },
        { name: "Identity verification", included: true },
        { name: "Bot detection", included: true },
        { name: "Basic toxicity score", included: true },
        { name: "Harassment detection", included: false },
        { name: "Evidence collection & review", included: false },
        { name: "Report download & sharing", included: false },
        { name: "Advanced analysis metrics", included: false },
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Perfect for active online daters or job seekers",
      price: "₹1,499",
      period: "per month",
      features: [
        { name: "50 advanced scans per month", included: true },
        { name: "Identity verification", included: true },
        { name: "Bot detection", included: true },
        { name: "Advanced toxicity analysis", included: true },
        { name: "Harassment detection", included: true },
        { name: "Evidence collection & review", included: true },
        { name: "Report download & sharing", included: true },
        { name: "Advanced analysis metrics", included: false },
      ],
      cta: "Start Pro Plan",
      popular: true,
    },
    {
      id: "business",
      name: "Business",
      description: "For teams, recruiters, and organizations",
      price: "₹3,999",
      period: "per month",
      features: [
        { name: "Unlimited advanced scans", included: true },
        { name: "Identity verification", included: true },
        { name: "Bot detection", included: true },
        { name: "Advanced toxicity analysis", included: true },
        { name: "Harassment detection", included: true },
        { name: "Evidence collection & review", included: true },
        { name: "Report download & sharing", included: true },
        { name: "Advanced analysis metrics", included: true },
        { name: "Team management dashboard", included: true },
        { name: "Bulk scanning via CSV", included: true },
        { name: "API access for integrations", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
    }
  ];

  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Background elements */}
      <div className="absolute top-40 left-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-60 right-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"></div>
      
      {/* Header Section */}
      <section className="container mx-auto px-4 mb-16 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 text-transparent bg-clip-text">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-purple-800 max-w-3xl mx-auto">
          Choose the plan that fits your needs. All plans include our core safety analysis technology.
        </p>
      </section>

      {/* Pricing Toggle */}
      <section className="container mx-auto px-4 mb-8 text-center relative z-10">
        <div className="inline-flex items-center p-1 bg-purple-100 rounded-full mb-8 shadow-md">
          <button className="px-6 py-2 rounded-full bg-white text-purple-700 shadow-sm font-medium">Monthly</button>
          <button className="px-6 py-2 rounded-full text-purple-500 hover:text-purple-700 transition-colors">Annual (20% off)</button>
        </div>
        <div className="text-sm text-purple-600 mb-2">All prices shown in Indian Rupees (INR)</div>
      </section>

      {/* Pricing Tables */}
      <section className="container mx-auto px-4 mb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`rounded-xl overflow-hidden border shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm ${
                plan.popular ? "border-pink-300 bg-white/90" : "border-purple-200 bg-white/80"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center py-2 font-medium text-sm">
                  Most Popular
                </div>
              )}
              
              {/* Plan Header */}
              <div className={`p-6 ${plan.popular ? "bg-purple-50/50" : "bg-white/50"}`}>
                <h2 className="text-2xl font-bold mb-2 text-purple-900">{plan.name}</h2>
                <p className="text-purple-700 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">{plan.price}</span>
                  <span className="text-purple-500 ml-2">{plan.period}</span>
                </div>
                <Link href={`/login?signup=true&plan=${plan.id}`}>
                  <Button 
                    variant={plan.popular ? "default" : "outline"} 
                    className={plan.popular 
                      ? "w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                      : "w-full border-purple-300 text-purple-700 hover:bg-purple-50"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
              
              {/* Features List */}
              <div className="p-6 bg-white/50 border-t border-purple-100">
                <h3 className="font-semibold mb-4 text-purple-800">What's included:</h3>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-pink-300 mr-2 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-purple-800" : "text-purple-400"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 mb-20 relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-700 to-pink-500 text-transparent bg-clip-text">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-purple-100 shadow-md hover:shadow-xl transition-all duration-300 hover:border-purple-200">
            <h3 className="text-xl font-semibold mb-3 text-purple-800">Can I upgrade or downgrade my plan?</h3>
            <p className="text-purple-700">
              Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your billing cycle.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-purple-100 shadow-md hover:shadow-xl transition-all duration-300 hover:border-purple-200">
            <h3 className="text-xl font-semibold mb-3 text-purple-800">What happens when I run out of scans?</h3>
            <p className="text-purple-700">
              You can purchase additional scans as needed, or wait until your plan refreshes the following month.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-purple-100 shadow-md hover:shadow-xl transition-all duration-300 hover:border-purple-200">
            <h3 className="text-xl font-semibold mb-3 text-purple-800">Do you offer refunds?</h3>
            <p className="text-purple-700">
              We offer a 7-day money-back guarantee for new Pro and Business subscribers if you're not satisfied with our service.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-purple-100 shadow-md hover:shadow-xl transition-all duration-300 hover:border-purple-200">
            <h3 className="text-xl font-semibold mb-3 text-purple-800">What data do you collect?</h3>
            <p className="text-purple-700">
              We only analyze public data available on the internet. We don't store personal information longer than necessary and never share your search history.
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="container mx-auto px-4 relative z-10">
        <div className="bg-gradient-to-br from-purple-900/95 to-pink-800/95 rounded-xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white font-medium text-sm mb-8 backdrop-blur-sm">
                Enterprise Solutions
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">Need a custom solution?</h2>
              <p className="text-purple-100 mb-6">
                We offer tailored packages for larger organizations, educational institutions, and specialized use cases.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-white">
                  <Shield className="h-5 w-5 text-pink-300 mr-2 mt-0.5" />
                  <span>Custom API integration with your systems</span>
                </li>
                <li className="flex items-start text-white">
                  <Shield className="h-5 w-5 text-pink-300 mr-2 mt-0.5" />
                  <span>Dedicated customer success manager</span>
                </li>
                <li className="flex items-start text-white">
                  <Shield className="h-5 w-5 text-pink-300 mr-2 mt-0.5" />
                  <span>Advanced analytics and reporting</span>
                </li>
              </ul>
              <Link href="/login?signup=true&plan=enterprise">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 shadow-xl group">
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-xl border border-purple-200">
              <h3 className="font-bold text-xl mb-6 text-purple-800">Custom Enterprise Features</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-purple-100">
                  <span className="text-purple-700">SSO & Identity Management</span>
                  <Check className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-purple-100">
                  <span className="text-purple-700">Custom Risk Models</span>
                  <Check className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-purple-100">
                  <span className="text-purple-700">Role-based Access Control</span>
                  <Check className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span>Compliance Reporting</span>
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>24/7 Priority Support</span>
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
