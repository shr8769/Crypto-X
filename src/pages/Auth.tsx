import { useLocation } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Navigation from "@/components/Navigation";

const Auth = () => {
  const location = useLocation();
  const isSignUp = location.pathname === '/sign-up';

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex justify-center">
          {isSignUp ? (
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-primary hover:bg-primary/90',
                  card: 'bg-card/95 backdrop-blur-sm border-border/50',
                  headerTitle: 'text-foreground text-2xl',
                  headerSubtitle: 'text-muted-foreground',
                  formFieldInput: 'bg-input border-border/50 focus:border-primary',
                  footerActionLink: 'text-primary hover:text-primary/90',
                },
              }}
              redirectUrl="/dashboard"
              signInUrl="/sign-in"
            />
          ) : (
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-primary hover:bg-primary/90',
                  card: 'bg-card/95 backdrop-blur-sm border-border/50',
                  headerTitle: 'text-foreground text-2xl',
                  headerSubtitle: 'text-muted-foreground',
                  formFieldInput: 'bg-input border-border/50 focus:border-primary',
                  footerActionLink: 'text-primary hover:text-primary/90',
                },
              }}
              redirectUrl="/dashboard"
              signUpUrl="/sign-up"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
