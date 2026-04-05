import React from "react";
import { Fossil } from "../types/gameTypes";

interface Props {
  inventory: Fossil[];
  onFossilClick?: (fossilId: string) => void;
  onSellFossil?: (fossilId: string) => void;
}

const InventoryPanel: React.FC<Props> = ({ inventory, onFossilClick, onSellFossil }) => {
  return (
    <div style={{ marginTop: 24 }}>
      <h3>Inventory</h3>
      {inventory.length === 0 ? (
        <p>No fossils discovered yet.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {inventory.map((fossil, idx) => (
            <div
              key={fossil.id + '-' + idx}
              style={{ background: "#f5e9da", borderRadius: 8, padding: 12, minWidth: 120, textAlign: "center", boxShadow: "0 1px 4px #0001" }}
            >
              <img
                src={fossil.imageUrl}
                alt={fossil.name}
                style={{ width: 40, height: 40, objectFit: "contain", cursor: onFossilClick ? "pointer" : "default" }}
                onClick={onFossilClick ? () => onFossilClick(fossil.id) : undefined}
              />
              <div
                style={{ fontWeight: 600, cursor: onFossilClick ? "pointer" : "default" }}
                onClick={onFossilClick ? () => onFossilClick(fossil.id) : undefined}
              >
                {fossil.name}
              </div>
              <div style={{ fontSize: "0.9em", color: "#4b7f52" }}>{fossil.dinosaurSpecies}</div>
              <div style={{ fontSize: "0.8em", color: "#888" }}>{fossil.rarity}</div>
              {onSellFossil && (
                <button
                  style={{ marginTop: 8, padding: "4px 12px", borderRadius: 4, background: "#ffe066", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "0.9em" }}
                  onClick={e => { e.stopPropagation(); onSellFossil(fossil.id); }}
                >
                  Sell
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryPanel; 