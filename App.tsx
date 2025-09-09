import React, { useState, useCallback } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import MessageBox from './components/MessageBox';

function App() {
  const [gameState, setGameState] = useState<'start' | 'playing'>('start');
  const [isRulesVisible, setIsRulesVisible] = useState(false);
  const [isAdventureModalVisible, setIsAdventureModalVisible] = useState(false);

  const startGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const goHome = useCallback(() => {
    setGameState('start');
  }, []);

  const backgroundClass = 'bg-gradient-to-br from-blue-500 to-indigo-600';

  const rulesText = `Las reglas son simples: arrastra las piezas al tablero para completar líneas o columnas y ganar puntos. Si te quedas sin movimientos, puedes usar una de tus 3 barajas iniciales para obtener nuevas piezas. El botón de Eliminar Línea es ilimitado, pero solo funciona cuando tienes al menos una línea completa en el tablero. ¡Úsalo para despejar el espacio!`;

  return (
    <div className={`min-h-screen text-white flex flex-col items-center justify-center p-4 transition-colors duration-500 ${backgroundClass}`}>
      {gameState === 'start' && (
        <StartScreen 
          onStart={startGame} 
          onShowRules={() => setIsRulesVisible(true)}
          onShowAdventure={() => setIsAdventureModalVisible(true)}
        />
      )}
      {gameState === 'playing' && <Game onGoHome={goHome} />}

      {isRulesVisible && (
        <MessageBox
          title="Reglas del Juego"
          text={rulesText}
          onClose={() => setIsRulesVisible(false)}
          buttonText="ENTENDIDO"
        />
      )}

      {isAdventureModalVisible && (
        <MessageBox
          title="Modo Aventura"
          text="¡El modo Aventura llegará muy pronto! Prepárate para nuevos desafíos."
          onClose={() => setIsAdventureModalVisible(false)}
          buttonText="OK"
        />
      )}
    </div>
  );
}

export default App;