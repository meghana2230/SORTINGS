import React, { useState, useEffect } from 'react';
import {
  Menu,
  Volume2,
  VolumeX,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react';
import { TabType, UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';
import { ThemeMode, applyTheme, getInitialTheme } from '../../services/theme';
import { AlgoLearnLogo } from '../common/AlgoLearnLogo';

interface HeaderProps {
  currentTab: TabType;
  progress: UserProgress;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onResetProgress: () => void;
  onSelectTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  progress,
  isSidebarOpen,
  onToggleSidebar,
  onResetProgress,
  onSelectTab,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundEffects.getMuted());
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleToggleSound = () => {
    const nextState = soundEffects.toggleMute();
    setIsMuted(nextState);
  };

  const handleToggleTheme = () => {
    soundEffects.playClick();
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const isDark = theme === 'dark';

  return (
    <header className="shrink-0 sticky top-0 z-30 min-h-[64px] sm:min-h-[72px] bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 transition-colors shadow-2xs">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Toggle Navigation Hamburger Button (Shown only when navigation bar is closed) */}
        {!isSidebarOpen && (
          <button
            id="nav-toggle-btn"
            onClick={() => {
              soundEffects.playClick();
              onToggleSidebar();
            }}
            className="p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors flex items-center justify-center shrink-0 active:scale-95"
            title="Open Navigation Menu (Ctrl+B)"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}

        {/* AlgoLearn Brand Logo (click to jump to overview) */}
        <div className="flex items-center">
          <AlgoLearnLogo
            size="sm"
            showSubtitle={true}
            onClick={() => {
              soundEffects.playClick();
              onSelectTab('home');
            }}
          />
        </div>
      </div>

      {/* Right Action Widgets */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Theme Toggle: [ ☀️ ] / [ 🌙 ] */}
        <button
          onClick={handleToggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 shrink-0"
        >
          {isDark ? (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 stroke-[2.2]" />
          ) : (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 stroke-[2.2]" />
          )}
        </button>

        {/* Audio Toggle: [ 🔊 ] / [ 🔇 ] */}
        <button
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute SFX' : 'Mute SFX'}
          aria-label={isMuted ? 'Unmute SFX' : 'Mute SFX'}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 shrink-0"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          ) : (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 stroke-[2.2]" />
          )}
        </button>

        {/* Reset Progress: [ ↺ ] */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onResetProgress();
          }}
          title="Total Reset"
          aria-label="Total Reset"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-all flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-300 stroke-[2.2]" />
        </button>
      </div>
    </header>
  );
};
