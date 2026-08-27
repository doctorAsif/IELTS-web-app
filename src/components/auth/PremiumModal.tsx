import React from 'react';
import { Lock, Crown } from 'lucide-react';

interface PremiumModalProps {
  onClose?: () => void;
  message?: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ 
  onClose,
  message = "You've reached your free practice limit!" 
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/30">
          <Crown className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-[#00205B] mb-3">{message}</h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          Please verify your account or upgrade to continue practicing and improving your IELTS score.
        </p>

        <div className="w-full space-y-4">
          <button
            onClick={() => alert("Authentication / Premium flow to be implemented!")}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-yellow-500/20 active:scale-95"
          >
            <Lock className="w-5 h-5" />
            <span>Authenticate to Continue</span>
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl transition-all active:scale-95"
            >
              Maybe Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
