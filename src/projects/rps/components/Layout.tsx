import React from 'react';
import { GameProvider } from '../context/GameContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
        <header className="container py-6">
          <div className="flex justify-center">
            <h1 className="text-2xl font-medium">
              Rock Paper Scissors
            </h1>
          </div>
        </header>
        <main>
          {children}
        </main>
        <footer className="container py-6 mt-8">
          <p className="text-center text-sm text-muted-foreground">
            Designed with precision and elegance
          </p>
        </footer>
      </div>
    </GameProvider>
  );
};

export default Layout;