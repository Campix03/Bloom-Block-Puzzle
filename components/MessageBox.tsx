import React from 'react';

interface MessageBoxProps {
  title: string;
  text: string;
  buttonText?: string;
  onClose: () => void;
  isButtonDisabled?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ title, text, buttonText = 'Cerrar', onClose, isButtonDisabled = false }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="flex flex-col items-center gap-5 bg-gradient-to-br from-indigo-800 to-indigo-900 border-2 border-cyan-400 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-4xl font-bold text-cyan-300 drop-shadow-[0_0_8px_#67e8f9]">{title}</h2>
        <p className="text-lg text-gray-200">{text}</p>
        <button
          onClick={onClose}
          disabled={isButtonDisabled}
          className="mt-4 py-2 px-6 bg-pink-500 text-white rounded-lg font-bold transition-colors duration-200 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {buttonText.toUpperCase()}
        </button>
      </div>
    </div>
  );
};

export default MessageBox;