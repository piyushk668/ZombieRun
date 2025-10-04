import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useGameState } from "@/lib/stores/useGameState";

export default function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { 
    playerPosition, 
    setPlayerPosition, 
    gameScreen, 
    playerSpeed,
    isJumping,
    setIsJumping,
    isSliding,
    setIsSliding 
  } = useGameState();

  const [, getKeys] = useKeyboardControls();

  // Player movement and physics
  useFrame((state, delta) => {
    if (gameScreen !== 'playing' || !meshRef.current) return;

    const keys = getKeys();
    const mesh = meshRef.current;
    
    // Get current position
    const currentPos = playerPosition;
    let newX = currentPos.x;
    let newY = currentPos.y;
    let newZ = currentPos.z;

    // Horizontal movement (left/right)
    const moveSpeed = 15;
    if (keys.left && newX > -4) {
      newX -= moveSpeed * delta;
    }
    if (keys.right && newX < 4) {
      newX += moveSpeed * delta;
    }

    // Forward movement (continuous)
    newZ -= playerSpeed * delta;

    // Jump mechanics
    if (keys.jump && !isJumping && !isSliding) {
      setIsJumping(true);
    }

    // Slide mechanics
    if (keys.slide && !isSliding && !isJumping) {
      setIsSliding(true);
    }

    // Handle jumping physics
    if (isJumping) {
      const jumpHeight = 6;
      const jumpTime = 0.8;
      const jumpSpeed = (jumpHeight * 2) / jumpTime;
      
      newY += jumpSpeed * delta;
      if (newY >= jumpHeight) {
        newY = jumpHeight;
        // Start falling
        const fallSpeed = jumpSpeed;
        newY -= fallSpeed * delta;
      }
      
      if (newY <= 1) {
        newY = 1;
        setIsJumping(false);
      }
    } else if (!isSliding) {
      newY = 1; // Ground level
    }

    // Handle sliding physics
    if (isSliding) {
      newY = 0.3; // Lower position
      // Slide duration
      setTimeout(() => setIsSliding(false), 600);
    }

    // Update position
    const newPosition = { x: newX, y: newY, z: newZ };
    setPlayerPosition(newPosition);
    
    // Update mesh position
    mesh.position.set(newX, newY, newZ);
    
    // Update camera to follow player
    state.camera.position.x = newX;
    state.camera.position.z = newZ + 10;
    state.camera.lookAt(newX, newY, newZ);
  });

  // Initialize player position
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(playerPosition.x, playerPosition.y, playerPosition.z);
    }
  }, [playerPosition]);

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={isSliding ? [1.5, 0.5, 1.5] : [1.5, 2, 1.5]} />
      <meshLambertMaterial color="#4ade80" />
    </mesh>
  );
}
