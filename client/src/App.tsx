import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useGameState } from "./lib/stores/useGameState";
import WelcomeScreen from "./components/WelcomeScreen";
import AuthScreen from "./components/AuthScreen";
import TutorialScreen from "./components/TutorialScreen";
import GameScene from "./components/GameScene";
import GameUI from "./components/GameUI";
import TrapMiniGame from "./components/TrapMiniGame";
import "@fontsource/inter";

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "left", keys: ["KeyA", "ArrowLeft"] },
  { name: "right", keys: ["KeyD", "ArrowRight"] },
  { name: "jump", keys: ["Space"] },
  { name: "slide", keys: ["KeyC", "ControlLeft"] },
];

// Main App component
function App() {
  const { gameScreen } = useGameState();
  const { setBackgroundMusic, backgroundMusic, isMuted } = useAudio();
  const [showCanvas, setShowCanvas] = useState(false);

  // Initialize background music
  useEffect(() => {
    const music = new Audio("/sounds/background.mp3");
    music.loop = true;
    music.volume = 0.3;
    setBackgroundMusic(music);
  }, [setBackgroundMusic]);

  // Handle background music playback
  useEffect(() => {
    if (backgroundMusic) {
      if (!isMuted && (gameScreen === 'welcome' || gameScreen === 'playing')) {
        backgroundMusic.play().catch(console.log);
      } else {
        backgroundMusic.pause();
      }
    }
  }, [backgroundMusic, isMuted, gameScreen]);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  if (!showCanvas) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-gray-900">
      <KeyboardControls map={controls}>
        {gameScreen === 'welcome' && <WelcomeScreen />}
        {gameScreen === 'auth' && <AuthScreen />}
        {gameScreen === 'tutorial' && <TutorialScreen />}
        
        {(gameScreen === 'playing' || gameScreen === 'levelComplete' || gameScreen === 'gameOver') && (
          <>
            <Canvas
              shadows
              camera={{
                position: [0, 5, 10],
                fov: 60,
                near: 0.1,
                far: 1000
              }}
              gl={{
                antialias: true,
                powerPreference: "high-performance"
              }}
            >
              <color attach="background" args={["#2c5530"]} />
              
              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1} 
                castShadow 
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              
              <Suspense fallback={null}>
                <GameScene />
              </Suspense>
            </Canvas>
            <GameUI />
          </>
        )}
        
        {gameScreen === 'trapped' && <TrapMiniGame />}
      </KeyboardControls>
    </div>
  );
}

export default App;
