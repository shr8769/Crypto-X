import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const SimpleApp = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <Sonner />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-4">CryptoX</h1>
        <p className="text-center text-muted-foreground">Testing the basic setup...</p>
        <div className="mt-8 p-4 bg-card rounded-lg border">
          <p>If you can see this styled content, Tailwind CSS is working!</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleApp;