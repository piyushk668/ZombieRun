import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/lib/stores/useGameState";

export default function TutorialScreen() {
  const { setGameScreen } = useGameState();
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Movement Controls",
      content: "Use A/D or ← → to move left and right",
      icon: "↔️",
      keys: ["A", "D", "←", "→"]
    },
    {
      title: "Jump",
      content: "Press SPACE to jump over obstacles",
      icon: "⬆️",
      keys: ["SPACE"]
    },
    {
      title: "Slide",
      content: "Press C or CTRL to slide under barriers",
      icon: "⬇️",
      keys: ["C", "CTRL"]
    },
    {
      title: "Collect Gems",
      content: "Run through gems to collect them and increase your score",
      icon: "💎",
      keys: []
    },
    {
      title: "Avoid the Zombie",
      content: "The zombie is chasing you! Don't let it catch you!",
      icon: "🧟‍♂️",
      keys: []
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStartRun = () => {
    setGameScreen('playing');
  };

  const handleBack = () => {
    setGameScreen('auth');
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-800 to-purple-900 text-white">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-lg w-full mx-4">
        <h1 className="text-3xl font-bold text-center mb-2">Quick Tutorial</h1>
        <p className="text-center mb-8 opacity-80">Learn the controls to survive!</p>

        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-6xl mb-2">{currentTutorial.icon}</div>
            <h2 className="text-2xl font-bold">{currentTutorial.title}</h2>
          </div>
          
          <p className="text-lg text-center mb-4">{currentTutorial.content}</p>
          
          {currentTutorial.keys.length > 0 && (
            <div className="flex justify-center gap-2 flex-wrap">
              {currentTutorial.keys.map((key, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 rounded-md font-mono text-sm"
                >
                  {key}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentStep ? 'bg-yellow-400' : 
                  index < currentStep ? 'bg-green-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-purple-900 disabled:opacity-50"
          >
            ← Previous
          </Button>

          <span className="text-sm opacity-60">
            {currentStep + 1} of {tutorialSteps.length}
          </span>

          {currentStep < tutorialSteps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              Next →
            </Button>
          ) : (
            <Button
              onClick={handleStartRun}
              className="bg-green-500 hover:bg-green-600 text-white font-bold"
            >
              🏃‍♂️ Start Run!
            </Button>
          )}
        </div>

        <div className="mt-6 text-center flex justify-center gap-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-white hover:bg-white/10 transition-all duration-300"
          >
            ← Back to Login
          </Button>
          <Button
            onClick={handleStartRun}
            variant="ghost"
            className="text-yellow-400 hover:bg-white/10 transition-all duration-300 font-bold"
          >
            Skip Tutorial →
          </Button>
        </div>
      </div>
    </div>
  );
}
