export default function Footer() {
  return (
    <footer className="mystery-charcoal text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 mystery-yellow rounded-full flex items-center justify-center">
                <i className="fas fa-search text-mystery-charcoal text-xl"></i>
              </div>
              <h3 className="text-2xl font-fredoka">Mystery Solvers</h3>
            </div>
            <p className="text-gray-300 font-kalam">
              The ultimate family detective game that brings everyone together to solve exciting mysteries!
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-fredoka mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#characters" className="hover:text-mystery-yellow transition-colors">Characters</a></li>
              <li><a href="#mysteries" className="hover:text-mystery-yellow transition-colors">Mysteries</a></li>
              <li><a href="#how-to-play" className="hover:text-mystery-yellow transition-colors">How to Play</a></li>
              <li><a href="#leaderboard" className="hover:text-mystery-yellow transition-colors">Leaderboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-fredoka mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-300">
              <p><i className="fas fa-envelope mr-2"></i>support@mysterysolvers.com</p>
              <p><i className="fas fa-phone mr-2"></i>1-800-MYSTERY</p>
              <div className="flex space-x-4 pt-4">
                <a href="#" className="w-8 h-8 mystery-blue rounded-full flex items-center justify-center hover:mystery-lightblue transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-8 h-8 mystery-blue rounded-full flex items-center justify-center hover:mystery-lightblue transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-8 h-8 mystery-blue rounded-full flex items-center justify-center hover:mystery-lightblue transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Mystery Solvers. All rights reserved. Made with ❤️ for families.</p>
        </div>
      </div>
    </footer>
  );
}
