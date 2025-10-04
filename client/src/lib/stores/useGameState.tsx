import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getLocalStorage, setLocalStorage } from "@/lib/utils";

export type GameScreen = 
  | "welcome" 
  | "auth" 
  | "tutorial" 
  | "playing" 
  | "trapped" 
  | "levelComplete" 
  | "gameOver";

interface Position {
  x: number;
  y: number;
  z: number;
}

interface GameState {
  // Game flow
  gameScreen: GameScreen;
  setGameScreen: (screen: GameScreen) => void;
  
  // Player info
  playerName: string;
  setPlayerName: (name: string) => void;
  
  // Game state
  currentLevel: number;
  gems: number;
  score: number;
  levelStartTime: number;
  
  // Player state
  playerPosition: Position;
  setPlayerPosition: (position: Position) => void;
  isJumping: boolean;
  setIsJumping: (jumping: boolean) => void;
  isSliding: boolean;
  setIsSliding: (sliding: boolean) => void;
  
  // Zombie state
  zombiePosition: Position;
  setZombiePosition: (position: Position) => void;
  
  // Game mechanics
  playerSpeed: number;
  zombieSpeed: number;
  
  // Actions
  addGem: (points: number) => void;
  collectGem: () => void;
  nextLevel: () => void;
  restartLevel: () => void;
  resetGame: () => void;
  
  // Save/Load
  saveGame: () => void;
  loadGame: () => void;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Game flow
    gameScreen: "welcome",
    setGameScreen: (screen) => set({ gameScreen: screen }),
    
    // Player info
    playerName: "Player",
    setPlayerName: (name) => {
      set({ playerName: name });
      get().saveGame();
    },
    
    // Game state
    currentLevel: 1,
    gems: 0,
    score: 0,
    levelStartTime: Date.now(),
    
    // Player state
    playerPosition: { x: 0, y: 1, z: 0 },
    setPlayerPosition: (position) => set({ playerPosition: position }),
    isJumping: false,
    setIsJumping: (jumping) => set({ isJumping: jumping }),
    isSliding: false,
    setIsSliding: (sliding) => set({ isSliding: sliding }),
    
    // Zombie state
    zombiePosition: { x: 0, y: 1, z: 25 },
    setZombiePosition: (position) => set({ zombiePosition: position }),
    
    // Game mechanics
    playerSpeed: 12,
    zombieSpeed: 8,
    
    // Actions
    addGem: (points) => {
      set((state) => ({ 
        gems: state.gems + 1,
        score: state.score + points 
      }));
      get().saveGame();
    },
    
    collectGem: () => {
      // Sound and visual feedback handled in Gems component
    },
    
    nextLevel: () => {
      set((state) => {
        const newLevel = state.currentLevel + 1;
        return {
          currentLevel: newLevel,
          gameScreen: "playing",
          levelStartTime: Date.now(),
          playerPosition: { x: 0, y: 1, z: 0 },
          zombiePosition: { x: 0, y: 1, z: 25 },
          playerSpeed: Math.min(12 + newLevel * 0.5, 20),
          zombieSpeed: Math.min(8 + newLevel * 0.5, 16),
          isJumping: false,
          isSliding: false
        };
      });
      get().saveGame();
    },
    
    restartLevel: () => {
      set({
        gameScreen: "playing",
        levelStartTime: Date.now(),
        playerPosition: { x: 0, y: 1, z: 0 },
        zombiePosition: { x: 0, y: 1, z: 25 },
        isJumping: false,
        isSliding: false
      });
    },
    
    resetGame: () => {
      set({
        gameScreen: "welcome",
        currentLevel: 1,
        gems: 0,
        score: 0,
        levelStartTime: Date.now(),
        playerPosition: { x: 0, y: 1, z: 0 },
        zombiePosition: { x: 0, y: 1, z: 25 },
        playerSpeed: 12,
        zombieSpeed: 8,
        isJumping: false,
        isSliding: false
      });
      get().saveGame();
    },
    
    // Save/Load
    saveGame: () => {
      const state = get();
      const saveData = {
        playerName: state.playerName,
        currentLevel: state.currentLevel,
        gems: state.gems,
        score: state.score
      };
      setLocalStorage("jungleRunSave", saveData);
    },
    
    loadGame: () => {
      const saveData = getLocalStorage("jungleRunSave");
      if (saveData) {
        set({
          playerName: saveData.playerName || "Player",
          currentLevel: saveData.currentLevel || 1,
          gems: saveData.gems || 0,
          score: saveData.score || 0
        });
      }
    }
  }))
);

// Auto-save on important state changes
useGameState.subscribe(
  (state) => state.currentLevel,
  () => useGameState.getState().saveGame()
);

useGameState.subscribe(
  (state) => state.gems,
  () => useGameState.getState().saveGame()
);

// Load game on initialization
setTimeout(() => {
  useGameState.getState().loadGame();
}, 100);
