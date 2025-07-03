import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            <div className="w-12 h-12 mystery-yellow rounded-full flex items-center justify-center">
              <i className="fas fa-search text-mystery-charcoal text-xl"></i>
            </div>
            <h1 className="text-3xl font-fredoka text-mystery-charcoal">Mystery Solvers</h1>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/" className={`font-semibold transition-colors ${location === '/' ? 'text-mystery-blue' : 'text-mystery-charcoal hover:text-mystery-blue'}`}>
              Home
            </Link>
            <Link href="/game" className={`font-semibold transition-colors ${location.startsWith('/game') ? 'text-mystery-blue' : 'text-mystery-charcoal hover:text-mystery-blue'}`}>
              Play
            </Link>
            <Link href="/leaderboard" className={`font-semibold transition-colors ${location === '/leaderboard' ? 'text-mystery-blue' : 'text-mystery-charcoal hover:text-mystery-blue'}`}>
              Leaderboard
            </Link>
          </div>
          
          <Button variant="outline" className="md:hidden">
            <i className="fas fa-bars text-xl"></i>
          </Button>
        </div>
      </nav>
    </header>
  );
}
