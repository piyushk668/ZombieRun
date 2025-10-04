// Collision detection utility
export function checkCollision(
  pos1: { x: number; y: number; z: number },
  size1: { x: number; y: number; z: number },
  pos2: { x: number; y: number; z: number },
  size2: { width: number; height: number; depth: number }
): boolean {
  const halfSize1 = {
    x: size1.x / 2,
    y: size1.y / 2,
    z: size1.z / 2
  };
  
  const halfSize2 = {
    x: size2.width / 2,
    y: size2.height / 2,
    z: size2.depth / 2
  };

  return (
    Math.abs(pos1.x - pos2.x) < (halfSize1.x + halfSize2.x) &&
    Math.abs(pos1.y - pos2.y) < (halfSize1.y + halfSize2.y) &&
    Math.abs(pos1.z - pos2.z) < (halfSize1.z + halfSize2.z)
  );
}

// Distance calculation
export function calculateDistance(
  pos1: { x: number; y: number; z: number },
  pos2: { x: number; y: number; z: number }
): number {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) +
    Math.pow(pos1.y - pos2.y, 2) +
    Math.pow(pos1.z - pos2.z, 2)
  );
}

// Lerp function for smooth movement
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

// Clamp function to keep values within bounds
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Random position generation for obstacles/gems
export function generateRandomPosition(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  minZ: number,
  maxZ: number
): { x: number; y: number; z: number } {
  return {
    x: minX + Math.random() * (maxX - minX),
    y: minY + Math.random() * (maxY - minY),
    z: minZ + Math.random() * (maxZ - minZ)
  };
}

// Format time for display
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Calculate score based on performance
export function calculateLevelScore(
  gemsCollected: number,
  timeBonus: number,
  levelMultiplier: number
): number {
  return Math.floor((gemsCollected * 10 + timeBonus) * levelMultiplier);
}

// Generate random obstacle layout
export function generateObstaclePattern(level: number): Array<{
  type: 'spike' | 'barrier' | 'trap';
  lane: number;
  distance: number;
}> {
  const patterns = [];
  const baseDistance = 20;
  const patternCount = Math.min(5 + level, 15);
  
  for (let i = 0; i < patternCount; i++) {
    const distance = baseDistance + (i * 15) + Math.random() * 10;
    const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
    const types = ['spike', 'barrier', 'trap'] as const;
    const type = types[Math.floor(Math.random() * types.length)];
    
    patterns.push({
      type,
      lane,
      distance
    });
  }
  
  return patterns;
}
