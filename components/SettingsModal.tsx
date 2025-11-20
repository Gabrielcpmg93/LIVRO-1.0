import React from 'react';
import { X, Moon, Sun, Bell, User, Globe, Shield, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isDarkMode, toggleTheme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configurações</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Optimized Appearance Section */}
          <section>
            <h3 className="text-xs font-bold text-primary mb-4 uppercase tracking-wider">Tema do Aplicativo</h3>
            
            <div className="grid grid-cols-2 gap-4">
                {/* Light Mode Option */}
                <button 
                    onClick={() => isDarkMode && toggleTheme()}
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        !isDarkMode 
                        ? 'border-primary bg-green-50 dark:bg-transparent' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                    <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-1 shadow-inner border border-gray-200">
                        <Sun size={28} className="text-orange-500" />
                    </div>
                    <span className={`font-medium ${!isDarkMode ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>Claro</span>
                    {!isDarkMode && (
                        <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-0.5">
                            <Check size={12} />
                        </div>
                    )}
                </button>

                {/* Dark Mode Option */}
                <button 
                    onClick={() => !isDarkMode && toggleTheme()}
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        isDarkMode 
                        ? 'border-primary bg-green-900/10' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                    <div className="w-full h-20 bg-gray-800 rounded-lg flex items-center justify-center mb-1 shadow-inner border border-gray-700">
                        <Moon size={28} className="text-blue-400" />
                    </div>
                    <span className={`font-medium ${isDarkMode ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>Escuro</span>
                    {isDarkMode && (
                        <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-0.5">
                            <Check size={12} />
                        </div>
                    )}
                </button>
            </div>
          </section>

          {/* General Settings (Mock) */}
          <section>
             <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">Geral</h3>
             <div className="space-y-1">
                <SettingsItem icon={Bell} label="Notificações" value="Ligado" />
                <SettingsItem icon={Globe} label="Idioma" value="Português (BR)" />
                <SettingsItem icon={User} label="Conta" value="Perfil" />
                <SettingsItem icon={Shield} label="Privacidade" value="Dados" />
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const SettingsItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Icon size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="font-medium">{label}</span>
        </div>
        <span className="text-sm text-gray-400 font-medium">{value}</span>
    </div>
);