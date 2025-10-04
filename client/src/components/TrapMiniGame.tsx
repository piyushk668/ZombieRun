import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/lib/stores/useGameState";

export default function TrapMiniGame() {
  const { setGameScreen } = useGameState();
  const [timeLeft, setTimeLeft] = useState(60);
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [showSequence, setShowSequence] = useState(true);

  const buttons = ['🔴', '🟢', '🔵', '🟡'];

  // Generate random sequence
  useEffect(() => {
    const newSequence = Array.from({ length: 6 }, () => 
      buttons[Math.floor(Math.random() * buttons.length)]
    );
    setSequence(newSequence);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          setGameScreen('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft, setGameScreen]);

  // Hide sequence after showing it
  useEffect(() => {
    if (showSequence) {
      const timer = setTimeout(() => {
        setShowSequence(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSequence]);

  const handleButtonClick = useCallback((button: string) => {
    if (!gameActive || showSequence) return;

    const newPlayerSequence = [...playerSequence, button];
    setPlayerSequence(newPlayerSequence);

    // Check if correct button
    if (button === sequence[currentIndex]) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);

      // Check if sequence completed
      if (newIndex >= sequence.length) {
        setGameActive(false);
        setGameScreen('playing'); // Escape successful!
      }
    } else {
      // Wrong button - game over
      setGameActive(false);
      setGameScreen('gameOver');
    }
  }, [gameActive, showSequence, playerSequence, currentIndex, sequence, setGameScreen]);

  const progressPercentage = (currentIndex / sequence.length) * 100;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">
          TRAPPED!
        </h1>
        <p className="text-gray-600 mb-4">
          Follow the sequence to escape the trap!
        </p>

        {/* Timer */}
        <div className="bg-red-100 rounded-lg p-3 mb-4">
          <div className="text-sm text-red-600 mb-1">Time Remaining</div>
          <div className="text-3xl font-bold text-red-700">
            {timeLeft}s
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-sm text-gray-600">
            Progress: {currentIndex}/{sequence.length}
          </div>
        </div>

        {/* Sequence Display */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">
            {showSequence ? "Memorize the sequence:" : "Enter the sequence:"}
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {sequence.map((button, index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 ${
                  showSequence 
                    ? 'bg-gray-100 border-gray-300' 
                    : index < currentIndex
                    ? 'bg-green-100 border-green-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {showSequence || index < currentIndex ? button : '?'}
              </div>
            ))}
          </div>
        </div>

        {/* Input Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {buttons.map((button) => (
            <Button
              key={button}
              onClick={() => handleButtonClick(button)}
              disabled={!gameActive || showSequence}
              className="h-16 text-3xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95"
              variant={showSequence ? "secondary" : "default"}
            >
              {button}
            </Button>
          ))}
        </div>

        {/* Status */}
        {showSequence && (
          <div className="text-yellow-600 font-bold animate-pulse">
            Get ready to input the sequence...
          </div>
        )}

        {!showSequence && gameActive && (
          <div className="text-blue-600 font-bold">
            Click the buttons in order!
          </div>
        )}
      </div>
    </div>
  );
}
