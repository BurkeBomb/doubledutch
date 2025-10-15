import React from 'react';

const Button = ({ children, onClick, className = '', disabled = false, primary = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 font-bold text-lg rounded-xl transition-all duration-200 shadow-lg transform active:scale-95
        ${primary
          ? 'bg-red-600 hover:bg-red-700 text-white border-b-4 border-red-800 disabled:bg-gray-400 disabled:border-gray-500'
          : 'bg-white hover:bg-gray-100 text-gray-800 border-b-4 border-gray-300 disabled:bg-gray-100 disabled:border-gray-200'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
