"use client";
import { SignInButton } from "@clerk/nextjs";
import { TrendingUp, Shield, Zap, BarChart3, Globe, Users } from "lucide-react";

export default function ProfessionalHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="mb-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                CryptoX
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Professional Crypto
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Platform
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced cryptocurrency analytics with real-time market data, institutional-grade insights, 
              and professional trading tools. Join thousands of traders who trust CryptoX.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {/* Fixed SignInButton with correct prop */}
              <SignInButton mode="redirect" afterSignInUrl="/dashboard">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <span className="relative z-10">Access Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </button>
              </SignInButton>
              
              <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">500K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">$50B+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Volume Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Professional-Grade Features
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to analyze, track, and trade cryptocurrencies like a professional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Real-Time Analytics",
                description: "Live market data with advanced charting and technical indicators"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Enterprise Security",
                description: "Bank-grade security with multi-factor authentication"
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Advanced Charting",
                description: "Professional trading charts with 50+ technical indicators"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Markets",
                description: "Access to 500+ exchanges and 10,000+ cryptocurrencies"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Sub-millisecond data updates and instant execution"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community Insights",
                description: "Connect with professional traders and share strategies"
              }
            ].map((feature, index) => (
              <div key={index} className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Start Professional Trading?
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              Join the next generation of cryptocurrency traders. Get started in less than 60 seconds.
            </p>
            {/* Fixed SignInButton with correct prop */}
            <SignInButton mode="redirect" afterSignInUrl="/dashboard">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200">
                Start Trading Now →
              </button>
            </SignInButton>
          </div>
        </div>
      </section>
    </div>
  );
}
