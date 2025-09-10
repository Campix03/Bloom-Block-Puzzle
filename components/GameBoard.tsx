import React, { useRef, useEffect, forwardRef } from 'react';
import { Grid, Piece, Position } from '../types';
import { COLS, ROWS, CELL_SIZE, COLORS, DETONABLE_COLOR } from '../constants';

interface GameBoardProps {
  grid: Grid;
  detonableRows: number[];
  detonableCols: number[];
  ghostPiece: Piece | null | undefined;
  ghostPosition: Position | { row: number; col: number } | null;
}

const GameBoard = forwardRef<HTMLCanvasElement, GameBoardProps>((
  { grid, detonableRows, detonableCols, ghostPiece, ghostPosition }, 
  ref
) => {
  const internalRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = (ref || internalRef) as React.RefObject<HTMLCanvasElement>;

  const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
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
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cellValue = grid[r][c];
        ctx.fillStyle = cellValue > 0 ? COLORS[cellValue - 1] : 'rgba(0, 0, 0, 0.2)';
        drawCell(ctx, c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE, 8);

        if (cellValue > 0) {
            ctx.strokeStyle = 'rgba(0,0,0,0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
      }
    }
    
    // Highlight detonable lines with rounded cells
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = DETONABLE_COLOR;
    detonableRows.forEach(r => {
      for (let c = 0; c < COLS; c++) {
        drawCell(ctx, c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE, 8);
      }
    });
    detonableCols.forEach(c => {
      for (let r = 0; r < ROWS; r++) {
        drawCell(ctx, c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE, 8);
      }
    });
    ctx.globalAlpha = 1.0;


    // Draw ghost piece (now opaque and styled like a real piece)
    if (ghostPiece && ghostPosition) {
        const { row: startRow, col: startCol } = ghostPosition as { row: number; col: number };
        ctx.fillStyle = ghostPiece.color;
        for (let r = 0; r < ghostPiece.shape.length; r++) {
            for (let c = 0; c < ghostPiece.shape[r].length; c++) {
                if (ghostPiece.shape[r][c]) {
                    const x = (startCol + c) * CELL_SIZE;
                    const y = (startRow + r) * CELL_SIZE;
                    drawCell(ctx, x, y, CELL_SIZE, CELL_SIZE, 8);
                    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

  }, [grid, detonableRows, detonableCols, ghostPiece, ghostPosition, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      width={COLS * CELL_SIZE}
      height={ROWS * CELL_SIZE}
      className="bg-black bg-opacity-20 rounded-xl shadow-inner"
    />
  );
});

export default GameBoard;