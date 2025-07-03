import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import CharacterCard from "@/components/character-card";
import MysteryCard from "@/components/mystery-card";
import type { Character, Mystery, GameSession } from "@shared/schema";
import { gameSteps } from "@/lib/game-data";

export default function Game() {
  const { mysteryId } = useParams<{ mysteryId?: string }>();
  const [, setLocation] = useLocation();
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [selectedMystery, setSelectedMystery] = useState<Mystery | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: characters, isLoading: charactersLoading } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  const { data: mysteries, isLoading: mysteriesLoading } = useQuery<Mystery[]>({
    queryKey: ["/api/mysteries"],
  });

  const { data: mystery, isLoading: mysteryLoading } = useQuery<Mystery>({
    queryKey: [`/api/mysteries/${mysteryId}`],
    enabled: !!mysteryId,
  });

  const createGameSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest("POST", "/api/game-sessions", sessionData);
      return response.json();
    },
    onSuccess: (data) => {
      setGameSession(data);
      toast({
        title: "Game Started!",
        description: "Your mystery adventure has begun.",
      });
    },
  });

  useEffect(() => {
    if (mysteryId && mystery) {
      setSelectedMystery(mystery);
    }
  }, [mysteryId, mystery]);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacters(prev => {
      const isSelected = prev.some(c => c.id === character.id);
      if (isSelected) {
        return prev.filter(c => c.id !== character.id);
      } else {
        return [...prev, character];
      }
    });
  };

  const handleMysterySelect = (mystery: Mystery) => {
    setSelectedMystery(mystery);
  };

  const startGame = () => {
    if (!selectedMystery || selectedCharacters.length === 0) {
      toast({
        title: "Cannot Start Game",
        description: "Please select at least one character and a mystery.",
        variant: "destructive",
      });
      return;
    }

    createGameSessionMutation.mutate({
      mysteryId: selectedMystery.id,
      selectedCharacters: selectedCharacters.map(c => c.name),
    });
  };

  const nextStep = () => {
    if (!selectedMystery || !gameSession) return;

    const mysterySteps = gameSteps[selectedMystery.id as keyof typeof gameSteps];
    if (!mysterySteps || currentStep >= mysterySteps.steps.length - 1) {
      // Mystery completed
      toast({
        title: "Mystery Solved!",
        description: "Congratulations! You've successfully solved the mystery.",
      });
      setLocation("/leaderboard");
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const getCurrentStep = () => {
    if (!selectedMystery || !gameSession) return null;
    
    const mysterySteps = gameSteps[selectedMystery.id as keyof typeof gameSteps];
    return mysterySteps?.steps[currentStep] || null;
  };

  const getProgress = () => {
    if (!selectedMystery || !gameSession) return 0;
    
    const mysterySteps = gameSteps[selectedMystery.id as keyof typeof gameSteps];
    if (!mysterySteps) return 0;
    
    return ((currentStep + 1) / mysterySteps.steps.length) * 100;
  };

  const canProceed = () => {
    const step = getCurrentStep();
    if (!step) return false;
    
    return selectedCharacters.some(char => char.name === step.requiredCharacter);
  };

  if (gameSession) {
    const step = getCurrentStep();
    if (!step) return <div>Loading...</div>;

    return (
      <div className="min-h-screen bg-mystery-cream">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-fredoka text-mystery-charcoal">
                    {selectedMystery?.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-lg">
                    Step {currentStep + 1}
                  </Badge>
                </div>
                <Progress value={getProgress()} className="mt-4" />
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="hand-drawn">
                <CardHeader>
                  <CardTitle className="text-xl font-fredoka text-mystery-charcoal flex items-center">
                    <i className="fas fa-map-marked-alt mr-2"></i>
                    Current Task
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-bold text-mystery-charcoal mb-2">{step.title}</h3>
                  <p className="text-mystery-charcoal font-kalam mb-4">{step.description}</p>
                  
                  <div className="mystery-lightblue bg-opacity-30 rounded-lg p-4 mb-4">
                    <h4 className="font-bold text-mystery-charcoal mb-2">Required Character:</h4>
                    <p className="text-mystery-charcoal">{step.requiredCharacter}</p>
                  </div>

                  <Button 
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="w-full btn-primary"
                  >
                    {canProceed() ? "Continue Investigation" : "Need Required Character"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="hand-drawn">
                <CardHeader>
                  <CardTitle className="text-xl font-fredoka text-mystery-charcoal flex items-center">
                    <i className="fas fa-search mr-2"></i>
                    Clues Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {step.clues.map((clue, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-mystery-yellow bg-opacity-20 rounded-lg">
                        <div className="w-6 h-6 mystery-green rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-check text-white text-sm"></i>
                        </div>
                        <p className="text-mystery-charcoal font-kalam">{clue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 hand-drawn">
              <CardHeader>
                <CardTitle className="text-xl font-fredoka text-mystery-charcoal flex items-center">
                  <i className="fas fa-users mr-2"></i>
                  Your Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedCharacters.map((character) => (
                    <div key={character.id} className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${character.color}`}>
                        <i className={`${character.icon} text-mystery-charcoal text-xl`}></i>
                      </div>
                      <p className="text-sm font-bold text-mystery-charcoal">{character.name}</p>
                      <p className="text-xs text-mystery-charcoal">{character.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mystery-cream">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fredoka text-mystery-charcoal mb-4">Setup Your Mystery Adventure</h1>
          <p className="text-xl text-mystery-charcoal font-kalam">Choose your characters and mystery to begin!</p>
        </div>

        {/* Character Selection */}
        <section className="mb-12">
          <h2 className="text-3xl font-fredoka text-mystery-charcoal mb-8 text-center">
            Select Your Team ({selectedCharacters.length} selected)
          </h2>
          
          {charactersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="hand-drawn p-6 animate-pulse">
                  <CardContent className="p-0">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gray-300 rounded-full"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-16 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {characters?.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isSelected={selectedCharacters.some(c => c.id === character.id)}
                  onSelect={handleCharacterSelect}
                />
              ))}
            </div>
          )}
        </section>

        <Separator className="my-8" />

        {/* Mystery Selection */}
        <section className="mb-12">
          <h2 className="text-3xl font-fredoka text-mystery-charcoal mb-8 text-center">
            Choose Your Mystery
          </h2>
          
          {selectedMystery && (
            <div className="text-center mb-6">
              <Badge className="bg-mystery-blue text-white text-lg px-4 py-2">
                Selected: {selectedMystery.title}
              </Badge>
            </div>
          )}
          
          {mysteriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="mystery-card p-6 animate-pulse">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-16 bg-gray-300 rounded mb-4"></div>
                    <div className="h-12 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mysteries?.map((mystery) => (
                <div
                  key={mystery.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedMystery?.id === mystery.id ? 'ring-4 ring-mystery-blue scale-105' : ''
                  }`}
                  onClick={() => handleMysterySelect(mystery)}
                >
                  <MysteryCard mystery={mystery} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Start Game Button */}
        <div className="text-center">
          <Button
            onClick={startGame}
            disabled={!selectedMystery || selectedCharacters.length === 0 || createGameSessionMutation.isPending}
            className="btn-primary text-white px-12 py-4 text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {createGameSessionMutation.isPending ? (
              <>
                <i className="fas fa-spinner animate-spin mr-2"></i>
                Starting Game...
              </>
            ) : (
              <>
                <i className="fas fa-play mr-2"></i>
                Start Mystery Adventure!
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
