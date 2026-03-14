'use client';

import React from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { getTodayMatches, Match } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import StatBanner from '@/components/StatBanner';
import { Trophy, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import StarBackground from '@/components/StarBackground';

export default function Home() {
  const { data: matches, error, isLoading: loading } = useSWR('today-matches', getTodayMatches, {
    refreshInterval: 60000,
    shouldRetryOnError: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[100%] bg-gradient-to-b from-blue-900/10 via-ucl-navy to-ucl-navy z-[-1]" />
        
        <StarBackground />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-gold/30 flex items-center justify-center p-4 bg-gold/5 backdrop-blur-sm shadow-[0_0_50px_rgba(201,168,76,0.15)]">
             <Trophy size={60} className="text-gold" strokeWidth={1.5} />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-gold/10 rounded-full border-dashed"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-6 italic"
        >
          European <br />
          <span className="text-gold">Grandeur</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 max-w-lg mb-10 text-sm md:text-base uppercase tracking-[0.2em] font-medium"
        >
          The official digital experience of the UEFA Champions league
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link href="/matches" className="px-8 py-4 bg-gold text-[#0a0e1a] font-black uppercase tracking-widest rounded-full hover:bg-white transition-colors flex items-center gap-2 group shadow-[0_10px_30px_rgba(201,168,76,0.2)]">
            Today's Matches
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/winners" className="px-8 py-4 border border-white/20 text-white font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm">
            Hall of Fame
          </Link>
        </motion.div>
      </section>

      {/* Stats Quick Look */}
      <section className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBanner label="Most Titles" value="15" sublabel="Real Madrid CF" />
        <StatBanner label="Current Year" value="2026" sublabel="Season 2025/26" />
        <StatBanner label="Live Games" value={matches?.length || 0} sublabel="Available Data" />
      </section>

      {/* Today's Matches Section */}
      <section className="container mx-auto px-4 min-h-[400px]">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 rounded text-[10px] uppercase font-black tracking-widest text-gold mb-3">Featured Games</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Tonight's Drama</h2>
          </div>
          <Link href="/matches" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gold transition-colors flex items-center gap-1 group">
            View Schedule
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
            <div className="flex flex-col items-center justify-center p-20 bg-[#121829]/50 rounded-2xl border border-white/5">
                <AlertCircle className="text-gray-600 mb-4" size={48} />
                <span className="text-gray-500 font-bold uppercase tracking-widest">Data unavailable</span>
            </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {matches && matches.length > 0 ? (
                matches.slice(0, 3).map((match: Match) => (
                    <motion.div key={match.id} variants={itemVariants}>
                      <MatchCard match={match} />
                    </motion.div>
                ))
            ) : (
                <div className="col-span-full py-20 text-center">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">No matches scheduled for today</span>
                </div>
            )}
          </motion.div>
        )}
      </section>
      
      {/* Visual Break */}
      <div className="relative py-20 px-4 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-[-1] flex items-center justify-center opacity-[0.03]">
           <svg viewBox="0 0 512 512" width="1000" height="1000" fill="currentColor" className="text-white">
             <path d="M256 0c-141.385 0-256 114.615-256 256s114.615 256 256 256 256-114.615 256-256-114.615-256-256-256zm0 464c-114.875 0-208-93.125-208-208s93.125-208 208-208 208 93.125 208 208-93.125 208-208 208zm0-352c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144z"/>
           </svg>
        </div>
        <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-widest text-white/40 max-w-2xl text-center">
          "The Champions League is where the legends are forged and kings are crowned."
        </h3>
      </div>
    </div>
  );
}
