import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we have a valid Clerk key (not the placeholder)
const isValidClerkKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== "pk_test_your-publishable-key-here";

if (!isValidClerkKey) {
  // Show error message for missing Clerk key
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Clerk Configuration Required</h1>
          <p className="text-gray-700 mb-4">
            To use authentication features, you need to set up your Clerk publishable key:
          </p>
          <ol className="text-sm text-gray-600 mb-4 space-y-2">
            <li>1. Go to <a href="https://dashboard.clerk.com" target="_blank" className="text-blue-600 underline">dashboard.clerk.com</a></li>
            <li>2. Create a new application or select existing one</li>
            <li>3. Copy your publishable key</li>
            <li>4. Update the <code className="bg-gray-100 px-1 rounded">.env</code> file with your actual key</li>
          </ol>
          <div className="bg-gray-100 p-3 rounded text-sm">
            <code>VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here</code>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            The app will work without authentication but with limited features.
          </p>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
