import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hexagon } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isDashboard = location.pathname === "/dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Hexagon className="w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-xl font-bold">CryptoX</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Prices
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthPage && !isDashboard && (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="hero">Start Trading</Button>
                </Link>
              </>
            )}
            {isDashboard && (
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
