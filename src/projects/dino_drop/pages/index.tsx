import React from "react";
import DinoGame from "../components/DinoGame";

const DinoDropPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-yellow-100 to-green-200 p-4">
      <h1 className="text-4xl font-bold mb-4">Dino Drop</h1>
      <DinoGame />
    </div>
  );
};

export default DinoDropPage; 