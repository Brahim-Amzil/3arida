'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface CaptchaProtectionProps {
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  siteKey?: string;
  size?: 'normal' | 'compact';
  theme?: 'light' | 'dark';
  className?: string;
}

// Simple math CAPTCHA for development/fallback
interface MathCaptchaProps {
  onVerify: (success: boolean) => void;
  className?: string;
}

const MathCaptcha: React.FC<MathCaptchaProps> = ({
  onVerify,
  className = '',
}) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    generateNewProblem();
  }, []);

  const generateNewProblem = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setUserAnswer('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswer = num1 + num2;
    const userAnswerNum = parseInt(userAnswer);

    if (userAnswerNum === correctAnswer) {
      onVerify(true);
      setError('');
    } else {
      setError('Incorrect answer. Please try again.');
      generateNewProblem();
      onVerify(false);
    }
  };

  return (
    <div
      className={`border border-gray-300 rounded-lg p-4 bg-gray-50 ${className}`}
    >
      <div className="text-sm font-medium text-gray-700 mb-3">
        Security Check: Please solve this simple math problem
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-mono bg-white px-3 py-2 rounded border">
            {num1} + {num2} = ?
          </span>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Answer"
            className="w-20 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <Button type="submit" size="sm">
            Verify
          </Button>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
      <div className="text-xs text-gray-500 mt-2">
        This helps us prevent automated spam and abuse.
      </div>
    </div>
  );
};

// Google reCAPTCHA component (for production)
const GoogleRecaptcha: React.FC<CaptchaProtectionProps> = ({
  onVerify,
  onError,
  siteKey,
  size = 'normal',
  theme = 'light',
  className = '',
}) => {
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [widgetId, setWidgetId] = useState<number | null>(null);

  useEffect(() => {
    // Load reCAPTCHA script
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src =
        'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;

      // Define the callback function
      (window as any).onRecaptchaLoad = () => {
        setIsLoaded(true);
      };

      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && recaptchaRef.current && siteKey && !widgetId) {
      try {
        const id = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          size,
          theme,
          callback: (token: string) => {
            onVerify(token);
          },
          'error-callback': () => {
            if (onError) {
              onError('reCAPTCHA verification failed. Please try again.');
            }
          },
          'expired-callback': () => {
            if (onError) {
              onError('reCAPTCHA expired. Please verify again.');
            }
          },
        });
        setWidgetId(id);
      } catch (error) {
        console.error('Error rendering reCAPTCHA:', error);
        if (onError) {
          onError(
            'Failed to load security verification. Please refresh the page.'
          );
        }
      }
    }
  }, [isLoaded, siteKey, size, theme, onVerify, onError, widgetId]);

  const reset = () => {
    if (widgetId !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetId);
    }
  };

  return (
    <div className={className}>
      <div ref={recaptchaRef}></div>
      {!isLoaded && (
        <div className="flex items-center justify-center p-4 border border-gray-300 rounded bg-gray-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
          <span className="text-sm text-gray-600">
            Loading security verification...
          </span>
        </div>
      )}
    </div>
  );
};

// Main CAPTCHA component that chooses between implementations
export default function CaptchaProtection({
  onVerify,
  onError,
  siteKey,
  size = 'normal',
  theme = 'light',
  className = '',
}: CaptchaProtectionProps) {
  const [useMathCaptcha, setUseMathCaptcha] = useState(!siteKey);

  const handleMathCaptchaVerify = (success: boolean) => {
    if (success) {
      onVerify('math-captcha-verified');
    } else if (onError) {
      onError('Math CAPTCHA verification failed');
    }
  };

  // Use math CAPTCHA if no reCAPTCHA site key is provided
  if (useMathCaptcha || !siteKey) {
    return (
      <MathCaptcha onVerify={handleMathCaptchaVerify} className={className} />
    );
  }

  return (
    <GoogleRecaptcha
      onVerify={onVerify}
      onError={onError}
      siteKey={siteKey}
      size={size}
      theme={theme}
      className={className}
    />
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: {
      render: (container: Element, parameters: any) => number;
      reset: (widgetId: number) => void;
      getResponse: (widgetId: number) => string;
    };
  }
}
