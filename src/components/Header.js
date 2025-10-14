import React from 'react';

const Header = ({ userId, currentXP, avatar, AVATAR_MAP }) => {
  const emoji = AVATAR_MAP[avatar] || AVATAR_MAP['bear'];
  return (
    <div className="flex justify-between items-center p-4 bg-red-600 shadow-xl z-20 sticky top-0">
      <div className="flex items-center space-x-3">
        <span className="inline-block text-3xl p-1 bg-white rounded-full shadow-md">{emoji}</span>
        <div>
          <p className="text-xl font-black text-white tracking-tight">Double Dutch</p>
          <p className="text-xs text-red-200 truncate max-w-28">
            Learner ID: {userId ? userId.substring(0, 8) : '…'}
          </p>
        </div>
      </div>
      <div className="flex items-center bg-white p-2 rounded-xl shadow-inner text-gray-800 font-bold">
        <span className="text-sm font-semibold text-red-600 mr-2">XP:</span>
        <p className="text-2xl font-extrabold text-red-600">{currentXP ?? 0}</p>
      </div>
    </div>
  );
};

export default Header;
