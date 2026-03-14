'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StarBackground = () => {
  const [stars, setStars] = useState<Array<{ top: string; left: string; duration: number }>>([]);

  useEffect(() => {
    // Only runs on client — no hydration mismatch
    setStars(
      Array.from({ length: 20 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 3 + 2,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 z-[-1] opacity-30">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{ top: star.top, left: star.left }}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
};

export default StarBackground;
