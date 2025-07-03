import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import type { Mystery } from "@shared/schema";
import { difficultyColors, difficultyLabels } from "@/lib/game-data";

interface MysteryCardProps {
  mystery: Mystery;
}

export default function MysteryCard({ mystery }: MysteryCardProps) {
  const [, setLocation] = useLocation();

  const handleStartMystery = () => {
    setLocation(`/game/${mystery.id}`);
  };

  const difficultyColor = difficultyColors[mystery.difficulty as keyof typeof difficultyColors];
  const difficultyLabel = difficultyLabels[mystery.difficulty as keyof typeof difficultyLabels];

  return (
    <Card className="mystery-card p-6 transition-all duration-300 hover:scale-105">
      <CardContent className="p-0">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 mystery-red rounded-full flex items-center justify-center clue-indicator">
            <i className={`${mystery.icon} text-white text-2xl`}></i>
          </div>
          <h3 className="text-2xl font-fredoka text-mystery-charcoal mb-2">{mystery.title}</h3>
          <p className="text-mystery-charcoal font-kalam mb-4">{mystery.description}</p>
        </div>
        
        <div className="bg-white bg-opacity-80 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-mystery-charcoal mb-2">Difficulty:</h4>
          <div className="flex space-x-1">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`w-4 h-4 rounded-full ${
                  level <= mystery.difficulty ? difficultyColor : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
          <Badge className="mt-2" variant="outline">
            {difficultyLabel}
          </Badge>
        </div>
        
        <div className="bg-white bg-opacity-80 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-mystery-charcoal mb-2">Best For:</h4>
          <p className="text-sm text-mystery-charcoal">{mystery.ageRange} • Up to {mystery.maxPlayers} players</p>
        </div>
        
        <Button 
          onClick={handleStartMystery}
          className="w-full mystery-blue text-white py-3 rounded-full font-bold hover:mystery-lightblue transition-all duration-300"
        >
          <i className="fas fa-play mr-2"></i>
          Start Mystery
        </Button>
      </CardContent>
    </Card>
  );
}
