
import React from 'react';
import Button from './Button';

const HomePage = ({ setView }) => {
  return (
    <div className="relative flex-grow overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage:
            'linear-gradient(135deg, #1c3d5e 0%, #4a7dcc 100%)'
        }}
      >
        <div className="absolute inset-0 opacity-10"></div>
      </div>
      <div className="relative z-10 p-6 text-center space-y-8 flex-grow flex flex-col justify-center items-center h-full">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm border-t-8 border-yellow-400 transform transition-transform duration-300">
          <span className="text-7xl block mb-4">🇳🇱🇿🇦</span>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Double Dutch Language</h1>
          <p className="text-gray-600 mb-6 font-medium">
            Master the sister languages, Dutch and Afrikaans, through engaging lessons and poetry.
          </p>
          <Button primary onClick={() => setView('course')} className="w-full rounded-2xl">
            Begin Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
