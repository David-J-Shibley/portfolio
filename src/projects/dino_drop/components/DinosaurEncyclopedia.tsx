import React, { useState } from "react";
import { FossilPieceType } from "../types/gameTypes";

interface DinoStatus {
  name: string;
  requiredPieces: FossilPieceType[];
  piecesCollected: FossilPieceType[];
  piecesMissing: FossilPieceType[];
  completed: boolean;
  facts: string[];
}

interface Props {
  collectionStatus: DinoStatus[];
}

const pieceIcons: Record<FossilPieceType, string> = {
  skull: "🦴",
  rib: "🦴",
  tail: "🦴",
  vertebrae: "🦴",
  limb: "🦴"
};

const DinosaurEncyclopedia: React.FC<Props> = ({ collectionStatus }) => {
  const [selected, setSelected] = useState<DinoStatus | null>(null);
  return (
    <div style={{ marginTop: 32 }}>
      <h3>Dinosaur Encyclopedia</h3>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {collectionStatus.map(dino => (
          <div
            key={dino.name}
            style={{
              border: dino.completed ? "2px solid #4b7f52" : "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
              minWidth: 180,
              background: dino.completed ? "#e6ffe6" : "#fff",
              opacity: dino.completed ? 1 : 0.8,
              cursor: "pointer",
              boxShadow: dino.completed ? "0 2px 8px #4b7f5233" : "0 1px 4px #0001",
              textAlign: "center"
            }}
            onClick={() => setSelected(dino)}
          >
            <div style={{ fontWeight: 600, fontSize: "1.1em" }}>{dino.name}</div>
            <div style={{ margin: "8px 0" }}>
              {dino.requiredPieces.map(piece => (
                <span key={piece} style={{ margin: "0 2px", color: dino.piecesCollected.includes(piece) ? "#4b7f52" : "#bbb", fontSize: 24 }}>
                  {pieceIcons[piece]} {piece}
                </span>
              ))}
            </div>
            <div style={{ fontSize: "0.9em", color: dino.completed ? "#4b7f52" : "#888" }}>
              {dino.completed ? "Completed!" : `${dino.piecesCollected.length} / ${dino.requiredPieces.length} pieces`}
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div style={{
          position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fffbe9", borderRadius: 8, padding: 32, minWidth: 320, boxShadow: "0 2px 16px #0002", textAlign: "center" }}>
            <h3>{selected.name}</h3>
            <div style={{ margin: "12px 0" }}>
              {selected.requiredPieces.map(piece => (
                <span key={piece} style={{ margin: "0 4px", color: selected.piecesCollected.includes(piece) ? "#4b7f52" : "#bbb", fontSize: 28 }}>
                  {pieceIcons[piece]} {piece}
                </span>
              ))}
            </div>
            <div style={{ margin: "12px 0", fontWeight: 600, color: selected.completed ? "#4b7f52" : "#888" }}>
              {selected.completed ? "You have completed this dinosaur!" : `Missing: ${selected.piecesMissing.join(", ")}`}
            </div>
            <div style={{ margin: "16px 0", textAlign: "left" }}>
              <h4>Fun Facts:</h4>
              <ul style={{ paddingLeft: 24 }}>
                {selected.facts.map((fact, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{fact}</li>
                ))}
              </ul>
            </div>
            <button style={{ marginTop: 16, padding: "8px 24px", borderRadius: 4, background: "#b5e7a0", border: "none", fontWeight: 600, cursor: "pointer" }} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DinosaurEncyclopedia; 