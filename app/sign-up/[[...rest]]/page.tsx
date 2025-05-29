"use client";
import { SignUp } from "@clerk/nextjs";
import { TrendingUp, BarChart3, Shield, Users } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-binanceDark px-4">
      <div className="w-full max-w-xl mx-auto text-center mb-10">
        <div className="flex flex-col items-center space-y-2">
          <TrendingUp className="w-12 h-12 text-binanceYellow" />
          <h1 className="text-4xl font-extrabold text-binanceYellow">Join CryptoX</h1>
          <p className="text-lg text-gray-300 mt-2">
            Start your crypto journey with the most advanced platform.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <BarChart3 className="w-7 h-7 text-green-400 mb-2" />
            <span className="text-gray-200 font-medium">Live Market Data</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-7 h-7 text-blue-400 mb-2" />
            <span className="text-gray-200 font-medium">Enterprise Security</span>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-7 h-7 text-purple-400 mb-2" />
            <span className="text-gray-200 font-medium">Global Community</span>
          </div>
        </div>
      </div>
      <div className="w-full max-w-md mx-auto">
        <SignUp
          routing="path"
          path="/sign-up"
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: "bg-binanceYellow text-binanceDark hover:bg-yellow-400 font-bold",
              card: "bg-binanceGray shadow-2xl border-0 rounded-2xl",
              headerTitle: "text-binanceYellow",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-gray-800 text-gray-200 hover:bg-gray-700",
              formFieldInput: "bg-gray-800 text-white border-gray-600",
              footerActionLink: "text-binanceYellow hover:text-yellow-400",
            },
          }}
        />
      </div>
    </div>
  );
}
