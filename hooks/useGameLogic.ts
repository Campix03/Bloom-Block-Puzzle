import { useState, useEffect, useCallback } from 'react';
import { Piece, Grid } from '../types';
import { COLS, ROWS, INITIAL_SHUFFLES, PIECES, COLORS } from '../constants';

export const useGameLogic = () => {
  const [grid, setGrid] = useState<Grid>(() => Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('blockBlastHighScore') || 0));
  const [shufflesLeft, setShufflesLeft] = useState(INITIAL_SHUFFLES);
  const [detonableRows, setDetonableRows] = useState<number[]>([]);
  const [detonableCols, setDetonableCols] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState<{ title: string; text: string } | null>(null);

  const updateScore = useCallback((points: number) => {
    setScore(prev => {
      const newScore = prev + points;
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('blockBlastHighScore', String(newScore));
      }
      return newScore;
    });
  }, [highScore]);

  const canPlace = useCallback((piece: Piece, startRow: number, startCol: number, currentGrid: Grid) => {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const boardRow = startRow + r;
          const boardCol = startCol + c;
          if (boardRow >= ROWS || boardCol >= COLS || boardRow < 0 || boardCol < 0 || currentGrid[boardRow][boardCol] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const checkIfPieceCanBePlaced = useCallback((piece: Piece, currentGrid: Grid) => {
    for (let r = 0; r <= ROWS - piece.shape.length; r++) {
      for (let c = 0; c <= COLS - piece.shape[0].length; c++) {
        if (canPlace(piece, r, c, currentGrid)) {
          return true;
        }
      }
    }
    return false;
  }, [canPlace]);

  const generateNewPiece = useCallback(() => {
    const randomPieceShape = PIECES[Math.floor(Math.random() * PIECES.length)];
    const colorIndex = Math.floor(Math.random() * COLORS.length);
    return { shape: randomPieceShape, color: COLORS[colorIndex], colorIndex: colorIndex + 1 };
  }, []);

  const initializePieces = useCallback(() => {
    setPieces(Array.from({ length: 3 }, generateNewPiece));
  }, [generateNewPiece]);

  const checkAndMarkLines = useCallback((currentGrid: Grid) => {
    const newDetonableRows: number[] = [];
    const newDetonableCols: number[] = [];

    for (let r = 0; r < ROWS; r++) {
      if (currentGrid[r].every(cell => cell !== 0)) {
        newDetonableRows.push(r);
      }
    }
    for (let c = 0; c < COLS; c++) {
      if (currentGrid.every(row => row[c] !== 0)) {
        newDetonableCols.push(c);
      }
    }
    setDetonableRows(newDetonableRows);
    setDetonableCols(newDetonableCols);
  }, []);

  const placePiece = useCallback((piece: Piece, startRow: number, startCol: number, pieceIndex: number) => {
    const newGrid = grid.map(row => [...row]);
    let points = 0;
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          newGrid[startRow + r][startCol + c] = piece.colorIndex;
          points++;
        }
      }
    }
    setGrid(newGrid);
    updateScore(points);

    let newPieces = pieces.filter((_, index) => index !== pieceIndex);
    if (newPieces.length === 0) {
        newPieces = Array.from({ length: 3 }, generateNewPiece);
    }
    setPieces(newPieces);
    checkAndMarkLines(newGrid);
  }, [grid, pieces, updateScore, generateNewPiece, checkAndMarkLines]);

  const detonateLines = useCallback(() => {
    const linesCleared = detonableRows.length + detonableCols.length;
    if (linesCleared === 0) {
      setMessage({ title: 'Sin líneas listas', text: 'Coloca un bloque para completar una línea y marcarla para la detonación.' });
      return;
    }

    const newGrid = grid.map(row => [...row]);
    detonableRows.forEach(r => newGrid[r].fill(0));
    detonableCols.forEach(c => newGrid.forEach(row => (row[c] = 0)));

    setGrid(newGrid);
    updateScore(linesCleared * 10);
    setDetonableRows([]);
    setDetonableCols([]);
  }, [grid, detonableRows, detonableCols, updateScore]);
  
  const shufflePieces = useCallback(() => {
      if (shufflesLeft > 0) {
          setShufflesLeft(prev => prev - 1);
          initializePieces();
      }
  }, [shufflesLeft, initializePieces]);

  const grantShuffles = useCallback(() => {
    setMessage(null);
    setShufflesLeft(INITIAL_SHUFFLES);
    initializePieces();
  }, [initializePieces]);

  const restartGame = useCallback(() => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setScore(0);
    setShufflesLeft(INITIAL_SHUFFLES);
    setDetonableRows([]);
    setDetonableCols([]);
    setIsGameOver(false);
    setMessage(null);
    initializePieces();
  }, [initializePieces]);

  useEffect(() => {
    const hasPossibleMoves = pieces.some(piece => checkIfPieceCanBePlaced(piece, grid));
    if (!hasPossibleMoves && shufflesLeft === 0 && pieces.length > 0) {
      setIsGameOver(true);
      setMessage({ title: 'Fin del juego', text: `Tu puntuación final es: ${score}. Te has quedado sin movimientos y no puedes barajar más.` });
    }
  }, [pieces, grid, shufflesLeft, score, checkIfPieceCanBePlaced]);
  
  useEffect(() => {
    initializePieces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    grid,
    pieces,
    score,
    highScore,
    shufflesLeft,
    detonableRows,
    detonableCols,
    isGameOver,
    message,
    placePiece,
    detonateLines,
    shufflePieces,
    grantShuffles,
    restartGame,
    canPlace,
    checkIfPieceCanBePlaced,
    setMessage
  };
};