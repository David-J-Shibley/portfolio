import React from "react";
import { Tool, ToolType } from "../types/gameTypes";

interface ToolState {
  id: ToolType;
  durability: number;
}

interface Props {
  tools: Tool[];
  selectedToolId: ToolType;
  onSelect: (toolId: string) => void;
  toolStates: ToolState[];
  onRepairTool?: (toolId: string) => void;
  money?: number;
  unlockedTools: ToolType[];
  onBuyTool: (toolId: string) => void;
}

const getRepairCost = (tool: Tool) => {
  if (tool.id === "hammer") return 40;
  if (tool.id === "scanner") return 100;
  return 20;
};

const getToolPrice = (tool: Tool) => {
  if (tool.id === "chisel") return 50;
  if (tool.id === "hammer") return 100;
  if (tool.id === "sieve") return 75;
  if (tool.id === "scanner") return 200;
  return 0;
};

const ToolSelector: React.FC<Props> = ({ tools, selectedToolId, onSelect, toolStates, onRepairTool, money, unlockedTools, onBuyTool }) => {
  return (
    <div style={{ margin: "24px 0" }}>
      <h3>Choose Tool</h3>
      <div style={{ display: "flex", gap: 24 }}>
        {tools.map(tool => {
          const unlocked = unlockedTools.includes(tool.id);
          const state = toolStates.find(t => t.id === tool.id);
          const durability = state ? state.durability : tool.maxDurability;
          const broken = durability <= 0;
          const repairCost = getRepairCost(tool);
          const canRepair = unlocked && durability < tool.maxDurability && (money === undefined || money >= repairCost);
          const price = getToolPrice(tool);
          return (
            <div
              key={tool.id}
              style={{
                border: tool.id === selectedToolId ? "2px solid #4b7f52" : "1px solid #ccc",
                borderRadius: 8,
                padding: 16,
                minWidth: 120,
                background: unlocked ? (broken ? "#eee" : "#fff") : "#f3f3f3",
                opacity: unlocked ? (broken ? 0.5 : 1) : 0.7,
                cursor: unlocked ? (broken ? "not-allowed" : "pointer") : "not-allowed",
                boxShadow: tool.id === selectedToolId ? "0 2px 8px #4b7f5233" : "0 1px 4px #0001",
                textAlign: "center"
              }}
              onClick={() => unlocked && !broken && onSelect(tool.id)}
            >
              <div style={{ fontSize: 32 }}>{tool.icon}</div>
              <div style={{ fontWeight: 600 }}>{tool.name}</div>
              <div style={{ fontSize: "0.9em", color: "#888" }}>{tool.description}</div>
              <div style={{ fontSize: "0.8em", marginTop: 4 }}>
                Energy: {tool.energyCost} | Precision: {tool.precision}
              </div>
              <div style={{ fontSize: "0.8em", color: broken ? "#b00" : "#4b7f52", marginTop: 4 }}>
                Durability: {durability} / {tool.maxDurability}
              </div>
              {unlocked && broken && <div style={{ color: "#b00", fontSize: "0.8em", marginTop: 4 }}>Broken</div>}
              {unlocked && onRepairTool && (
                <button
                  style={{ marginTop: 8, padding: "4px 12px", borderRadius: 4, background: canRepair ? "#b5e7a0" : "#eee", border: "none", fontWeight: 600, cursor: canRepair ? "pointer" : "not-allowed", fontSize: "0.9em" }}
                  disabled={!canRepair}
                  onClick={e => { e.stopPropagation(); if (canRepair) onRepairTool(tool.id); }}
                >
                  Repair (${repairCost})
                </button>
              )}
              {!unlocked && (
                <button
                  style={{ marginTop: 8, padding: "4px 12px", borderRadius: 4, background: money !== undefined && money >= price ? "#ffe066" : "#eee", border: "none", fontWeight: 600, cursor: money !== undefined && money >= price ? "pointer" : "not-allowed", fontSize: "0.9em" }}
                  disabled={money === undefined || money < price}
                  onClick={e => { e.stopPropagation(); if (money !== undefined && money >= price) onBuyTool(tool.id); }}
                >
                  Buy (${price})
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToolSelector; 