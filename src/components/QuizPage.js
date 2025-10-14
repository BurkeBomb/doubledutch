import React, { useMemo, useState, useCallback } from 'react';
import Button from './Button';

const QuizPage = ({ quizState, setQuizState, setView, updateProgress }) => {
  const { level, currentQuestionIndex, score, showResult } = quizState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  const questions = useMemo(() => level?.quiz ?? [], [level]);
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] ?? null;

  const handleAnswer = useCallback(
    (selectedOption) => {
      if (!currentQuestion) {
        return;
      }

      setQuizState((prev) => {
        const activeQuestion = prev.level?.quiz?.[prev.currentQuestionIndex];
        if (!activeQuestion) {
          return prev;
        }

        const answeredCorrectly = selectedOption === activeQuestion.answer;
        const updatedScore = answeredCorrectly ? prev.score + 1 : prev.score;
        const nextIndex = prev.currentQuestionIndex + 1;

        if (!prev.level?.quiz || nextIndex >= prev.level.quiz.length) {
          return {
            ...prev,
            score: updatedScore,
            showResult: true
          };
        }

        return {
          ...prev,
          score: updatedScore,
          currentQuestionIndex: nextIndex
        };
      });
    },
    [currentQuestion, setQuizState]
  );

  const resetQuizState = useCallback(() => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: 0,
      score: 0,
      showResult: false
    }));
  }, [setQuizState]);

  const handleRetry = () => {
    resetQuizState();
  };

  const handleExit = () => {
    setQuizState({
      active: false,
      level: null,
      currentQuestionIndex: 0,
      score: 0,
      showResult: false
    });
    setView('course');
  };

  const handleClaimXp = async () => {
    if (!level) {
      handleExit();
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const didUpdate = await updateProgress(level.id, level.xpReward ?? 0);
      if (didUpdate === false) {
        setSubmissionError('We could not record your progress. Please try again.');
        setIsSubmitting(false);
        return;
      }
      handleExit();
    } catch (error) {
      console.error('Failed to update progress', error);
      setSubmissionError('Something went wrong while saving your progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!level) {
    return (
      <div className="p-6 text-center text-red-500">
        Quiz data unavailable. Please return to the lesson and try again.
        <div className="mt-4">
          <Button onClick={() => setView('course')}>Back to Course</Button>
        </div>
      </div>
    );
  }

  if (!totalQuestions) {
    return (
      <div className="p-6 text-center text-gray-600">
        This lesson does not contain a quiz yet. Check back soon!
        <div className="mt-4">
          <Button onClick={() => setView('lesson')}>Back to Lesson</Button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return (
      <div className="p-6 space-y-6 flex-grow overflow-y-auto pb-20 text-center">
        <h1 className="text-3xl font-black text-red-600">Quiz complete! 🎉</h1>
        <p className="text-lg text-gray-700">
          You answered <span className="font-bold">{score}</span> out of{' '}
          <span className="font-bold">{totalQuestions}</span> questions correctly ({accuracy}% accuracy).
        </p>
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-yellow-400 space-y-4">
          <p className="text-sm text-gray-600">
            Claiming your XP will update your progress on the leaderboard and unlock the next challenge.
          </p>
          {submissionError && <p className="text-sm text-red-600">{submissionError}</p>}
          <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-3 sm:space-y-0">
            <Button
              primary
              onClick={handleClaimXp}
              disabled={isSubmitting}
              className="sm:min-w-[200px]"
            >
              {isSubmitting ? 'Saving…' : `Claim ${level.xpReward ?? 0} XP`}
            </Button>
            <Button onClick={handleRetry} disabled={isSubmitting} className="sm:min-w-[200px]">
              Try Again
            </Button>
            <Button onClick={handleExit} disabled={isSubmitting} className="sm:min-w-[200px]">
              Back to Course
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 flex-grow overflow-y-auto pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-800">{level.title} – Quiz</h1>
        <span className="text-sm font-semibold text-red-600">
          Question {currentQuestionIndex + 1} / {totalQuestions}
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-red-500 space-y-4">
        <p className="text-lg font-semibold text-gray-800">{currentQuestion.question}</p>
        <div className="grid gap-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleAnswer(option)}
              className="text-left p-4 rounded-xl border-2 border-transparent bg-red-50 hover:bg-red-100 hover:border-red-400 transition-colors duration-150"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Score: {score}</span>
        <button type="button" onClick={handleExit} className="text-red-600 font-semibold hover:underline">
          Exit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
