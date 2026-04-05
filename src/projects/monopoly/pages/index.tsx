import GameBoard from '../components/GameBoard';
import PlayerDashboard from '../components/PlayerDashboard';
import PropertyPurchaseModal from '../components/PropertyPurchaseModal';
import AuctionModal from '../components/AuctionModal';
import GameStartModal from '../components/GameStartModal';
import CardDrawModal from '../components/CardDrawModal';
import { GameProvider } from '../context/GameContext';

import './index.css'

const Index = () => {
  return (
    <div className="monopoly-app bg-background text-foreground">
      <GameProvider>
        <GameStartModal />
        <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-4">
            <PlayerDashboard />
            <PropertyPurchaseModal />
            <AuctionModal />
            <CardDrawModal />
          </div>
          <div className="flex shrink-0 justify-center lg:sticky lg:top-28">
            <GameBoard />
          </div>
        </div>
      </GameProvider>
    </div>
  );
};

export default Index;
