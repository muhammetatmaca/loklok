import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import type { Family } from "@shared/schema";

export default function Leaderboard() {
  const [, setLocation] = useLocation();

  const { data: families, isLoading } = useQuery<Family[]>({
    queryKey: ["/api/families"],
  });

  const handleJoinCompetition = () => {
    setLocation("/game");
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "mystery-yellow";
      case 2: return "mystery-green";
      case 3: return "mystery-blue";
      default: return "mystery-purple";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "fas fa-trophy";
      case 2: return "fas fa-medal";
      case 3: return "fas fa-award";
      default: return "fas fa-star";
    }
  };

  return (
    <div className="min-h-screen bg-mystery-cream">
      <Header />
      
      <section className="py-20 bg-gradient-to-br from-mystery-purple to-mystery-blue">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-fredoka text-white mb-6 drop-shadow-lg">
              Family Leaderboard
            </h1>
            <p className="text-xl text-white font-kalam max-w-2xl mx-auto">
              See how your family ranks among other mystery-solving teams!
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Card className="hand-drawn bg-white p-8 mb-8">
              <CardHeader>
                <div className="flex items-center justify-between mb-6">
                  <CardTitle className="text-2xl font-fredoka text-mystery-charcoal">
                    Top Detective Families
                  </CardTitle>
                  <div className="text-mystery-charcoal">
                    <i className="fas fa-trophy text-mystery-yellow text-2xl"></i>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {families?.map((family, index) => {
                      const rank = index + 1;
                      const rankColor = getRankColor(rank);
                      const rankIcon = getRankIcon(rank);
                      
                      return (
                        <div key={family.id} className={`flex items-center justify-between p-4 ${rankColor} bg-opacity-30 rounded-lg transition-all duration-300 hover:bg-opacity-50`}>
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 ${rankColor} rounded-full flex items-center justify-center font-fredoka text-mystery-charcoal relative`}>
                              <span className="text-sm font-bold">{rank}</span>
                              {rank <= 3 && (
                                <i className={`${rankIcon} absolute -top-2 -right-2 text-mystery-charcoal text-xs`}></i>
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-mystery-charcoal text-lg">{family.name}</h4>
                              <p className="text-sm text-mystery-charcoal">
                                {family.mysteriesSolved} mysteries solved
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-lg font-bold">
                              {family.totalPoints} pts
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="text-center">
              <Button 
                onClick={handleJoinCompetition}
                className="btn-primary text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <i className="fas fa-users mr-2"></i>
                Join the Competition
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Badges Section */}
      <section className="py-20 bg-mystery-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-fredoka text-mystery-charcoal mb-6">
              Achievement Badges
            </h2>
            <p className="text-xl text-mystery-charcoal font-kalam">
              Earn these special badges by completing mysteries!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="hand-drawn text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 mystery-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-baby text-mystery-charcoal text-2xl"></i>
                </div>
                <h3 className="text-xl font-fredoka text-mystery-charcoal mb-2">First Steps</h3>
                <p className="text-mystery-charcoal font-kalam">Complete your first mystery</p>
              </CardContent>
            </Card>
            
            <Card className="hand-drawn text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 mystery-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-mystery-charcoal text-2xl"></i>
                </div>
                <h3 className="text-xl font-fredoka text-mystery-charcoal mb-2">Team Player</h3>
                <p className="text-mystery-charcoal font-kalam">Solve 5 mysteries as a team</p>
              </CardContent>
            </Card>
            
            <Card className="hand-drawn text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 mystery-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-crown text-mystery-charcoal text-2xl"></i>
                </div>
                <h3 className="text-xl font-fredoka text-mystery-charcoal mb-2">Master Detective</h3>
                <p className="text-mystery-charcoal font-kalam">Solve 10 mysteries perfectly</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
