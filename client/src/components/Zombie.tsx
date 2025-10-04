import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameState } from "@/lib/stores/useGameState";

export default function Zombie() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { 
    playerPosition, 
    zombiePosition, 
    setZombiePosition, 
    gameScreen, 
    zombieSpeed,
    setGameScreen,
    currentLevel 
  } = useGameState();

  // Zombie AI and movement
  useFrame((state, delta) => {
    if (gameScreen !== 'playing' || !meshRef.current) return;

    const mesh = meshRef.current;
    let newX = zombiePosition.x;
    let newY = zombiePosition.y;
    let newZ = zombiePosition.z;

    // Follow player with some delay and intelligence
    const targetX = playerPosition.x;
    const targetZ = playerPosition.z + 20; // Stay behind player

    // Smooth following movement
    const followSpeed = zombieSpeed + (currentLevel * 0.5); // Increases with level
    const lerpFactor = followSpeed * delta;

    newX = THREE.MathUtils.lerp(newX, targetX, lerpFactor * 0.5);
    newZ = THREE.MathUtils.lerp(newZ, targetZ, lerpFactor);
    newY = 1; // Keep zombie on ground

    // Check if zombie caught player
    const distance = Math.sqrt(
      Math.pow(playerPosition.x - newX, 2) + 
      Math.pow(playerPosition.z - newZ, 2)
    );

    if (distance < 2) {
      setGameScreen('gameOver');
    }

    // Update position
    const newPosition = { x: newX, y: newY, z: newZ };
    setZombiePosition(newPosition);
    mesh.position.set(newX, newY, newZ);

    // Make zombie look menacing - rotate slightly
    mesh.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
  });

  // Initialize zombie position
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(zombiePosition.x, zombiePosition.y, zombiePosition.z);
    }
  }, [zombiePosition]);

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1.8, 2.2, 1.8]} />
        <meshLambertMaterial color="#8b5cf6" />
      </mesh>
      {/* Add some scary features */}
      <mesh position={[zombiePosition.x, zombiePosition.y + 1, zombiePosition.z - 0.5]}>
        <boxGeometry args={[0.3, 0.3, 0.1]} />
        <meshLambertMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}
