import { Suspense } from "react";
import Player from "./Player";
import Zombie from "./Zombie";
import Terrain from "./Terrain";
import Obstacles from "./Obstacles";
import Gems from "./Gems";

export default function GameScene() {
  return (
    <Suspense fallback={null}>
      <Player />
      <Zombie />
      <Terrain />
      <Obstacles />
      <Gems />
    </Suspense>
  );
}
