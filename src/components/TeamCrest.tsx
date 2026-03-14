import React from 'react';

interface TeamCrestProps {
  name: string;
  crest?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TeamCrest: React.FC<TeamCrestProps> = ({ name, crest, size = 'md', className }) => {
  const initials = (name ?? '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-xl',
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-inner overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {crest ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={crest} 
          alt={name} 
          className="w-[70%] h-[70%] object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span className="font-bold text-gray-400 select-none uppercase">{initials}</span>
      )}
      
      {/* Decorative star shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
};

export default TeamCrest;
