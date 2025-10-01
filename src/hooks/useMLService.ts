// src/hooks/useMLService.ts
import { useState, useEffect } from 'react';

interface MLServiceStatus {
  isOnline: boolean;
  modelsAvailable: string[];
  lastChecked: Date | null;
  error: string | null;
}

export const useMLService = () => {
  const [status, setStatus] = useState<MLServiceStatus>({
    isOnline: false,
    modelsAvailable: [],
    lastChecked: null,
    error: null
  });

  const checkMLService = async () => {
    try {
      const response = await fetch('http://localhost:5000/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const healthData = await response.json();
        
        // Get available models
        const modelsResponse = await fetch('http://localhost:5000/models');
        const modelsData = await modelsResponse.json();

        setStatus({
          isOnline: true,
          modelsAvailable: modelsData.available_models || [],
          lastChecked: new Date(),
          error: null
        });
      } else {
        throw new Error(`ML service responded with status: ${response.status}`);
      }
    } catch (error) {
      setStatus({
        isOnline: false,
        modelsAvailable: [],
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  useEffect(() => {
    // Check immediately
    checkMLService();
    
    // Check every 30 seconds
    const interval = setInterval(checkMLService, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    ...status,
    checkMLService
  };
};