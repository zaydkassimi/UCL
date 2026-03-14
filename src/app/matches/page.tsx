'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { getAllMatches, getStandings, Match, Standing } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import { Trophy, Calendar, AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'ALL' | 'LIVE' | 'UPCOMING' | 'FT';

const STAGE_ORDER = ['League Phase', 'Group Stage', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];

export default function MatchesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'League Phase': true,
    'Group Stage': true
  });
  const [showAllLeagueMatches, setShowAllLeagueMatches] = useState(false);
  
  const { data: matches, error: matchesError, isLoading: loadingMatches } = useSWR('all-matches', getAllMatches, {
    refreshInterval: 60000,
  });

  const { data: standings, error: standingsError } = useSWR('standings', getStandings, {
    refreshInterval: 300000,
  });

  // Effect to expand current section on load (preserving defaults)
  React.useEffect(() => {
    if (matches && Object.keys(expandedSections).length <= 2) {
      const liveOrUpcoming = matches.find(m => m.status === 'LIVE' || m.status === 'UPCOMING');
      if (liveOrUpcoming && !['League Phase', 'Group Stage'].includes(liveOrUpcoming.stage)) {
        setExpandedSections(prev => ({ ...prev, [liveOrUpcoming.stage]: true }));
      }
    }
  }, [matches]);

  const toggleSection = (stage: string) => {
    setExpandedSections(prev => ({ ...prev, [stage]: !prev[stage] }));
  };

  const sortMatches = (matchesList: Match[]) => {
    return [...matchesList].sort((a, b) => {
        // 1. LIVE first
        if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
        if (a.status !== 'LIVE' && b.status === 'LIVE') return 1;

        // 2. By status
        if (a.status === 'UPCOMING' && b.status === 'FT') return -1;
        if (a.status === 'FT' && b.status === 'UPCOMING') return 1;

        // 3. By date within same status
        const dateA = new Date(a.utcDate).getTime();
        const dateB = new Date(b.utcDate).getTime();
        
        if (a.status === 'UPCOMING') return dateA - dateB; // Soonest first
        return dateB - dateA; // Most recent first for finished
    });
  };

  const groupMatchesByStage = (matchesList: Match[]) => {
    const groups: Record<string, Match[]> = {};
    matchesList.forEach(match => {
      // 1. Filter out TBD/Winner of matches
      if (
        !match.homeTeam.name || match.homeTeam.name.includes('Winner') || 
        !match.awayTeam.name || match.awayTeam.name.includes('Winner')
      ) {
        return;
      }

      const stage = match.stage;
      if (!groups[stage]) groups[stage] = [];
      groups[stage].push(match);
    });
    return groups;
  };
  
  const filteredMatches = matches?.filter((match: Match) => {
    if (activeFilter === 'ALL') return true;
    return match.status === activeFilter;
  });

  const groupedMatches = filteredMatches ? groupMatchesByStage(filteredMatches) : {};

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All Matches', value: 'ALL' },
    { label: 'Live Now', value: 'LIVE' },
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Finished', value: 'FT' },
  ];

  if (loadingMatches) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-40 bg-white/5 rounded-xl animate-pulse border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (matchesError) {
    return (
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
            <AlertCircle className="text-gray-600 mb-4" size={48} />
            <h2 className="text-2xl font-black uppercase tracking-widest text-gray-500">Data unavailable</h2>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-4 justify-center">
           <Calendar className="text-gold" size={16} />
           <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">UEFA Champions League 2025/26</span>
        </motion.div>
        
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 italic">
          Match <span className="text-gold stroke-text-gold">Center</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-2 mt-8">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={cn(
                        "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                        activeFilter === filter.value
                            ? "bg-gold border-gold text-[#0a0e1a] shadow-[0_0_20px_rgba(201,168,76,0.2)]"
                            : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10"
                    )}
                >
                    {filter.label}
                </button>
            ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {STAGE_ORDER.map((stage) => {
          const stageMatches = groupedMatches[stage];
          if (!stageMatches || stageMatches.length === 0) return null;

          const isExpanded = expandedSections[stage] || false;
          let sortedMatches = sortMatches(stageMatches);
          const totalMatches = sortedMatches.length;
          
          const isLeaguePhase = stage === 'League Phase';
          const displayedMatches = (isLeaguePhase && !showAllLeagueMatches && totalMatches > 12) 
            ? sortedMatches.slice(0, 12) 
            : sortedMatches;

          return (
            <section key={stage} className="space-y-6" id={(stage === 'League Phase' || stage === 'Group Stage') ? 'group-stage' : undefined}>
              <button 
                onClick={() => toggleSection(stage)}
                className="w-full flex items-center justify-between py-4 border-b border-white/5 group transition-colors hover:border-gold/30"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center transition-transform",
                    isExpanded ? "rotate-180" : ""
                  )}>
                    <ChevronDown size={18} className="text-gold" />
                  </div>
                  <div className="flex flex-col items-start translate-y-1">
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                         {stage}
                         <span className="text-[10px] not-italic font-black text-gray-500 tracking-widest bg-white/5 px-2 py-0.5 rounded ml-2">
                            {totalMatches} {totalMatches === 1 ? 'Match' : 'Matches'}
                         </span>
                    </h2>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {stage === 'Group Stage' ? (
                       <div className="space-y-12 py-8">
                          {['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H'].map(groupName => {
                            const groupMatches = sortedMatches.filter(m => m.group === groupName.toUpperCase().replace(' ', '_'));
                            if (groupMatches.length === 0) return null;

                            const groupStanding = standings?.find(s => s.group === groupName.toUpperCase().replace(' ', '_'));

                            return (
                                <div key={groupName} className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-0.5 bg-gold/20 flex-1" />
                                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gold">{groupName}</h3>
                                        <div className="h-0.5 bg-gold/20 flex-1" />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {groupMatches.map(match => (
                                            <MatchCard key={match.id} match={match} />
                                        ))}
                                    </div>

                                    {groupStanding && (
                                        <div className="bg-[#121829]/50 border border-white/5 rounded-2xl p-4 overflow-x-auto">
                                            <table className="w-full text-[10px] font-bold uppercase tracking-wider text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-white/5 text-gray-500">
                                                        <th className="py-2 w-8">#</th>
                                                        <th className="py-2">Team</th>
                                                        <th className="py-2 text-center">P</th>
                                                        <th className="py-2 text-center">W</th>
                                                        <th className="py-2 text-center">D</th>
                                                        <th className="py-2 text-center">L</th>
                                                        <th className="py-2 text-center">GD</th>
                                                        <th className="py-2 text-right">Pts</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {groupStanding.table.slice(0, 4).map((row) => (
                                                        <tr key={row.team.id} className="border-b last:border-0 border-white/5 hover:bg-white/5 transition-colors">
                                                            <td className="py-2.5">{row.position}</td>
                                                            <td className="py-2.5 flex items-center gap-2">
                                                                <img src={row.team.crest} alt="" className="w-4 h-4 object-contain" />
                                                                <span className="truncate max-w-[100px]">{row.team.name}</span>
                                                            </td>
                                                            <td className="py-2.5 text-center">{row.playedGames}</td>
                                                            <td className="py-2.5 text-center">{row.won}</td>
                                                            <td className="py-2.5 text-center">{row.draw}</td>
                                                            <td className="py-2.5 text-center">{row.lost}</td>
                                                            <td className="py-2.5 text-center">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                                                            <td className="py-2.5 text-right font-black text-gold">{row.points}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            );
                          })}
                       </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
                          {displayedMatches.map(match => (
                            <MatchCard key={match.id} match={match} />
                          ))}
                        </div>
                        
                        {isLeaguePhase && totalMatches > 12 && (
                          <div className="flex justify-center pb-8">
                            <button
                              onClick={() => setShowAllLeagueMatches(!showAllLeagueMatches)}
                              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-gold transition-all"
                            >
                              {showAllLeagueMatches ? 'Show Less' : `Show All (${totalMatches} matches)`}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
    </div>
  );
}
