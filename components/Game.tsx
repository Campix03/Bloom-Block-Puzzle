import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { useAds } from '../hooks/useAds';
import GameBoard from './GameBoard';
import PiecePreview from './PiecePreview';
import InfoPanel from './InfoPanel';
import Controls from './Controls';
import MessageBox from './MessageBox';
import AdBanner from './AdBanner';
import { Piece } from '../types';

interface GameProps {
  onGoHome: () => void;
}

const Game: React.FC<GameProps> = ({ onGoHome }) => {
  const {
    grid, pieces, score, highScore, shufflesLeft, detonableRows, detonableCols,
    isGameOver, message, placePiece, detonateLines, shufflePieces, grantShuffles,
    restartGame, canPlace, checkIfPieceCanBePlaced, setMessage
  } = useGameLogic();

  const { showRewardedAd } = useAds();
  const [draggedItem, setDraggedItem] = useState<{ piece: Piece; index: number } | null>(null);
  const [ghostPosition, setGhostPosition] = useState<{ row: number; col: number } | null>(null);
  const [adState, setAdState] = useState<'idle' | 'loading' | 'rewarding'>('idle');

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDragStart = (piece: Piece, index: number, e: React.MouseEvent | React.TouchEvent) => {
    if (isGameOver || !checkIfPieceCanBePlaced(piece, grid)) return;
    setDraggedItem({ piece, index });
  };
  
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!draggedItem) return;
    const isTouchEvent = 'touches' in e;
    const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
    const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;

    if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        const col = Math.floor(mouseX / 30);
        const row = Math.floor(mouseY / 30);

        if (canPlace(draggedItem.piece, row, col, grid)) {
            setGhostPosition({ row, col });
        } else {
            setGhostPosition(null);
        }
    }
  }, [draggedItem, grid, canPlace]);
  
  const handleDragEnd = useCallback(() => {
    if (!draggedItem || !ghostPosition) {
        setDraggedItem(null);
        setGhostPosition(null);
        return;
    }
    
    placePiece(draggedItem.piece, ghostPosition.row, ghostPosition.col, draggedItem.index);
    setDraggedItem(null);
    setGhostPosition(null);
  }, [draggedItem, ghostPosition, placePiece]);

  const handleShuffleClick = () => {
    if (shufflesLeft > 0) {
      shufflePieces();
    } else {
      setAdState('loading');
      setMessage({ title: 'Cargando Anuncio...', text: 'Mira un video para obtener 3 barajas más.' });
      showRewardedAd({
        onReward: () => {
          setAdState('rewarding');
          setMessage({ title: '¡Recompensa Obtenida!', text: 'Has recibido 3 barajas nuevas.' });
          grantShuffles();
          setTimeout(() => {
            setMessage(null);
            setAdState('idle');
          }, 2000);
        },
        onFail: () => {
          setAdState('idle');
          setMessage({ title: 'Error', text: 'El anuncio no se pudo cargar. Inténtalo de nuevo más tarde.' });
        }
      });
    }
  };

  const handleMessageClose = () => {
    if (isGameOver && adState !== 'rewarding') {
      setAdState('loading');
      setMessage({ title: 'Viendo Anuncio...', text: '¡Gracias por jugar! El juego se reiniciará después del anuncio.' });
      showRewardedAd({
        onReward: restartGame,
        onFail: () => {
          setAdState('idle');
          setMessage({ title: 'Error', text: 'No se pudo cargar el anuncio para reiniciar. Vuelve al inicio.' });
        }
      });
    } else {
      setMessage(null);
    }
  };

  useEffect(() => {
    if (draggedItem) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [draggedItem, handleDragMove, handleDragEnd]);

  const isButtonDisabled = adState === 'loading' || adState === 'rewarding';

  return (
    <>
      <div ref={gameContainerRef} className="relative flex flex-col items-center gap-5 p-5 bg-black bg-opacity-20 rounded-2xl shadow-lg max-w-lg w-11/12">
        <button
          onClick={onGoHome}
          className="absolute top-5 left-5 text-white hover:text-cyan-300 transition-colors duration-200 z-10"
          aria-label="Volver al inicio"
          title="Volver al inicio"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
          </svg>
        </button>
        <InfoPanel score={score} highScore={highScore} />
        <GameBoard
          ref={canvasRef}
          grid={grid}
          detonableRows={detonableRows}
          detonableCols={detonableCols}
          ghostPiece={draggedItem?.piece}
          ghostPosition={ghostPosition}
        />
        <div className="w-full">
          <h3 className="text-lg font-bold text-center mb-2 select-none">PRÓXIMAS PIEZAS</h3>
          <div className="flex flex-row justify-center items-center gap-4 p-5 bg-black bg-opacity-20 rounded-2xl shadow-inner flex-wrap">
            {pieces.map((piece, index) => (
              <PiecePreview
                key={index}
                piece={piece}
                onDragStart={(e) => handleDragStart(piece, index, e)}
                canBePlaced={checkIfPieceCanBePlaced(piece, grid)}
                isHidden={draggedItem?.index === index}
              />
            ))}
          </div>
        </div>
        <Controls
          onDetonate={detonateLines}
          onShuffle={handleShuffleClick}
          shufflesLeft={shufflesLeft}
          isGameOver={isGameOver}
        />
         <AdBanner />
      </div>

      {message && (
        <MessageBox 
          title={message.title} 
          text={message.text} 
          onClose={handleMessageClose}
          buttonText={isGameOver && !isButtonDisabled ? 'VOLVER A JUGAR' : 'CERRAR'}
          isButtonDisabled={isButtonDisabled}
        />
      )}
    </>
  );
};

export default Game;