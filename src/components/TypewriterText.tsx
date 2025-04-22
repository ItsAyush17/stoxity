
import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className="font-mono">
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">▋</span>
      )}
    </span>
  );
};
