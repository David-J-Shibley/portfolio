import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GameProvider as RPSGameProvider } from "./projects/rps/context/GameContext.tsx";
import Navigation from "./components/Navigation.tsx";
import PortfolioChat from "./components/PortfolioChat.tsx";
import { SkipLink } from "./components/SkipLink.tsx";
import { RootLayout } from "./components/RootLayout.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound";
import Games from "./pages/Games.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import CaseStudies from "./pages/CaseStudies.tsx";
import CaseStudyDetail from "./pages/CaseStudyDetail.tsx";
import Checkers from "./projects/checkers/pages";
import Chess from "./projects/chess/pages";
import Farkle from "./projects/farkle/pages";
import Hangman from "./projects/hangman/src/pages";
import Memory from "./projects/memory/pages";
import RPS from "./projects/rps/pages";
import Snake from "./projects/snake/pages";
import Frogger from "./projects/frogger/pages";
import Dominion from "./projects/dominion/pages";
import Invaders from "./projects/invaders/pages";
import Monopoly from "./projects/monopoly/pages";
import TicTacToe from "./projects/tic_tack_toe/pages";
import EtherealQuest from "./projects/ethereal_quest/pages";
import SoundHaven from "./projects/sound_haven/pages";
import Asteroids from "./projects/astroids/pages";
import CodeChallenge from "./projects/code_challeng";
import RPG from "./projects/rpg";
import DinoDrop from "./projects/dino_drop/pages";
import DailyWordle from "./projects/wordle/pages";
import Game2048 from "./projects/game2048/pages";
import Minesweeper from "./projects/minesweeper/pages";
import ConnectFour from "./projects/connect_four/pages";
import Simon from "./projects/simon/pages";
import LightsOut from "./projects/lights_out/pages";
import Breakout from "./projects/breakout/pages";
import Sudoku from "./projects/sudoku/pages";
import Blackjack from "./projects/blackjack/pages";
import War from "./projects/war/pages";
import HighLow from "./projects/high_low/pages";
import CrazyEights from "./projects/crazy_eights/pages";
import Holdem from "./projects/holdem/pages";
import TowerDefense from "./projects/tower_defense/pages";
import Connections from "./projects/connections/pages";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RPSGameProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SkipLink />
            <Navigation />
            <PortfolioChat />
            <Routes>
              <Route element={<RootLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route
                  path="/case-studies/:slug"
                  element={<CaseStudyDetail />}
                />
                <Route path="/games" element={<Games />} />
                <Route path="/asteroids" element={<Asteroids />} />
                <Route path="/checkers" element={<Checkers />} />
                <Route path="/chess" element={<Chess />} />
                <Route path="/code_challenge" element={<CodeChallenge />} />
                <Route path="/dino_drop" element={<DinoDrop />} />
                <Route path="/dominion" element={<Dominion />} />
                <Route path="/eq" element={<EtherealQuest />} />
                <Route path="/farkle" element={<Farkle />} />
                <Route path="/frogger" element={<Frogger />} />
                <Route path="/hangman" element={<Hangman />} />
                <Route path="/invaders" element={<Invaders />} />
                <Route path="/memory" element={<Memory />} />
                <Route path="/monopoly" element={<Monopoly />} />
                <Route path="/rpg" element={<RPG />} />
                <Route path="/rps" element={<RPS />} />
                <Route path="/snake" element={<Snake />} />
                <Route path="/sound_haven" element={<SoundHaven />} />
                <Route path="/ttt" element={<TicTacToe />} />
                <Route path="/wordle" element={<DailyWordle />} />
                <Route path="/2048" element={<Game2048 />} />
                <Route path="/minesweeper" element={<Minesweeper />} />
                <Route path="/connect4" element={<ConnectFour />} />
                <Route path="/simon" element={<Simon />} />
                <Route path="/lights-out" element={<LightsOut />} />
                <Route path="/breakout" element={<Breakout />} />
                <Route path="/sudoku" element={<Sudoku />} />
                <Route path="/blackjack" element={<Blackjack />} />
                <Route path="/war" element={<War />} />
                <Route path="/high-low" element={<HighLow />} />
                <Route path="/crazy-eights" element={<CrazyEights />} />
                <Route path="/holdem" element={<Holdem />} />
                <Route path="/tower-defense" element={<TowerDefense />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RPSGameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
