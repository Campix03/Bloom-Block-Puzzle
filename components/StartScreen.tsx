import React, { useRef, useEffect, useState } from 'react';
import { Piece } from '../types';
import { PIECES, COLORS, CELL_SIZE } from '../constants';


interface StartScreenProps {
  onStart: () => void;
  onShowRules: () => void;
  onShowAdventure: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowRules, onShowAdventure }) => {
    const [animatingPiece, setAnimatingPiece] = useState<Piece | null>(null);
    const animCanvasRef = useRef<HTMLCanvasElement>(null);

    // Effect to cycle through pieces
    useEffect(() => {
      const selectNewPiece = () => {
        const randomPieceShape = PIECES[Math.floor(Math.random() * PIECES.length)];
        const colorIndex = Math.floor(Math.random() * COLORS.length);
        setAnimatingPiece({ 
          shape: randomPieceShape, 
          color: COLORS[colorIndex], 
          colorIndex: colorIndex + 1 
        });
      };
    
      selectNewPiece(); // Initial piece
      const intervalId = setInterval(selectNewPiece, 1500); // Change piece every 1.5 seconds
    
      return () => clearInterval(intervalId);
    }, []);
    
    // Effect to draw the piece
    useEffect(() => {
        if (!animatingPiece || !animCanvasRef.current) return;
      
        const canvas = animCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
      
        const piece = animatingPiece.shape;
        const pieceWidth = piece[0].length * CELL_SIZE;
        const pieceHeight = piece.length * CELL_SIZE;
        
        const offsetX = (canvas.width - pieceWidth) / 2;
        const offsetY = (canvas.height - pieceHeight) / 2;
      
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = animatingPiece.color;
      
        for (let r = 0; r < piece.length; r++) {
          for (let c = 0; c < piece[r].length; c++) {
            if (piece[r][c]) {
                const x = offsetX + c * CELL_SIZE;
                const y = offsetY + r * CELL_SIZE;
                const width = CELL_SIZE;
                const height = CELL_SIZE;
                const radius = 8;
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                ctx.fill();
            }
          }
        }
    }, [animatingPiece]);


  return (
    <div className="relative flex flex-col items-center justify-between text-center p-5 max-w-lg w-11/12 h-[80vh] min-h-[500px]">
      <button 
        onClick={onShowRules}
        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black bg-opacity-25 flex items-center justify-center text-2xl font-bold text-white hover:bg-opacity-40 transition-all"
        aria-label="Mostrar reglas"
      >
        ?
      </button>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative mb-8">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                BLOCK
                <br/>
                BLOOM
            </h1>
        </div>

        <canvas
            ref={animCanvasRef}
            width={CELL_SIZE * 5}
            height={CELL_SIZE * 5}
            className="mb-12"
        />
      </div>

      <div className="w-full flex flex-col gap-4 px-4">
        <button 
          onClick={onStart} 
          className="flex items-center justify-center gap-3 w-full py-4 px-8 bg-green-500 text-white rounded-xl font-bold text-2xl uppercase shadow-lg transition-all duration-200 hover:bg-green-600 hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Clásico
        </button>
        <button 
          onClick={onShowAdventure} 
          className="flex items-center justify-center gap-3 w-full py-4 px-8 bg-gray-700 text-gray-400 rounded-xl font-bold text-2xl uppercase shadow-lg cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Aventura
        </button>
      </div>
    </div>
  );
};

export default StartScreen;