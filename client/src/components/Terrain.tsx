import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useGameState } from "@/lib/stores/useGameState";

export default function Terrain() {
  const groupRef = useRef<THREE.Group>(null);
  const { playerPosition, gameScreen } = useGameState();
  
  // Load terrain texture
  const grassTexture = useTexture("/textures/grass.png");
  
  // Configure texture
  useMemo(() => {
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(10, 10);
  }, [grassTexture]);

  // Generate terrain segments
  const terrainSegments = useMemo(() => {
    const segments = [];
    const segmentLength = 100;
    const segmentCount = 10;
    
    for (let i = 0; i < segmentCount; i++) {
      segments.push({
        id: i,
        z: i * segmentLength - segmentLength * 2,
        width: 20,
        length: segmentLength
      });
    }
    return segments;
  }, []);

  // Move terrain segments to create endless effect
  useFrame(() => {
    if (gameScreen !== 'playing' || !groupRef.current) return;
    
    groupRef.current.children.forEach((segment, index) => {
      const terrainSegment = segment as THREE.Mesh;
      
      // If segment is too far behind player, move it ahead
      if (terrainSegment.position.z > playerPosition.z + 50) {
        terrainSegment.position.z -= terrainSegments.length * 100;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {terrainSegments.map((segment, index) => (
        <mesh 
          key={segment.id} 
          position={[0, -1, segment.z]} 
          receiveShadow
        >
          <boxGeometry args={[segment.width, 1, segment.length]} />
          <meshLambertMaterial map={grassTexture} color="#4ade80" />
        </mesh>
      ))}
      
      {/* Side walls to create jungle corridor effect */}
      {[-12, 12].map((x, index) => (
        <group key={index}>
          {terrainSegments.map((segment) => (
            <mesh 
              key={`wall-${segment.id}-${index}`} 
              position={[x, 2, segment.z]}
            >
              <boxGeometry args={[2, 6, segment.length]} />
              <meshLambertMaterial color="#2d5016" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
