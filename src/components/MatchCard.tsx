'use strict';

import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '@/lib/api';
import TeamCrest from './TeamCrest';
import LiveBadge from './LiveBadge';

import Link from 'next/link';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const isLive = match.status === 'LIVE';
  const isUpcoming = match.status === 'UPCOMING';
  const isFT = match.status === 'FT';

  const homeScore = match.homeScore ?? '-';
  const awayScore = match.awayScore ?? '-';

  return (
    <Link href={`/matches/${match.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(201, 168, 76, 0.15)' }}
        className="relative overflow-hidden rounded-xl bg-[#121829]/80 border border-white/5 backdrop-blur-md p-4 flex flex-col gap-3 group transition-all duration-300 cursor-pointer"
      >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-center">
        <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500">{match.stage}</span>
        {isLive && <LiveBadge />}
        {isFT && <span className="text-[9px] font-black px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">FT</span>}
        {isUpcoming && <span className="text-[9px] font-bold text-blue-400">{match.time}</span>}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
          <TeamCrest name={match.homeTeam.name} crest={match.homeTeam.crest} size="sm" />
          <span className="text-[10px] font-bold text-center leading-tight h-7 flex items-center truncate w-full justify-center">{match.homeTeam.name}</span>
        </div>

        <div className="flex flex-col items-center gap-1 min-w-[50px]">
          {(isLive || isFT) ? (
            <div className="text-xl font-black flex items-center gap-1.5 tracking-tighter">
              <span className={isLive ? 'text-white' : 'text-gray-400'}>{homeScore}</span>
              <span className="text-gray-600 text-sm">-</span>
              <span className={isLive ? 'text-white' : 'text-gray-400'}>{awayScore}</span>
            </div>
          ) : (
            <div className="text-[10px] font-medium text-gray-500 italic opacity-50 tracking-widest">VS</div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
          <TeamCrest name={match.awayTeam.name} crest={match.awayTeam.crest} size="sm" />
          <span className="text-[10px] font-bold text-center leading-tight h-7 flex items-center truncate w-full justify-center">{match.awayTeam.name}</span>
        </div>
      </div>
      
      <div className="absolute -bottom-6 -right-6 w-16 h-16 opacity-[0.03] text-white">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2h7.6L15.8 13.8 18.2 21 12 16.6 5.8 21l2.4-7.2L2 9.2h7.6z" />
        </svg>
      </div>
    </motion.div>
    </Link>
  );
};

export default MatchCard;
