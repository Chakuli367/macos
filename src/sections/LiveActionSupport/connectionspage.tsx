import React from 'react';
import EnhancedTaskHub from './liveactionsupport'; // adjust the path as needed
import { Users, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom'; // if using react-router for navigation

const ConnectionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950 text-white">
      
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-purple-900/50 backdrop-blur-md border-b border-purple-700/40">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-white hover:text-yellow-400 transition-colors text-sm">
  <ArrowLeft className="w-4 h-4" /> Back
</Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-green-400" />
            Live Action Support
          </h1>
        </div>
        
      </header>

      {/* Main Page Content */}
      <main className="px-4 md:px-6 lg:px-12 py-6">
        <EnhancedTaskHub />
      </main>

      {/* Optional Footer */}
      <footer className="w-full py-4 text-center text-purple-300 text-sm border-t border-purple-700/30 mt-8">
        Powered by GoalGrid • Track, Connect, Grow
      </footer>
    </div>
  );
};

export default ConnectionsPage;
