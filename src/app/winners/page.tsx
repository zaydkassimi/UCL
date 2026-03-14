'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { winners } from '@/data/winners';
import WinnerCard from '@/components/WinnerCard';
import { Trophy, Star } from 'lucide-react';

export default function WinnersPage() {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-4xl mx-auto mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center p-4 bg-gold/10 rounded-full mb-8"
        >
          <Trophy className="text-gold" size={40} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4"
        >
          Hall of <span className="text-gold">Fame</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 uppercase tracking-[0.2em] font-bold text-xs"
        >
          Timeline of European Champions since 1955
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-4 relative">
        {/* Timeline Line */}
        <div className="absolute left-[35px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />
        
        {winners.map((winner, index) => (
          <WinnerCard key={`${winner.year}-${winner.winner}`} winner={winner} index={index} />
        ))}
      </div>
      
      {/* Decorative Stars */}
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden opacity-[0.05]">
          <Star className="absolute top-[10%] left-[5%] text-white" size={400} />
          <Star className="absolute top-[60%] right-[0%] text-gold" size={300} />
      </div>
    </div>
  );
}
