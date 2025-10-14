import React from 'react';

const LeaderboardPage = ({ leaderboard, userId, AVATAR_MAP }) => {
  return (
    <div className="p-4 space-y-4 flex-grow overflow-y-auto pb-20">
      <h1 className="text-3xl font-black text-red-600 border-b-4 border-yellow-400 pb-2 mb-4">Global XP Leaderboard 🏆</h1>
      {leaderboard.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Loading brave learners...</p>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((user, i) => (
            <div
              key={user.id}
              className={`flex items-center p-4 rounded-xl shadow-md transition-all duration-300 ${
                user.isCurrentUser ? 'bg-yellow-200 border-l-8 border-red-600 scale-[1.01]' : 'bg-white hover:bg-gray-50 ring-1 ring-gray-100'
              }`}
            >
              <span className="text-2xl font-black w-8 text-center text-gray-600">#{i + 1}</span>
              <span className="text-3xl mx-4">{AVATAR_MAP[user.avatar] || AVATAR_MAP.bear}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${user.isCurrentUser ? 'text-red-700' : 'text-gray-800'}`}>
                  {user.isCurrentUser ? 'You (Me)' : `Learner ${user.id.substring(0, 8)}...`}
                </p>
                <p className="text-xs text-gray-500">ID: {user.id}</p>
              </div>
              <span className="text-xl font-bold text-red-600">{user.xp} XP</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-center text-gray-500 pt-4">Your Full User ID: {userId}</p>
    </div>
  );
};

export default LeaderboardPage;
