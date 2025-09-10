import React, { useRef, useEffect } from 'react';
import { Piece } from '../types';
import { CELL_SIZE } from '../constants';

interface PiecePreviewProps {
  piece: Piece;
  onDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
  canBePlaced?: boolean;
  isHidden?: boolean;
}

const PiecePreview: React.FC<PiecePreviewProps> = ({ piece, onDragStart, canBePlaced = true, isHidden = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pieceWidth = piece.shape[0].length * CELL_SIZE;
  const pieceHeight = piece.shape.length * CELL_SIZE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = piece.color;
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const x = c * CELL_SIZE;
          const y = r * CELL_SIZE;
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
  }, [piece, pieceHeight, pieceWidth]);

  const classes = `
    cursor-grab border-2 border-transparent rounded-lg transition-transform duration-200 
    ${canBePlaced ? 'hover:scale-110 hover:border-[#66ff99] hover:shadow-lg hover:shadow-[#66ff99]/50' : 'opacity-50 cursor-not-allowed'}
  `;

  return (
    <div
      className={classes}
      style={{ visibility: isHidden ? 'hidden' : 'visible' }}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
    >
      <canvas
        ref={canvasRef}
        width={pieceWidth}
        height={pieceHeight}
      />
    </div>
  );
};

export default PiecePreview;