import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CharacterCard from "@/components/character-card";
import MysteryCard from "@/components/mystery-card";
import FloatingActionButton from "@/components/floating-action-button";
import type { Character, Mystery } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: characters, isLoading: charactersLoading } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  const { data: mysteries, isLoading: mysteriesLoading } = useQuery<Mystery[]>({
    queryKey: ["/api/mysteries"],
  });

  const handleStartGame = () => {
    setLocation("/game");
  };

  const handleJoinGame = () => {
    setLocation("/game");
  };

  return (
    <div className="min-h-screen bg-mystery-cream">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-mystery-lightblue to-mystery-lightpurple py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-mystery-blue to-mystery-purple"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-fredoka text-white mb-6 drop-shadow-lg">
              Solve Mysteries Together!
            </h2>
            <p className="text-xl md:text-2xl text-white mb-8 font-kalam max-w-3xl mx-auto">
              Work as a family team to crack cases, discover clues, and use each character's unique abilities to solve exciting mysteries!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleStartGame} className="btn-primary text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <i className="fas fa-play mr-2"></i>
                Start New Mystery
              </Button>
              <Button onClick={handleJoinGame} className="bg-white text-mystery-blue px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-mystery-cream">
                <i className="fas fa-users mr-2"></i>
                Join Family Game
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-mystery-cream to-transparent"></div>
      </section>

      {/* Characters Section */}
      <section id="characters" className="py-20 bg-mystery-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-fredoka text-mystery-charcoal mb-6">Choose Your Detective</h2>
            <p className="text-xl text-mystery-charcoal font-kalam max-w-2xl mx-auto">
              Each character has special abilities that help solve different types of mysteries. Work together to use everyone's strengths!
            </p>
          </div>
          
          {charactersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {characters?.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mysteries Section */}
      <section id="mysteries" className="py-20 bg-gradient-to-br from-mystery-lightblue to-mystery-lightgreen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-fredoka text-white mb-6 drop-shadow-lg">Choose Your Mystery</h2>
            <p className="text-xl text-white font-kalam max-w-2xl mx-auto">
              Each mystery offers unique challenges and requires different character abilities to solve
            </p>
          </div>
          
          {mysteriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mysteries?.map((mystery) => (
                <MysteryCard key={mystery.id} mystery={mystery} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to Play Section */}
      <section id="how-to-play" className="py-20 bg-mystery-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-fredoka text-mystery-charcoal mb-6">How to Play</h2>
            <p className="text-xl text-mystery-charcoal font-kalam max-w-2xl mx-auto">
              Follow these simple steps to start your family mystery adventure!
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 mystery-yellow rounded-full flex items-center justify-center font-fredoka text-mystery-charcoal text-xl flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-fredoka text-mystery-charcoal mb-2">Choose Characters</h3>
                    <p className="text-mystery-charcoal font-kalam">Each family member picks a detective character with unique abilities.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 mystery-green rounded-full flex items-center justify-center font-fredoka text-mystery-charcoal text-xl flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-fredoka text-mystery-charcoal mb-2">Pick a Mystery</h3>
                    <p className="text-mystery-charcoal font-kalam">Select a mystery that matches your family's age and experience level.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 mystery-blue rounded-full flex items-center justify-center font-fredoka text-mystery-charcoal text-xl flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-fredoka text-mystery-charcoal mb-2">Work Together</h3>
                    <p className="text-mystery-charcoal font-kalam">Use each character's special abilities to find clues and solve puzzles.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 mystery-purple rounded-full flex items-center justify-center font-fredoka text-mystery-charcoal text-xl flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl font-fredoka text-mystery-charcoal mb-2">Collect Clues</h3>
                    <p className="text-mystery-charcoal font-kalam">Gather evidence by exploring locations and talking to characters.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 mystery-coral rounded-full flex items-center justify-center font-fredoka text-mystery-charcoal text-xl flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-2xl font-fredoka text-mystery-charcoal mb-2">Solve the Case</h3>
                    <p className="text-mystery-charcoal font-kalam">Put all the clues together to solve the mystery and celebrate your success!</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 mystery-red rounded-full flex items-center justify-center font-fredoka text-mystery-charcoal text-xl flex-shrink-0">
                    <i className="fas fa-trophy text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-fredoka text-mystery-charcoal mb-2">Earn Rewards</h3>
                    <p className="text-mystery-charcoal font-kalam">Complete mysteries to unlock new characters and more challenging cases!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingActionButton />
    </div>
  );
}
