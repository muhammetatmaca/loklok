import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Character } from "@shared/schema";

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onSelect?: (character: Character) => void;
}

export default function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(character);
    }
  };

  return (
    <Card 
      className={`character-card hand-drawn p-6 text-center cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-4 ring-mystery-blue scale-105' : ''
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className={`w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg ${character.color}`}>
          <i className={`${character.icon} text-mystery-charcoal text-4xl`}></i>
        </div>
        
        <h3 className="text-2xl font-fredoka text-mystery-charcoal mb-2">{character.name}</h3>
        <p className="text-mystery-charcoal mb-4 font-kalam">{character.title}</p>
        
        <div className="mystery-lightblue bg-opacity-30 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-mystery-charcoal mb-2">Special Ability:</h4>
          <p className="text-sm text-mystery-charcoal">{character.ability}</p>
        </div>
        
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 mystery-red rounded-full"></div>
          <div className="w-3 h-3 mystery-green rounded-full"></div>
          <div className="w-3 h-3 mystery-yellow rounded-full"></div>
        </div>
        
        {isSelected && (
          <Badge className="mt-4 bg-mystery-blue text-white">
            Selected
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
