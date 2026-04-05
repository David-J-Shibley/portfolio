import React from "react";
import { DigSite } from "../types/gameTypes";

interface Props {
  sites: DigSite[];
  currentSiteId: string;
  onSelect: (siteId: string) => void;
}

const SiteSelector: React.FC<Props> = ({ sites, currentSiteId, onSelect }) => {
  return (
    <div style={{ margin: "24px 0" }}>
      <h3>Choose Dig Site</h3>
      <div style={{ display: "flex", gap: 24 }}>
        {sites.map(site => (
          <div
            key={site.id}
            style={{
              border: site.id === currentSiteId ? "2px solid #4b7f52" : "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
              minWidth: 160,
              background: site.unlocked ? "#fff" : "#eee",
              opacity: site.unlocked ? 1 : 0.5,
              cursor: site.unlocked ? "pointer" : "not-allowed",
              boxShadow: site.id === currentSiteId ? "0 2px 8px #4b7f5233" : "0 1px 4px #0001"
            }}
            onClick={() => site.unlocked && onSelect(site.id)}
          >
            <img src={site.imageUrl} alt={site.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 4 }} />
            <div style={{ fontWeight: 600, marginTop: 8 }}>{site.name}</div>
            <div style={{ fontSize: "0.9em", color: "#888" }}>{site.description}</div>
            <div style={{ fontSize: "0.8em", color: "#4b7f52", marginTop: 4 }}>{site.difficulty}</div>
            {!site.unlocked && <div style={{ color: "#b00", fontSize: "0.8em", marginTop: 4 }}>Locked</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteSelector; 