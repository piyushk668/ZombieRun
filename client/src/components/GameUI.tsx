import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/lib/stores/useGameState";
import { useAudio } from "@/lib/stores/useAudio";

export default function GameUI() {
  const { 
    gameScreen, 
    gems, 
    score, 
    currentLevel, 
    setGameScreen, 
    nextLevel, 
    restartLevel,
    playerName,
    levelStartTime
  } = useGameState();
  const { toggleMute, isMuted } = useAudio();
  
  const [countdown, setCountdown] = useState(0);
  const [levelTime, setLevelTime] = useState(0);

  // Handle countdown before level starts
  useEffect(() => {
    if (gameScreen === 'playing' && countdown === 0) {
      setCountdown(3);
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [gameScreen, countdown]);

  // Track level time
  useEffect(() => {
    if (gameScreen === 'playing' && countdown === 0) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        setLevelTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameScreen, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Countdown overlay
  if (countdown > 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="text-white text-center">
          <div className="text-8xl font-bold mb-4 animate-pulse">
            {countdown}
          </div>
          <div className="text-2xl">
            Get Ready!
          </div>
        </div>
      </div>
    );
  }

  // Playing UI
  if (gameScreen === 'playing') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Top UI */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto flex-wrap gap-2">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="text-sm opacity-80">Level {currentLevel}</div>
            <div className="text-lg font-bold">{playerName}</div>
          </div>
          
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-center">
            <div className="text-sm opacity-80">Score</div>
            <div className="text-lg font-bold text-blue-400">{score}</div>
          </div>
          
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-center">
            <div className="text-sm opacity-80">Time</div>
            <div className="text-lg font-bold">{formatTime(levelTime)}</div>
          </div>
          
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-center">
            <div className="text-sm opacity-80">Gems</div>
            <div className="text-lg font-bold text-yellow-400">💎 {gems}</div>
          </div>
        </div>

        {/* Sound toggle */}
        <div className="absolute top-4 right-4 pointer-events-auto">
          <Button
            onClick={toggleMute}
            variant="ghost"
            className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
          >
            {isMuted ? '🔇' : '🔊'}
          </Button>
        </div>

        {/* Controls hint */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-center">
            <div className="text-sm opacity-80 mb-1">Controls</div>
            <div className="flex gap-2 text-xs">
              <span>A/D: Move</span>
              <span>SPACE: Jump</span>
              <span>C: Slide</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Level Complete
  if (gameScreen === 'levelComplete') {
    const completionTime = Math.floor((Date.now() - levelStartTime) / 1000);
    
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Level {currentLevel} Complete!
          </h1>
          
          <div className="space-y-3 mb-6 text-gray-700">
            <div className="flex justify-between">
              <span>Gems Collected:</span>
              <span className="font-bold text-yellow-600">💎 {gems}</span>
            </div>
            <div className="flex justify-between">
              <span>Time Taken:</span>
              <span className="font-bold">{formatTime(completionTime)}</span>
            </div>
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="font-bold text-blue-600">{score}</span>
            </div>
          </div>

          <Button
            onClick={nextLevel}
            className="w-full py-3 text-lg font-bold bg-green-500 hover:bg-green-600 text-white"
          >
            🚀 Start Next Level
          </Button>
        </div>
      </div>
    );
  }

  // Game Over
  if (gameScreen === 'gameOver') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">💀</div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Game Over!
          </h1>
          
          <p className="text-gray-600 mb-6">
            The zombie caught you! Better luck next time.
          </p>
          
          <div className="space-y-3 mb-6 text-gray-700">
            <div className="flex justify-between">
              <span>Final Score:</span>
              <span className="font-bold text-blue-600">{score}</span>
            </div>
            <div className="flex justify-between">
              <span>Gems:</span>
              <span className="font-bold text-yellow-600">💎 {gems}</span>
            </div>
            <div className="flex justify-between">
              <span>Level Reached:</span>
              <span className="font-bold">{currentLevel}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={restartLevel}
              className="flex-1 py-3 font-bold bg-blue-500 hover:bg-blue-600 text-white"
            >
              🔄 Restart Level
            </Button>
            {gems >= 50 && (
              <Button
                onClick={() => {
                  // This feature would spend gems and continue
                  // For now, just restart the level
                  restartLevel();
                }}
                variant="outline"
                className="flex-1 py-3 font-bold border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                💎 Continue (50 gems)
              </Button>
            )}
          </div>
          
          <div className="mt-4">
            <Button
              onClick={() => setGameScreen('welcome')}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
