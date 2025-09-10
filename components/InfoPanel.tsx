
import React from 'react';

interface InfoPanelProps {
  score: number;
  highScore: number;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ score, highScore }) => {
  return (
    <div className="flex justify-between items-center w-full gap-2">
      <div className="flex items-center gap-2 bg-black bg-opacity-25 rounded-xl p-2 px-4 font-bold text-white">
        <span className="text-2xl" role="img" aria-label="crown">👑</span>
        <span className="text-xl">{highScore}</span>
      </div>
      <div className="bg-black bg-opacity-25 rounded-xl p-2 text-center flex-grow">
        <div className="text-sm text-gray-200">PUNTOS</div>
        <div className="text-4xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)]">{score}</div>
      </div>
    </div>
  );
};

export default InfoPanel;