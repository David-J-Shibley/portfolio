import React, { useState, useEffect, useRef } from "react";
import { getInitialGameState, placeFossilsOnGrid, digSites } from "../utils/gameUtils";
import ExcavationGrid from "./ExcavationGrid";
import ToolSelector from "./ToolSelector";
import { GameState, GridCell, ToolType } from "../types/gameTypes";
import { digCell } from "../utils/excavationUtils";
import { fossilData, dinosaurData } from "../utils/fossilData";
import InventoryPanel from "./InventoryPanel";
import SiteSelector from "./SiteSelector";
import { toolData } from "../utils/toolUtils";
import DinosaurEncyclopedia from "./DinosaurEncyclopedia";
import { getDinosaurCollectionStatus } from "../utils/gameUtils";
import AchievementsPanel from "./AchievementsPanel";
import { achievements, checkAchievements } from "../utils/gameUtils";
import ProgressTracker from "./ProgressTracker";

const LOCAL_STORAGE_KEY = "dinoDropGameStateV1";

const DinoGame: React.FC = () => {
  // Use the first unlocked site for initial state
  const initialSite = digSites.find(site => site.unlocked) || digSites[0];

  // Try to load from localStorage
  const loadState = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Defensive: fallback to initial if any part is missing
      if (!parsed.gameState) return null;
      return parsed;
    } catch {
      return null;
    }
  };

  const loaded = loadState();

  const [gameState, setGameState] = useState<GameState>(() => {
    if (loaded && loaded.gameState) return loaded.gameState;
    const state = getInitialGameState();
    state.currentSite = initialSite;
    state.excavationGrid = Array.from({ length: initialSite.gridSize }, (_, y) =>
      Array.from({ length: initialSite.gridSize }, (_, x) => ({
        x,
        y,
        layer: 1,
        maxLayers: initialSite.maxLayers,
        content: { type: "empty" } as const,
        isRevealed: false,
        isFlagged: false,
        excavationProgress: 0,
      }))
    );
    state.excavationGrid = placeFossilsOnGrid(
      state.excavationGrid,
      initialSite.fossilRarity,
      Math.max(5, Math.floor(initialSite.gridSize * initialSite.gridSize * 0.2))
    );
    return state;
  });

  const [availableSites, setAvailableSites] = useState(() => loaded?.availableSites || digSites);
  const [selectedToolId, setSelectedToolId] = useState<ToolType>(() => loaded?.selectedToolId || toolData[0].id);
  const [toolStates, setToolStates] = useState(() => loaded?.toolStates || toolData.map((t: typeof toolData[0]) => ({ id: t.id, durability: t.maxDurability })));
  const [unlockedTools, setUnlockedTools] = useState<ToolType[]>(() => loaded?.unlockedTools || ["brush"]);
  const [discoveryQueue, setDiscoveryQueue] = useState<{ fossilId: string; fact: string }[]>([]);
  const discovery = discoveryQueue.length > 0 ? discoveryQueue[0] : null;
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);
  const [energyFound, setEnergyFound] = useState<number | null>(null);
  const [scannerResult, setScannerResult] = useState<string | null>(null);
  const [mineralFound, setMineralFound] = useState<number | null>(null);

  // Save to localStorage on relevant state changes
  useEffect(() => {
    const toSave = {
      gameState,
      availableSites,
      selectedToolId,
      toolStates,
      unlockedTools,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
  }, [gameState, availableSites, selectedToolId, toolStates, unlockedTools]);

  // Set background color based on current site
  const backgroundColor = gameState.currentSite.backgroundColor || "#f5e9da";

  // New: handle cell click
  const handleCellClick = (x: number, y: number) => {
    setGameState((prev) => {
      const cell = prev.excavationGrid[y][x];
      const tool = toolData.find((t) => t.id === selectedToolId)!;
      const toolState = toolStates.find((t: { id: string; durability: number }) => t.id === selectedToolId);
      if (cell.isRevealed || prev.energy < tool.energyCost || (toolState && toolState.durability <= 0)) {
        return prev;
      }
      // Scanner logic
      if (tool.id === "scanner") {
        let found = false;
        if (cell.content.type === "fossil" && !cell.isRevealed) {
          found = true;
        }
        setToolStates((ts: { id: string; durability: number }[]) => ts.map((t: { id: string; durability: number }) => t.id === "scanner" ? { ...t, durability: Math.max(0, t.durability - 1) } : t));
        setScannerResult(found ? "Fossil detected!" : "No fossil in this cell.");
        return { ...prev, energy: prev.energy - tool.energyCost };
      }
      // Handle energy cell
      if (cell.content.type === "energy") {
        setEnergyFound(cell.content.amount);
        const newGrid = prev.excavationGrid.map((row, rowIdx) =>
          row.map((c, colIdx) => (rowIdx === y && colIdx === x ? { ...c, isRevealed: true } : c))
        );
        return { ...prev, excavationGrid: newGrid, energy: Math.min(prev.maxEnergy, prev.energy + cell.content.amount) };
      }
      // Handle mineral cell
      if (cell.content.type === "mineral") {
        setMineralFound(cell.content.amount);
        const newGrid = prev.excavationGrid.map((row, rowIdx) =>
          row.map((c, colIdx) => (rowIdx === y && colIdx === x ? { ...c, isRevealed: true } : c))
        );
        return { ...prev, excavationGrid: newGrid, money: prev.money + cell.content.amount };
      }
      const { updatedCell, revealed } = digCell(cell, tool);
      const newGrid = prev.excavationGrid.map((row, rowIdx) =>
        row.map((c, colIdx) => (rowIdx === y && colIdx === x ? updatedCell : c))
      );
      const newEnergy = prev.energy - tool.energyCost;
      let newInventory = prev.inventory;
      // Fossil discovery logic
      if (revealed && updatedCell.content.type === "fossil") {
        const fossilId = updatedCell.content.type === "fossil" ? updatedCell.content.fossilId : undefined;
        const fossil = fossilData.find((f) => f.id === fossilId);
        if (fossil) {
          newInventory = [...prev.inventory, fossil];
        }
      }
      // Decrease tool durability
      setToolStates((ts: { id: string; durability: number }[]) => ts.map((t: { id: string; durability: number }) => t.id === selectedToolId ? { ...t, durability: Math.max(0, t.durability - 1) } : t));
      return { ...prev, excavationGrid: newGrid, energy: newEnergy, inventory: newInventory };
    });
  };

  const handleSiteSelect = (siteId: string) => {
    const site = availableSites.find((s: typeof digSites[0]) => s.id === siteId && s.unlocked);
    if (!site) return;
    setGameState((prev) => {
      // Generate new grid for the selected site
      const newGrid = Array.from({ length: site.gridSize }, (_, y) =>
        Array.from({ length: site.gridSize }, (_, x) => ({
          x,
          y,
          layer: 1,
          maxLayers: site.maxLayers,
          content: { type: "empty" } as const,
          isRevealed: false,
          isFlagged: false,
          excavationProgress: 0,
        }))
      );
      // Place fossils for the new site
      const fossilsToPlace = Math.max(5, Math.floor(site.gridSize * site.gridSize * 0.2));
      const gridWithFossils = placeFossilsOnGrid(newGrid, site.fossilRarity, fossilsToPlace);
      // Keep unlocked tools and their states
      const newToolStates = toolStates.filter((ts: { id: string; durability: number }) => unlockedTools.includes(ts.id as ToolType));
      return {
        ...prev,
        currentSite: site,
        excavationGrid: gridWithFossils,
        energy: prev.maxEnergy,
        inventory: prev.inventory, // keep inventory
        // keep money, unlockedTools, toolStates
      };
    });
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId as ToolType);
  };

  const handleRepairTool = (toolId: string) => {
    setGameState((prev) => {
      const tool = toolData.find((t) => t.id === toolId);
      if (!tool) return prev;
      const repairCost = tool.id === "hammer" ? 40 : tool.id === "scanner" ? 100 : 20;
      if (prev.money < repairCost) return prev;
      setToolStates((ts: { id: string; durability: number }[]) => ts.map((t: { id: string; durability: number }) => t.id === toolId ? { ...t, durability: tool.maxDurability } : t));
      return { ...prev, money: prev.money - repairCost };
    });
  };

  const handleBuyTool = (toolId: string) => {
    setGameState((prev) => {
      const tool = toolData.find((t) => t.id === toolId);
      if (!tool) return prev;
      const toolPrices: Record<string, number> = { chisel: 50, hammer: 100, sieve: 75, scanner: 200 };
      const price = toolPrices[toolId] || 0;
      if (prev.money < price || unlockedTools.includes(toolId as ToolType)) return prev;
      setUnlockedTools((ut: ToolType[]) => [...ut, toolId as ToolType]);
      setToolStates((ts: { id: string; durability: number }[]) =>
        [...ts, { id: toolId, durability: tool.maxDurability }]
      );
      return { ...prev, money: prev.money - price };
    });
  };

  // Unlock sites if enough fossils are discovered
  React.useEffect(() => {
    setAvailableSites((prevSites: typeof digSites) => {
      let updated = false;
      const newSites = prevSites.map((site: typeof digSites[0]) => {
        if (!site.unlocked && site.unlockFossilCount !== undefined && gameState.inventory.length >= site.unlockFossilCount) {
          updated = true;
          return { ...site, unlocked: true };
        }
        return site;
      });
      if (updated) {
        const newlyUnlocked = newSites.filter((site: typeof digSites[0]) => site.unlocked && !prevSites.find((s: typeof digSites[0]) => s.id === site.id && s.unlocked));
        if (newlyUnlocked.length > 0) {
          setUnlockMessage(`New site unlocked: ${newlyUnlocked.map((s: typeof digSites[0]) => s.name).join(", ")}!`);
          setTimeout(() => setUnlockMessage(null), 4000);
        }
      }
      return newSites;
    });
  }, [gameState.inventory.length]);

  const dinoStatus = getDinosaurCollectionStatus(gameState.inventory);
  const unlockedAchievements = checkAchievements({ ...gameState, availableSites, toolStates });

  // Close scanner modal with Enter key
  React.useEffect(() => {
    if (!scannerResult) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") setScannerResult(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [scannerResult]);

  // Show fossil discovery modal when a new fossil is added to inventory
  const prevInventoryRef = React.useRef<string[]>([]);
  React.useEffect(() => {
    const prevIds = prevInventoryRef.current;
    const currentIds = gameState.inventory.map(f => f.id);
    if (currentIds.length > prevIds.length) {
      const newFossil = gameState.inventory.find(f => !prevIds.includes(f.id));
      if (newFossil) {
        const dino = dinosaurData.find(d => d.name === newFossil.dinosaurSpecies);
        const fact = dino && dino.facts.length > 0 ? dino.facts[Math.floor(Math.random() * dino.facts.length)] : "";
        setDiscoveryQueue(q => [...q, { fossilId: newFossil.id, fact }]);
      }
    }
    prevInventoryRef.current = currentIds;
  }, [gameState.inventory]);

  const handleSellFossil = (fossilId: string) => {
    setGameState(prev => {
      const idx = prev.inventory.findIndex(f => f.id === fossilId);
      if (idx === -1) return prev;
      const fossil = prev.inventory[idx];
      let value = 10;
      if (fossil.rarity === "rare") value = 25;
      if (fossil.rarity === "legendary") value = 50;
      const newInventory = [...prev.inventory];
      newInventory.splice(idx, 1);
      return { ...prev, inventory: newInventory, money: prev.money + value };
    });
  };

  // Add a function to reset the game
  const handleNewGame = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    // Reset all state to initial
    const state = getInitialGameState();
    state.currentSite = initialSite;
    state.excavationGrid = Array.from({ length: initialSite.gridSize }, (_, y) =>
      Array.from({ length: initialSite.gridSize }, (_, x) => ({
        x,
        y,
        layer: 1,
        maxLayers: initialSite.maxLayers,
        content: { type: "empty" } as const,
        isRevealed: false,
        isFlagged: false,
        excavationProgress: 0,
      }))
    );
    state.excavationGrid = placeFossilsOnGrid(
      state.excavationGrid,
      initialSite.fossilRarity,
      Math.max(5, Math.floor(initialSite.gridSize * initialSite.gridSize * 0.2))
    );
    setGameState(state);
    setAvailableSites(digSites);
    setSelectedToolId(toolData[0].id);
    setToolStates(toolData.map((t: typeof toolData[0]) => ({ id: t.id, durability: t.maxDurability })));
    setUnlockedTools(["brush"]);
    setDiscoveryQueue([]);
    setUnlockMessage(null);
    setEnergyFound(null);
    setScannerResult(null);
    setMineralFound(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: backgroundColor, transition: "background 0.5s" }}>
      <SiteSelector
        sites={availableSites}
        currentSiteId={gameState.currentSite.id}
        onSelect={handleSiteSelect}
      />
      {unlockMessage && (
        <div style={{ background: "#b5e7a0", color: "#234d20", padding: 12, borderRadius: 6, margin: "12px 0", textAlign: "center", fontWeight: 600, boxShadow: "0 1px 6px #0001" }}>
          {unlockMessage}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <ProgressTracker
        fossilsDiscovered={gameState.inventory.length}
        dinosaursCompleted={dinoStatus.filter(d => d.completed).length}
        sitesUnlocked={availableSites.filter((s: typeof digSites[0]) => s.unlocked).length}
        totalAchievements={achievements.length}
        achievementsUnlocked={unlockedAchievements.length}
      />
      <button onClick={handleNewGame} style={{ marginBottom: 16, padding: "8px 24px", borderRadius: 4, background: "#e57373", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>New Game</button>
      <div>
        <strong>Energy:</strong> {gameState.energy} / {gameState.maxEnergy}
      </div>
      <div>
        <strong>Money:</strong> ${gameState.money}
      </div>
      <div>
        <strong>Tool:</strong> {gameState.selectedTool.name}
      </div>
      </div>
      <ExcavationGrid grid={gameState.excavationGrid} onCellClick={handleCellClick} />
      <ToolSelector
        tools={toolData}
        selectedToolId={selectedToolId}
        onSelect={handleToolSelect}
        toolStates={toolStates}
        onRepairTool={handleRepairTool}
        money={gameState.money}
        unlockedTools={unlockedTools}
        onBuyTool={handleBuyTool}
      />
      <InventoryPanel inventory={gameState.inventory} onFossilClick={(fossilId) => {
        const fossil = fossilData.find(f => f.id === fossilId);
        if (fossil) {
          const dino = dinosaurData.find(d => d.name === fossil.dinosaurSpecies);
          const fact = dino && dino.facts.length > 0 ? dino.facts[Math.floor(Math.random() * dino.facts.length)] : "";
          setDiscoveryQueue(q => [...q, { fossilId: fossil.id, fact }]);
        }
      }} onSellFossil={handleSellFossil} />
      <DinosaurEncyclopedia collectionStatus={getDinosaurCollectionStatus(gameState.inventory)} />
      <AchievementsPanel achievements={achievements} unlockedIds={checkAchievements({ ...gameState, availableSites })} />
      {/* Discovery Modal */}
      {discovery && (() => {
        const fossil = fossilData.find(f => f.id === discovery.fossilId);
        return fossil ? (
          <div style={{
            position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
          }}>
            <div style={{ background: "#fffbe9", borderRadius: 8, padding: 32, minWidth: 320, boxShadow: "0 2px 16px #0002", textAlign: "center" }}>
              <h3>Fossil Discovered!</h3>
              <img src={fossil.imageUrl} alt={fossil.name} style={{ width: 500, height: 500, objectFit: "contain" }} />
              <h4>{fossil.name}</h4>
              <p><em>{fossil.description}</em></p>
              <p><strong>Dinosaur:</strong> {fossil.dinosaurSpecies}</p>
              <p style={{ color: "#4b7f52", fontStyle: "italic" }}>&ldquo;{discovery.fact}&rdquo;</p>
              <button style={{ marginTop: 16, padding: "8px 24px", borderRadius: 4, background: "#b5e7a0", border: "none", fontWeight: 600, cursor: "pointer" }} onClick={() => setDiscoveryQueue(q => q.slice(1))}>Close</button>
            </div>
          </div>
        ) : null;
      })()}
      {/* Energy Found Modal */}
      {energyFound !== null && (
        <div style={{
          position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fffbe9", borderRadius: 8, padding: 32, minWidth: 320, boxShadow: "0 2px 16px #0002", textAlign: "center" }}>
            <h3>Energy Found!</h3>
            <div style={{ fontSize: 48, margin: "16px 0" }}>⚡️</div>
            <p>You found an energy cell and gained <strong>{energyFound}</strong> energy!</p>
            <button style={{ marginTop: 16, padding: "8px 24px", borderRadius: 4, background: "#b5e7a0", border: "none", fontWeight: 600, cursor: "pointer" }} onClick={() => setEnergyFound(null)}>Close</button>
          </div>
        </div>
      )}
      {/* Mineral Found Modal */}
      {mineralFound !== null && (
        <div style={{
          position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fffbe9", borderRadius: 8, padding: 32, minWidth: 320, boxShadow: "0 2px 16px #0002", textAlign: "center" }}>
            <h3>Mineral Found!</h3>
            <div style={{ fontSize: 48, margin: "16px 0" }}>💎</div>
            <p>You found rare minerals and earned <strong>{mineralFound}</strong> money!</p>
            <button style={{ marginTop: 16, padding: "8px 24px", borderRadius: 4, background: "#b5e7a0", border: "none", fontWeight: 600, cursor: "pointer" }} onClick={() => setMineralFound(null)}>Close</button>
          </div>
        </div>
      )}
      {/* Scanner Result Modal */}
      {scannerResult && (
        <div style={{
          position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fffbe9", borderRadius: 8, padding: 32, minWidth: 320, boxShadow: "0 2px 16px #0002", textAlign: "center" }}>
            <h3>Scanner Result</h3>
            <div style={{ fontSize: 48, margin: "16px 0" }}>📡</div>
            <p>{scannerResult}</p>
            <button style={{ marginTop: 16, padding: "8px 24px", borderRadius: 4, background: "#b5e7a0", border: "none", fontWeight: 600, cursor: "pointer" }} onClick={() => setScannerResult(null)}>Close</button>
          </div>
        </div>
      )}
      {/* TODO: Add ExcavationGrid, ToolSelector, InventoryPanel, etc. */}
    </div>
  );
};

export default DinoGame; 