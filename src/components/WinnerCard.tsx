'use strict';

import React from 'react';
import { motion } from 'framer-motion';
import { Winner } from '@/data/winners';
import TeamCrest from './TeamCrest';
import { Trophy } from 'lucide-react';

interface WinnerCardProps {
  winner: Winner;
  index: number;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ winner, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-lg bg-[#0f1423] border border-white/5 p-4 flex items-center gap-6 group hover:border-gold/30 transition-colors"
    >
      <div className="text-2xl font-black text-gray-800 group-hover:text-gold/20 transition-colors tabular-nums min-w-[70px]">
        {winner.year}
      </div>

      <div className="flex items-center gap-4 flex-1">
        <TeamCrest name={winner.winner} size="sm" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white group-hover:text-gold transition-colors">
            {winner.winner}
          </span>
          <span className="text-[10px] text-gray-500">Defeated {winner.runnerUp} ({winner.score})</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-[10px] font-bold text-gold uppercase tracking-tighter">
          <Trophy size={10} />
          <span>Title #{winner.titles}</span>
        </div>
        <div className="text-[9px] text-gray-600 text-right max-w-[120px] truncate uppercase">
          {winner.venue}
        </div>
      </div>

      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

export default WinnerCard;
