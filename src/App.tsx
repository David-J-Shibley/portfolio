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
import RPS from "./projects/rps/pages"

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
          <Route path="/farkle" element={<Farkle />} />
          <Route path="rps" element={<RPS />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </RPSGameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;