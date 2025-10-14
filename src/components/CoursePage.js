import React from 'react';
import Button from './Button';

const CoursePage = ({ COURSE_DATA, setView, setSelectedLevel, userData }) => {
  const hasLevels = Array.isArray(COURSE_DATA) && COURSE_DATA.length > 0;
  const levelProgress = userData?.levelProgress ?? {};
  if (!hasLevels) {
    return (
      <div className="p-8 space-y-6 flex-grow overflow-y-auto pb-20 text-center">
        <h1 className="text-3xl font-black text-red-600 border-b-4 border-yellow-400 pb-2 mb-8">
          DoubleDutch Course Map
        </h1>
        <span className="text-6xl block mb-4">✍️</span>
        <p className="text-xl text-gray-600 font-semibold">No levels found!</p>
        <p className="text-gray-500">The course map is currently empty. Add new levels to start learning!</p>
      </div>
    );
  }

  // Check if level‑1 is done to unlock others
  const isLevel1Completed = Boolean(levelProgress['level-1']?.completed);

  const renderLevelCard = (level) => {
    const isCompleted = Boolean(levelProgress[level.id]?.completed);
    const isLocked = level.id !== 'level-1' && !isLevel1Completed;
    const buttonText = isCompleted ? 'Review Lesson' : 'Start Lesson';

    return (
      <div
        key={level.id}
        className={`
          p-5 rounded-2xl shadow-xl border-t-4 transition-all duration-300 transform
          ${isLocked
            ? 'bg-gray-200 border-gray-400 opacity-70'
            : isCompleted
            ? 'bg-white border-green-500 hover:shadow-2xl hover:-translate-y-0.5'
            : 'bg-white border-red-500 hover:shadow-2xl hover:-translate-y-0.5'
          }
        `}
      >
        <div className="flex items-center mb-3">
          <span
            className={`text-3xl p-2 rounded-full mr-3 shadow-inner ${
              isCompleted ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
            }`}
          >
            {isLocked ? '🔒' : isCompleted ? '✅' : '🌟'}
          </span>
          <h2 className="text-xl font-bold text-gray-800">{level.title}</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">{level.theme}</p>
        <div className="mt-auto">
          <p className="text-xs text-gray-500 mb-3">
            Reward: <span className="font-extrabold text-red-600">+{level.xpReward} XP</span>
          </p>
          <Button
            primary
            disabled={isLocked}
            onClick={() => {
              setSelectedLevel(level);
              setView('lesson');
            }}
            className={`w-full rounded-2xl ${
              isCompleted ? '!bg-green-600 !border-green-800' : ''
            } ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {isLocked ? 'Locked (Complete Module 1)' : buttonText}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6 flex-grow overflow-y-auto pb-20">
      <h1 className="text-3xl font-black text-red-600 border-b-4 border-yellow-400 pb-2 mb-4">
        DoubleDutch Course Map
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COURSE_DATA.map(renderLevelCard)}
      </div>
    </div>
  );
};

export default CoursePage;
