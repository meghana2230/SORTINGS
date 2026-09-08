import React, { useState } from 'react';
import { SortGameId, UserProgress, GameStatus } from '../../types';
import { SORT_GAMES } from '../../data/sortGameData';
import { awardXP, recordGamePlay, formatPlayedTime, INITIAL_GAME_STATS } from '../../services/storage';

// Sort Master Modular Game Components
import { GameSelectionPage } from '../game/GameSelectionPage';
import { HorizontalLevelChain } from '../game/HorizontalLevelChain';
import { BubbleSortGame } from '../game/BubbleSortGame';
import { SelectionSortGame } from '../game/SelectionSortGame';
import { InsertionSortGame } from '../game/InsertionSortGame';
import { SortingBattleGame } from '../game/SortingBattleGame';
import { FixAlgorithmGame } from '../game/FixAlgorithmGame';

interface GameViewProps {
  progress: UserProgress;
  activeLevelId: number;
  onSelectLevel: (levelId: number) => void;
  onUpdateProgress: (updated: UserProgress) => void;
}

type SortViewScreen = 'hub' | 'gameplay';

export const GameView: React.FC<GameViewProps> = ({
  progress,
  onUpdateProgress,
}) => {
  // Navigation Flow:
  // 1. Initial screen: 'hub' with 5 Sorting Game Cards (Bubble, Selection, Insertion, Sorting Battle, Fix Algorithm).
  // 2. Click any card: opens that game's page directly, with the Horizontal Level Chain at top and the active level game right under it.
  // 3. Level 1 complete -> Level 2 unlocks/opens -> Level 3 -> Level 4 -> Level 5.
  const [currentScreen, setCurrentScreen] = useState<SortViewScreen>('hub');
  const [selectedGameId, setSelectedGameId] = useState<SortGameId>('bubble-sort');
  const [selectedLevelNumber, setSelectedLevelNumber] = useState<number>(1);

  // Active game metadata
  const activeGame = SORT_GAMES.find((g) => g.id === selectedGameId) || SORT_GAMES[0];
  const activeLevel =
    activeGame.levels.find((l) => l.levelNumber === selectedLevelNumber) || activeGame.levels[0];

  // Handler: user clicks one of the 5 cards on Game Selection Page
  const handleSelectGame = (gameId: SortGameId) => {
    setSelectedGameId(gameId);

    // Track that the user started/played this game
    const updated = recordGamePlay(progress, gameId);
    onUpdateProgress(updated);

    // Open the next incomplete unlocked level, or Level 1 if none or all completed
    const completed = Array.isArray(updated?.sortGameProgress?.[gameId]) ? updated.sortGameProgress[gameId] : [];
    const game = SORT_GAMES.find((g) => g.id === gameId);
    const total = game?.totalLevels || 5;
    let nextLvl = 1;
    for (let i = 1; i <= total; i++) {
      if (!completed.includes(i)) {
        nextLvl = i;
        break;
      }
    }
    setSelectedLevelNumber(nextLvl);
    setCurrentScreen('gameplay');
  };

  // Handler: level completed
  const handleCompleteLevel = (earnedXP: number, earnedScore?: number, performanceMetrics?: string) => {
    const currentCompleted = Array.isArray(progress?.sortGameProgress?.[selectedGameId])
      ? progress.sortGameProgress[selectedGameId]
      : [];
    const updatedGameCompleted = currentCompleted.includes(selectedLevelNumber)
      ? currentCompleted
      : [...currentCompleted, selectedLevelNumber];

    const newSortGameProgress = {
      ...(progress.sortGameProgress || {}),
      [selectedGameId]: updatedGameCompleted,
    };

    const isGameFullyCompleted =
      updatedGameCompleted.length >= activeGame.totalLevels || selectedLevelNumber === activeGame.totalLevels;
    const newStatus: GameStatus = isGameFullyCompleted ? 'Completed' : 'In Progress';
    const newCompletionPercentage = isGameFullyCompleted
      ? 100
      : Math.min(100, Math.round((updatedGameCompleted.length / activeGame.totalLevels) * 100));

    const existingStats = progress.gameStats?.[selectedGameId] || INITIAL_GAME_STATS[selectedGameId];
    const scoreAchieved = typeof earnedScore === 'number' && earnedScore > 0 ? earnedScore : (earnedXP * 10 || 500);
    const highestScore = Math.max(existingStats.highestScore || 0, scoreAchieved);
    const timesPlayed = Math.max(1, (existingStats.timesPlayed || 0) + 1);
    const bestPerformance = isGameFullyCompleted
      ? `100% Mastered • High Score: ${highestScore} pts`
      : performanceMetrics || `Level ${selectedLevelNumber} Mastered (${scoreAchieved} pts)`;
    const lastPlayedTime = formatPlayedTime(new Date());

    const updatedGameStats = {
      ...(progress.gameStats || INITIAL_GAME_STATS),
      [selectedGameId]: {
        status: newStatus,
        highestScore,
        timesPlayed,
        completionPercentage: newCompletionPercentage,
        bestPerformance,
        lastPlayedTime,
      },
    };

    // Calculate global completed game levels for backward compatibility
    const totalCompletedLevelsCount = (Object.values(newSortGameProgress) as number[][]).reduce(
      (acc: number, list: number[]) => acc + (Array.isArray(list) ? list.length : 0),
      0
    );

    const eventKey = `${selectedGameId}_level_${selectedLevelNumber}_award`;
    const awardResult = awardXP(
      {
        ...progress,
        sortGameProgress: newSortGameProgress,
        gameStats: updatedGameStats,
        completedGameLevels: Array.from({ length: totalCompletedLevelsCount }, (_, i: number) => i + 1),
      },
      earnedXP,
      eventKey,
      `${activeGame.title} - Level ${selectedLevelNumber} Mastered`,
      `Completed ${activeLevel.title} with high precision`
    );

    onUpdateProgress(awardResult.updated);
  };

  // Handler: Next Level button clicked in completion modal
  const handleNextLevel = () => {
    if (selectedLevelNumber < activeGame.totalLevels) {
      setSelectedLevelNumber((prev) => prev + 1);
    } else {
      setCurrentScreen('hub');
    }
  };

  return (
    <div className="w-full">
      {/* ─── SCREEN 1: 5-CARD GAME SELECTION HUB ─── */}
      {currentScreen === 'hub' && (
        <GameSelectionPage
          progress={progress}
          onSelectGame={handleSelectGame}
        />
      )}

      {/* ─── SCREEN 2: GAMEPLAY WITH LEVEL CHAINING ON TOP & GAME UNDERNEATH ─── */}
      {currentScreen === 'gameplay' && (
        <div className="space-y-4 max-w-5xl mx-auto pb-12">
          {/* Horizontal Level Chain: Level 1 ── Level 2 ── Level 3 ── Level 4 ── Level 5 */}
          <HorizontalLevelChain
            gameTitle={activeGame.title}
            totalLevels={activeGame.totalLevels}
            activeLevelNumber={selectedLevelNumber}
            completedLevels={Array.isArray(progress?.sortGameProgress?.[selectedGameId]) ? progress.sortGameProgress[selectedGameId] : []}
            onSelectLevel={(lvl) => setSelectedLevelNumber(lvl)}
            onBackToGames={() => setCurrentScreen('hub')}
          />

          {/* Active Level Game directly underneath the chain */}
          {selectedGameId === 'bubble-sort' && (
            <BubbleSortGame
              key={`${selectedGameId}-${selectedLevelNumber}`}
              level={activeLevel}
              progress={progress}
              onCompleteLevel={handleCompleteLevel}
              onBackToLevels={() => setCurrentScreen('hub')}
              onNextLevel={handleNextLevel}
            />
          )}

          {selectedGameId === 'selection-sort' && (
            <SelectionSortGame
              key={`${selectedGameId}-${selectedLevelNumber}`}
              level={activeLevel}
              progress={progress}
              onCompleteLevel={handleCompleteLevel}
              onBackToLevels={() => setCurrentScreen('hub')}
              onNextLevel={handleNextLevel}
            />
          )}

          {selectedGameId === 'insertion-sort' && (
            <InsertionSortGame
              key={`${selectedGameId}-${selectedLevelNumber}`}
              level={activeLevel}
              progress={progress}
              onCompleteLevel={handleCompleteLevel}
              onBackToLevels={() => setCurrentScreen('hub')}
              onNextLevel={handleNextLevel}
            />
          )}

          {selectedGameId === 'sorting-battle' && (
            <SortingBattleGame
              key={`${selectedGameId}-${selectedLevelNumber}`}
              level={activeLevel}
              progress={progress}
              onCompleteLevel={handleCompleteLevel}
              onBackToLevels={() => setCurrentScreen('hub')}
              onNextLevel={handleNextLevel}
            />
          )}

          {selectedGameId === 'fix-algorithm' && (
            <FixAlgorithmGame
              key={`${selectedGameId}-${selectedLevelNumber}`}
              level={activeLevel}
              progress={progress}
              onCompleteLevel={handleCompleteLevel}
              onBackToLevels={() => setCurrentScreen('hub')}
              onNextLevel={handleNextLevel}
            />
          )}
        </div>
      )}
    </div>
  );
};
