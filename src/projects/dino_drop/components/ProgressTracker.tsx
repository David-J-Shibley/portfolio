import React from "react";

interface Props {
  fossilsDiscovered: number;
  dinosaursCompleted: number;
  sitesUnlocked: number;
  totalAchievements: number;
  achievementsUnlocked: number;
}

const ProgressTracker: React.FC<Props> = ({ fossilsDiscovered, dinosaursCompleted, sitesUnlocked, totalAchievements, achievementsUnlocked }) => {
  return (
    <div style={{ marginTop: 32, marginBottom: 32, background: "#f5e9da", borderRadius: 8, padding: 24, maxWidth: 480, boxShadow: "0 1px 8px #0001", textAlign: "center" }}>
      <h3>Progress Tracker</h3>
      <div style={{ display: "flex", justifyContent: "space-around", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{fossilsDiscovered}</div>
          <div style={{ color: "#888" }}>Fossils Discovered</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{dinosaursCompleted}</div>
          <div style={{ color: "#888" }}>Dinosaurs Completed</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{sitesUnlocked}</div>
          <div style={{ color: "#888" }}>Sites Unlocked</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{achievementsUnlocked} / {totalAchievements}</div>
          <div style={{ color: "#888" }}>Achievements</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker; 