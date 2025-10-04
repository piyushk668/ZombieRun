import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "@/lib/stores/useGameState";
import { useAudio } from "@/lib/stores/useAudio";
import { checkCollision } from "@/lib/gameUtils";

interface Gem {
  id: string;
  position: { x: number; y: number; z: number };
  collected: boolean;
  rotationSpeed: number;
}

export default function Gems() {
  const groupRef = useRef<THREE.Group>(null);
  const { 
    playerPosition, 
    gameScreen, 
    gems,
    addGem,
    collectGem,
    currentLevel
  } = useGameState();
  const { playSuccess } = useAudio();
  const collectedGems = useRef<Set<string>>(new Set());

  // Generate gems - regenerate when level changes
  const gemList = useMemo(() => {
    // Reset collected gems when level changes
    collectedGems.current = new Set();
    
    const newGems: Gem[] = [];
    const gemCount = 100;
    const startZ = -20;
    const spacing = 8;

    for (let i = 0; i < gemCount; i++) {
      const z = startZ - (i * spacing) - Math.random() * 5;
      const lanes = [-3, 0, 3];
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      
      // Random chance to spawn gem
      if (Math.random() < 0.6) {
        newGems.push({
          id: `gem-${currentLevel}-${i}`,
          position: { 
            x: lane + (Math.random() - 0.5) * 2, 
            y: 1.5 + Math.random() * 2, 
            z 
          },
          collected: false,
          rotationSpeed: 1 + Math.random() * 2
        });
      }
    }
    
    return newGems;
  }, [currentLevel]);

  // Collision detection and gem rotation
  useFrame((state) => {
    if (gameScreen !== 'playing' || !groupRef.current) return;

    groupRef.current.children.forEach((gemMesh, index) => {
      const gem = gemList[index];
      if (!gem) return;
      
      // Skip if already collected
      if (collectedGems.current.has(gem.id)) {
        gemMesh.visible = false;
        return;
      }

      // Rotate gem
      gemMesh.rotation.y += gem.rotationSpeed * state.clock.getDelta();
      gemMesh.rotation.x += gem.rotationSpeed * 0.5 * state.clock.getDelta();

      // Check collision with player
      const collision = checkCollision(
        playerPosition,
        { x: 1.5, y: 2, z: 1.5 }, // Player size
        gem.position,
        { width: 1, height: 1, depth: 1 } // Gem size
      );

      if (collision) {
        // Mark as collected
        collectedGems.current.add(gem.id);
        collectGem();
        addGem(10); // Add 10 points per gem
        playSuccess();
        
        // Hide collected gem
        gemMesh.visible = false;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {gemList.map((gem) => (
        <mesh
          key={gem.id}
          position={[gem.position.x, gem.position.y, gem.position.z]}
        >
          <octahedronGeometry args={[0.5]} />
          <meshLambertMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}
