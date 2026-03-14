'use client';

import React from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import { getMatchDetail } from '@/lib/api';
import TeamCrest from '@/components/TeamCrest';
import LiveBadge from '@/components/LiveBadge';
import { ChevronLeft, Calendar, MapPin, User, Clock, AlertCircle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MatchDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    const { data: match, error, isLoading } = useSWR(id ? `match-${id}` : null, () => getMatchDetail(id as string), {
        refreshInterval: (data) => (data?.status === 'IN_PLAY' || data?.status === 'PAUSED' ? 30000 : 0),
        shouldRetryOnError: true,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-32 animate-pulse">
                <div className="h-8 w-32 bg-white/5 rounded mb-8" />
                <div className="h-64 bg-white/5 rounded-3xl mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-48 bg-white/5 rounded-2xl" />
                    <div className="h-48 bg-white/5 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (error || !match) {
        return (
            <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
                <AlertCircle size={48} className="text-gray-600 mb-4" />
                <h2 className="text-2xl font-black uppercase tracking-widest text-gray-500 mb-6">Data unavailable</h2>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY' || match.status === 'PAUSED';
    const isFT = match.status === 'FT' || match.status === 'FINISHED';
    const isScheduled = !isLive && !isFT;

    const score = match.score;
    const homeScore = score?.fullTime?.home ?? score?.halfTime?.home ?? 0;
    const awayScore = score?.fullTime?.away ?? score?.halfTime?.away ?? 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="container mx-auto px-4 py-32 max-w-5xl"
        >
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8 group"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Back to Matches</span>
            </button>

            {/* Hero Header */}
            <section className="relative overflow-hidden rounded-[2rem] bg-[#121829]/80 border border-white/5 backdrop-blur-xl p-8 md:p-12 mb-8 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-gold/5 pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between md:gap-4">
                        {/* Home Team */}
                        <div className="flex flex-col items-center gap-4 flex-1">
                            <TeamCrest name={match.homeTeam.name} crest={match.homeTeam.crest} size="lg" />
                            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-center">{match.homeTeam.name}</h1>
                        </div>

                        {/* Score / Status */}
                        <div className="flex flex-col items-center gap-6 min-w-[240px]">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{match.stage}</span>
                                {isLive && <LiveBadge />}
                                {isScheduled && (
                                    <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Match not started yet</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                {isScheduled ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-4xl md:text-5xl font-black text-gray-700 italic uppercase tracking-tighter">vs</span>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-xl border border-gold/20">
                                            <Clock size={18} className="text-gold" />
                                            <span className="text-2xl font-black text-gold tracking-tighter">
                                                {new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-6xl md:text-8xl font-black tracking-tighter flex items-center gap-6">
                                        <span className={isLive ? 'text-white' : 'text-gray-400'}>{homeScore}</span>
                                        <span className="text-gray-700">-</span>
                                        <span className={isLive ? 'text-white' : 'text-gray-400'}>{awayScore}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock size={14} className="text-gold" />
                                    <span className="text-xs font-bold">
                                        {new Date(match.utcDate).toLocaleTimeString('en-GB', {
                                            timeZone: 'Africa/Casablanca',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    {new Date(match.utcDate).toLocaleDateString('en-GB', {
                                        timeZone: 'Africa/Casablanca',
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long'
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center gap-4 flex-1">
                            <TeamCrest name={match.awayTeam.name} crest={match.awayTeam.crest} size="lg" />
                            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-center">{match.awayTeam.name}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Match Info */}
                <section className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-6">Match Details</h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <Calendar size={18} className="text-gold mt-1" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-wide text-white">{new Date(match.utcDate).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Full Date</p>
                            </div>
                        </div>
                        {match.referees && match.referees.length > 0 && (
                            <div className="flex items-start gap-4">
                                <User size={18} className="text-gold mt-1" />
                                <div>
                                    <p className="text-xs font-black uppercase tracking-wide text-white">{match.referees[0].name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Referee</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start gap-4">
                            <Trophy size={18} className="text-gold mt-1" />
                            <div>
                                <p className="text-xs font-black uppercase tracking-wide text-white">UEFA Champions League</p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">{match.stage}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timeline - Only if match has started */}
                {!isScheduled && (
                    <section className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-6">Score Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Half Time Score</span>
                                <span className="text-xs font-black">{score?.halfTime?.home ?? '-'} - {score?.halfTime?.away ?? '-'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Full Time Score</span>
                                <span className="text-xs font-black text-gold">{score?.fullTime?.home ?? '-'} - {score?.fullTime?.away ?? '-'}</span>
                            </div>
                            {(score?.extraTime?.home !== null && score?.extraTime?.home !== undefined) && (
                                <div className="flex justify-between items-center py-2 border-t border-white/5">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Extra Time</span>
                                    <span className="text-xs font-black">{score.extraTime.home} - {score.extraTime.away}</span>
                                </div>
                            )}
                            {(score?.penalties?.home !== null && score?.penalties?.home !== undefined) && (
                                <div className="flex justify-between items-center py-2 border-t border-white/5">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Penalties</span>
                                    <span className="text-xs font-black text-gold">{score.penalties.home} - {score.penalties.away}</span>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </motion.div>
    );
}
