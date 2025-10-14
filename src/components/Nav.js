import React from 'react';

const Nav = ({ setView, currentView }) => {
  const navItems = [
    { name: 'Home', view: 'home', icon: '🏠' },
    { name: 'Course', view: 'course', icon: '📚' },
    { name: 'Leaderboard', view: 'leaderboard', icon: '🏆' }
  ];

  return (
    <div className="flex justify-around p-2 bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10 md:static md:border-none md:p-0">
      {navItems.map(item => (
        <button
          key={item.view}
          onClick={() => setView(item.view)}
          className={`flex flex-col items-center flex-1 py-1 px-2 text-center text-sm font-bold transition-colors duration-150 rounded-lg ${
            currentView === item.view
              ? 'text-red-600 bg-red-100 md:bg-red-600 md:text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <span className="text-xl md:hidden">{item.icon}</span>
          <span className="mt-0.5">{item.name}</span>
        </button>
      ))}
    </div>
  );
};

export default Nav;
