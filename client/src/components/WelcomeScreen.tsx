import { useEffect, useState } from "react";
import { useGameState } from "@/lib/stores/useGameState";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";

export default function WelcomeScreen() {
  const { setGameScreen } = useGameState();
  const { toggleMute, isMuted } = useAudio();
  const [showTerms, setShowTerms] = useState(false);
  const [logoScale, setLogoScale] = useState(1);

  // Animate logo
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoScale(prev => prev === 1 ? 1.1 : 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStartGame = () => {
    setGameScreen('auth');
  };

  const handleViewTerms = () => {
    setShowTerms(true);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-green-800 to-green-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-green-400 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-40 w-16 h-16 bg-blue-400 rounded-full animate-ping"></div>
      </div>

      {/* Logo */}
      <div 
        className="mb-8 transition-transform duration-1000 ease-in-out"
        style={{ transform: `scale(${logoScale})` }}
      >
        <h1 className="text-6xl font-bold text-yellow-400 text-center mb-4 drop-shadow-lg">
          🏃‍♂️ JUNGLE RUN
        </h1>
        <div className="text-center">
          <span className="text-2xl animate-pulse">🧟‍♂️ ZOMBIE CHASE 🧟‍♂️</span>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-xl mb-12 text-center px-4 opacity-80">
        Escape the zombie horde in this thrilling 3D runner!
      </p>

      {/* Buttons */}
      <div className="flex flex-col gap-4 z-10">
        <Button
          onClick={handleStartGame}
          className="px-8 py-4 text-xl font-bold bg-yellow-500 hover:bg-yellow-600 text-black transition-all duration-300 transform hover:scale-105"
          size="lg"
        >
          🎮 START GAME
        </Button>
        
        <Button
          onClick={handleViewTerms}
          variant="outline"
          className="px-8 py-2 text-white border-white hover:bg-white hover:text-green-900 transition-all duration-300"
        >
          📋 View Terms & Conditions
        </Button>
        
        <Button
          onClick={toggleMute}
          variant="ghost"
          className="px-4 py-2 text-white hover:bg-white hover:text-green-900 transition-all duration-300"
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </Button>
      </div>

      {/* Terms Modal */}
      <Modal isOpen={showTerms} onClose={() => setShowTerms(false)}>
        <div className="p-6 max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-black">Terms & Conditions</h2>
          <div className="text-gray-700 space-y-3">
            <p>Welcome to Jungle Run - Zombie Chase!</p>
            <p>By playing this game, you agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Play at your own risk</li>
              <li>Have fun and enjoy the zombie chase</li>
              <li>Collect as many gems as possible</li>
              <li>Try to escape the traps</li>
              <li>Beat all the levels if you can!</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              This is a demo game created for entertainment purposes.
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setShowTerms(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
