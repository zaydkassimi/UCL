'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Trophy, Calendar, Home, Menu, X } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Matches', href: '/matches', icon: Calendar },
    { name: 'Winners', href: '/winners', icon: Trophy },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-[#0a0e1a]/90 backdrop-blur-md py-3 border-white/10'
          : 'bg-transparent py-5 border-transparent'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/ucl-icon.png" 
              alt="UCL Logo" 
              width={42} 
              height={42}
              priority
              className="object-contain"
            />
            <span>
              <span className="text-white font-bold text-lg tracking-wider">CHAMPIONS </span>
              <span className="text-[#c9a84c] font-bold text-lg tracking-wider">LEAGUE</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-xs font-bold uppercase tracking-widest transition-all relative py-1',
                  isActive ? 'text-gold' : 'text-gray-400 hover:text-white'
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-[#0a0e1a] border-b border-white/10 p-4 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 py-2 text-sm font-bold uppercase tracking-widest',
                pathname === link.href ? 'text-gold' : 'text-gray-400'
              )}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
