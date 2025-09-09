import React from 'react';

interface ControlsProps {
  onDetonate: () => void;
  onShuffle: () => void;
  shufflesLeft: number;
  isGameOver: boolean;
}

const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button
    {...props}
    className="py-2 px-4 bg-blue-600 text-white rounded-xl font-bold uppercase shadow-md transition-all duration-200 hover:enabled:bg-blue-700 hover:enabled:transform hover:enabled:-translate-y-0.5 disabled:bg-gray-600 disabled:cursor-not-allowed"
  />
);

const Controls: React.FC<ControlsProps> = ({ onDetonate, onShuffle, shufflesLeft, isGameOver }) => {
  return (
    <div className="flex gap-2 justify-center mt-5 w-full flex-wrap">
      <ActionButton onClick={onDetonate} disabled={isGameOver}>ELIMINAR LÍNEA</ActionButton>
      <ActionButton onClick={onShuffle} disabled={isGameOver}>
        {shufflesLeft > 0 ? `BARAJAR (${shufflesLeft})` : 'VER ANUNCIO'}
      </ActionButton>
    </div>
  );
};

export default Controls;