import { Button } from "@/components/ui/button";
import { useGameState } from "@/lib/stores/useGameState";

export default function AuthScreen() {
  const { setGameScreen, setPlayerName } = useGameState();

  const handleGoogleLogin = () => {
    // Mock Google login
    setPlayerName("Google User");
    setGameScreen('tutorial');
  };

  const handlePlayAsGuest = () => {
    setPlayerName("Guest Player");
    setGameScreen('tutorial');
  };

  const handleBack = () => {
    setGameScreen('welcome');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-800 to-blue-900 text-white">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back!</h1>
        <p className="text-center mb-8 opacity-80">Choose how you want to play</p>

        <div className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            className="w-full py-4 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔐</span>
            Login with Google
          </Button>

          <Button
            onClick={handlePlayAsGuest}
            variant="outline"
            className="w-full py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="text-xl">👤</span>
            Play as Guest
          </Button>
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-white hover:bg-white/10 transition-all duration-300"
          >
            ← Back to Menu
          </Button>
        </div>

        <div className="mt-6 text-xs text-center opacity-60">
          <p>Your progress will be saved locally</p>
        </div>
      </div>
    </div>
  );
}
