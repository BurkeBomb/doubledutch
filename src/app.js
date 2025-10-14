import React, { useState, useEffect, useMemo } from 'react';
import { useFirebaseApp } from './hooks/useFirebaseApp';
import Header from './components/Header';
import Nav from './components/Nav';
import HomePage from './components/HomePage';
import CoursePage from './components/CoursePage';
import LessonView from './components/LessonView';
import QuizPage from './components/QuizPage';
import LeaderboardPage from './components/LeaderboardPage';
import DailyReminderModal from './components/DailyReminderModal';

function App() {
  const {
    isAuthReady,
    isLoading,
    userData,
    userId,
    leaderboard,
    updateProgress,
    updateLastReminderDate,
    COURSE_DATA,
    AVATAR_MAP
  } = useFirebaseApp();

  const [currentView, setView] = useState('home');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [quizState, setQuizState] = useState({
    active: false,
    level: null,
    currentQuestionIndex: 0,
    score: 0,
    showResult: false
  });
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    if (isAuthReady && userData.xp !== undefined) {
      const today = new Date().toISOString().split('T')[0];
      if (userData.lastReminderDate !== today) {
        setShowReminder(true);
      } else {
        setShowReminder(false);
      }
    }
  }, [isAuthReady, userData.lastReminderDate, userData.xp]);

  const renderContent = useMemo(() => {
    if (!isAuthReady || isLoading) {
      return (
        <div className="flex flex-col items-center justify-center flex-grow p-10 text-gray-600 space-y-4">
          <div className="w-12 h-12 border-4 border-t-4 border-t-red-600 border-gray-200 rounded-full animate-spin"></div>
          <p className="font-semibold">Loading Double Dutch Windmill...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return <HomePage setView={setView} />;
      case 'course':
        return (
          <CoursePage
            COURSE_DATA={COURSE_DATA}
            setView={setView}
            setSelectedLevel={setSelectedLevel}
            userData={userData}
          />
        );
      case 'lesson':
        return (
          <LessonView
            level={selectedLevel}
            setQuizState={setQuizState}
            setView={setView}
          />
        );
      case 'leaderboard':
        return <LeaderboardPage leaderboard={leaderboard} userId={userId} AVATAR_MAP={AVATAR_MAP} />;
      case 'quiz':
        return (
          <QuizPage
            quizState={quizState}
            setQuizState={setQuizState}
            setView={setView}
            updateProgress={updateProgress}
          />
        );
      default:
        return <HomePage setView={setView} />;
    }
  }, [
    currentView,
    isAuthReady,
    isLoading,
    userData,
    userId,
    leaderboard,
    updateProgress,
    quizState,
    selectedLevel,
    COURSE_DATA,
    AVATAR_MAP
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
          html, body, #root {
            height: 100%;
          }
          .font-sans {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>

      <Header userId={userId} currentXP={userData.xp} avatar={userData.avatar} AVATAR_MAP={AVATAR_MAP} />

      <main className="flex-grow flex flex-col overflow-hidden">{renderContent}</main>

      <Nav setView={setView} currentView={currentView} />

      {showReminder && isAuthReady && (
        <DailyReminderModal
          userData={userData}
          setVisible={setShowReminder}
          updateLastReminderDate={updateLastReminderDate}
        />
      )}
    </div>
  );
}

export default App;
