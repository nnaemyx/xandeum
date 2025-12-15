'use client';

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    // Load Inter font
    const interLink = document.createElement('link');
    interLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    interLink.rel = 'stylesheet';
    document.head.appendChild(interLink);

    // Load Material Symbols
    const materialLink = document.createElement('link');
    materialLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
    materialLink.rel = 'stylesheet';
    document.head.appendChild(materialLink);

    return () => {
      // Cleanup (optional, but good practice)
      document.head.removeChild(interLink);
      document.head.removeChild(materialLink);
    };
  }, []);

  return null;
}

