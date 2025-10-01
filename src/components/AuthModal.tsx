import { SignIn, SignUp } from '@clerk/clerk-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'sign-in' | 'sign-up';
}

const AuthModal = ({ isOpen, onClose, mode = 'sign-in' }: AuthModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-12 right-0 z-50 text-white hover:text-gray-300"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {mode === 'sign-in' ? (
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-primary hover:bg-primary/90',
                  card: 'bg-card',
                  headerTitle: 'text-foreground',
                  headerSubtitle: 'text-muted-foreground',
                },
              }}
              redirectUrl="/dashboard"
              signUpUrl="/sign-up"
            />
          ) : (
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-primary hover:bg-primary/90',
                  card: 'bg-card',
                  headerTitle: 'text-foreground',
                  headerSubtitle: 'text-muted-foreground',
                },
              }}
              redirectUrl="/dashboard"
              signInUrl="/sign-in"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;