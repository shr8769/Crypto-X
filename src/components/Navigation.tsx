import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hexagon, User, LogOut } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useScrollToSection } from "@/hooks/useScrollToSection";

const Navigation = () => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { navigateToSection } = useScrollToSection();

  const handleSignOut = () => {
    signOut(() => navigate("/"));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Hexagon className="w-6 h-6 text-primary group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-xl font-bold">CryptoX</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => navigateToSection('crypto-prices')}
            >
              Crypto Prices
            </button>
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => navigateToSection('crypto-news')}
            >
              Crypto News
            </button>
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => navigateToSection('price-prediction')}
            >
              Price Prediction
            </button>
          </div>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.imageUrl} alt={user?.firstName || "User"} />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{user?.firstName || user?.username || "User"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600">
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/sign-up">
                  <Button variant="hero">Start Trading</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
