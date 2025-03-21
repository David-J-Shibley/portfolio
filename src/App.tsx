import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider as RPSGameProvider } from "./projects/rps/context/GameContext.tsx";
import Navigation from "./components/Navigation.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound";
import Games from "./pages/Games.tsx"
import Checkers from "./projects/checkers/pages";
import Chess from "./projects/chess/pages"
import Farkle from "./projects/farkle/pages"
import Hangman from "./projects/hangman/src/pages";
import Memory from "./projects/memory/pages"
import RPS from "./projects/rps/pages"
import Snake from "./projects/snake/pages"
import Frogger from "./projects/frogger/pages"
import Dominion from "./projects/dominion/pages"
import Invaders from "./projects/invaders/pages"
import Monopoly from "./projects/monopoly/pages"
import TicTacToe from "./projects/tic_tack_toe/pages"
import EtherealQuest from "./projects/ethereal_quest/pages"
import SoundHaven from "./projects/sound_haven/pages"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <RPSGameProvider>
      <Toaster />
      <Sonner />
      <Navigation />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/games" element={<Games />} />
          <Route path="/checkers" element={<Checkers />} />
          <Route path="/chess" element={<Chess />} />
          <Route path="/dominion" element={<Dominion />} />
          <Route path="/eq" element={<EtherealQuest />} />
          <Route path="/farkle" element={<Farkle />} />
          <Route path="/frogger" element={<Frogger />} />
          <Route path="/hangman" element={<Hangman />} />
          <Route path="/invaders" element={<Invaders />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="/monopoly" element={<Monopoly />} />
          <Route path="/rps" element={<RPS />} />
          <Route path="/snake" element={<Snake />} />
          <Route path="/sound_haven" element={<SoundHaven />} />
          <Route path="/ttt" element={<TicTacToe />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </RPSGameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;