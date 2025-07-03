import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function FloatingActionButton() {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation("/game");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        className="w-16 h-16 mystery-red rounded-full shadow-2xl flex items-center justify-center text-white text-xl hover:mystery-coral transition-all duration-300 hover:scale-110 animate-pulse-slow"
      >
        <i className="fas fa-play"></i>
      </Button>
    </div>
  );
}
