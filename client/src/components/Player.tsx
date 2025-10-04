import { useRef, useEffect, useState } from "react";
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
    setIsSliding,
    setGameScreen,
    currentLevel
  } = useGameState();

  const [, getKeys] = useKeyboardControls();
  const [jumpVelocity, setJumpVelocity] = useState(0);
  const [slideTimer, setSlideTimer] = useState(0);
  
  // Level completion distance (increases with level)
  const levelCompletionDistance = -500 - (currentLevel * 100);

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

    // Check level completion
    if (newZ < levelCompletionDistance) {
      setGameScreen('levelComplete');
      return;
    }

    // Jump mechanics - only trigger if on ground
    if (keys.jump && !isJumping && !isSliding && newY <= 1.1) {
      setIsJumping(true);
      setJumpVelocity(18); // Initial jump velocity
    }

    // Slide mechanics
    if (keys.slide && !isSliding && !isJumping && newY <= 1.1) {
      setIsSliding(true);
      setSlideTimer(0.6); // 600ms slide duration
    }

    // Handle jumping physics with proper gravity
    if (isJumping) {
      const gravity = 40;
      const newVelocity = jumpVelocity - gravity * delta;
      setJumpVelocity(newVelocity);
      
      newY += newVelocity * delta;
      
      // Land on ground
      if (newY <= 1) {
        newY = 1;
        setIsJumping(false);
        setJumpVelocity(0);
      }
    } else if (!isSliding) {
      newY = 1; // Ground level
    }

    // Handle sliding physics
    if (isSliding) {
      newY = 0.3; // Lower position
      const newSlideTimer = slideTimer - delta;
      setSlideTimer(newSlideTimer);
      
      if (newSlideTimer <= 0) {
        setIsSliding(false);
        setSlideTimer(0);
      }
    }

    // Update position
    const newPosition = { x: newX, y: newY, z: newZ };
    setPlayerPosition(newPosition);
    
    // Update mesh position
    mesh.position.set(newX, newY, newZ);
    
    // Update camera to follow player
    state.camera.position.x = newX;
    state.camera.position.y = 5;
    state.camera.position.z = newZ + 10;
    state.camera.lookAt(newX, newY, newZ);
  });

  // Initialize player position
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(playerPosition.x, playerPosition.y, playerPosition.z);
    }
  }, []);

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={isSliding ? [1.5, 0.5, 1.5] : [1.5, 2, 1.5]} />
      <meshLambertMaterial color="#4ade80" />
    </mesh>
  );
}
