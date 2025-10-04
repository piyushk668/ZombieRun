import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "@/lib/stores/useGameState";
import { checkCollision } from "@/lib/gameUtils";

interface Obstacle {
  id: string;
  type: 'spike' | 'barrier' | 'trap';
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
}

export default function Obstacles() {
  const groupRef = useRef<THREE.Group>(null);
  const { 
    playerPosition, 
    gameScreen, 
    currentLevel,
    setGameScreen,
    isJumping,
    isSliding
  } = useGameState();

  // Generate obstacles based on level
  const obstacles = useMemo(() => {
    const obstacleList: Obstacle[] = [];
    const obstacleCount = Math.min(50 + currentLevel * 10, 100);
    const startZ = -50;
    const spacing = 15;

    for (let i = 0; i < obstacleCount; i++) {
      const z = startZ - (i * spacing) - Math.random() * 10;
      const lanes = [-3, 0, 3]; // Three lanes
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      
      // More frequent obstacles at higher levels
      if (Math.random() < 0.3 + currentLevel * 0.1) {
        const obstacleTypes = ['spike', 'barrier', 'trap'] as const;
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        
        let obstacle: Obstacle;
        
        switch (type) {
          case 'spike':
            obstacle = {
              id: `spike-${i}`,
              type: 'spike',
              position: { x: lane, y: 0.5, z },
              size: { width: 2, height: 1, depth: 2 }
            };
            break;
          case 'barrier':
            obstacle = {
              id: `barrier-${i}`,
              type: 'barrier',
              position: { x: lane, y: 2.5, z },
              size: { width: 3, height: 2, depth: 1 }
            };
            break;
          case 'trap':
            obstacle = {
              id: `trap-${i}`,
              type: 'trap',
              position: { x: lane, y: -0.3, z },
              size: { width: 3, height: 0.5, depth: 3 }
            };
            break;
        }
        
        obstacleList.push(obstacle);
      }
    }
    
    return obstacleList;
  }, [currentLevel]);

  // Collision detection
  useFrame(() => {
    if (gameScreen !== 'playing') return;

    obstacles.forEach((obstacle) => {
      const collision = checkCollision(
        playerPosition,
        { x: 1.5, y: 2, z: 1.5 }, // Player size
        obstacle.position,
        obstacle.size
      );

      if (collision) {
        switch (obstacle.type) {
          case 'spike':
            if (!isJumping) {
              setGameScreen('gameOver');
            }
            break;
          case 'barrier':
            if (!isSliding) {
              setGameScreen('gameOver');
            }
            break;
          case 'trap':
            setGameScreen('trapped');
            break;
        }
      }
    });
  });

  const getObstacleColor = (type: string) => {
    switch (type) {
      case 'spike': return '#ef4444';
      case 'barrier': return '#f97316';
      case 'trap': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <group ref={groupRef}>
      {obstacles.map((obstacle) => (
        <mesh
          key={obstacle.id}
          position={[obstacle.position.x, obstacle.position.y, obstacle.position.z]}
          castShadow
        >
          <boxGeometry args={[obstacle.size.width, obstacle.size.height, obstacle.size.depth]} />
          <meshLambertMaterial color={getObstacleColor(obstacle.type)} />
        </mesh>
      ))}
    </group>
  );
}
