import React from "react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Props {
  achievements: Achievement[];
  unlockedIds: string[];
}

const AchievementsPanel: React.FC<Props> = ({ achievements, unlockedIds }) => {
  const unlocked = achievements.filter(a => unlockedIds.includes(a.id));
  const locked = achievements.filter(a => !unlockedIds.includes(a.id));
  return (
    <div style={{ marginTop: 32 }}>
      <h3>Achievements</h3>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
        {unlocked.map(a => (
          <div
            key={a.id}
            title={a.name}
            style={{
              border: "2px solid #4b7f52",
              borderRadius: 8,
              padding: 16,
              minWidth: 180,
              background: "#e6ffe6",
              opacity: 1,
              textAlign: "center",
              boxShadow: "0 2px 8px #4b7f5233",
              animation: "pop 0.5s",
              transition: "box-shadow 0.2s, border 0.2s"
            }}
          >
            <div style={{ fontSize: 32 }}>{a.icon}</div>
            <div style={{ fontWeight: 600, marginTop: 8 }}>{a.name}</div>
            <div style={{ fontSize: "0.9em", color: "#4b7f52", marginTop: 4 }}>{a.description}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", opacity: 0.7 }}>
        {locked.map(a => (
          <div
            key={a.id}
            title={a.name}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
              minWidth: 180,
              background: "#fff",
              textAlign: "center",
              boxShadow: "0 1px 4px #0001"
            }}
          >
            <div style={{ fontSize: 32 }}>{a.icon}</div>
            <div style={{ fontWeight: 600, marginTop: 8 }}>{a.name}</div>
            <div style={{ fontSize: "0.9em", color: "#888", marginTop: 4 }}>{a.description}</div>
            <div style={{ color: "#b00", fontSize: "0.8em", marginTop: 4 }}>Locked</div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pop {
          0% { transform: scale(0.8); box-shadow: 0 0 0 #4b7f5200; }
          60% { transform: scale(1.1); box-shadow: 0 0 16px #4b7f5266; }
          100% { transform: scale(1); box-shadow: 0 2px 8px #4b7f5233; }
        }
      `}</style>
    </div>
  );
};

export default AchievementsPanel; 