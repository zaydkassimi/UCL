'use strict';

import React from 'react';
import { motion } from 'framer-motion';

interface StatBannerProps {
  label: string;
  value: string | number;
  sublabel?: string;
  className?: string;
}

const StatBanner: React.FC<StatBannerProps> = ({ label, value, sublabel, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-[#121829]/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center backdrop-blur-sm ${className}`}
    >
      <span className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-2">{label}</span>
      <span className="text-4xl md:text-5xl font-black text-gold mb-1 tracking-tighter">
        {value}
      </span>
      {sublabel && <span className="text-xs font-medium text-gray-400">{sublabel}</span>}
    </motion.div>
  );
};

export default StatBanner;
