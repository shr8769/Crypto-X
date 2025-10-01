import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const useScrollToSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation when component mounts or hash changes
    if (location.hash) {
      const sectionId = location.hash.substring(1); // Remove the #
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  const navigateToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      // If we're on the homepage, just scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // If we're on another page, navigate to homepage with hash
      navigate(`/#${sectionId}`);
    }
  };

  return { navigateToSection };
};