import React, { useMemo, useState } from 'react';
import Button from './Button';

const DailyReminderModal = ({ userData, setVisible, updateLastReminderDate }) => {
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [error, setError] = useState(null);

  const { xp, levelProgress = {}, lastReminderDate } = userData ?? {};

  const completedLessons = useMemo(
    () => Object.values(levelProgress).filter((progress) => progress?.completed).length,
    [levelProgress]
  );

  const handleClose = () => {
    if (isAcknowledging) return;
    setVisible(false);
  };

  const handleAcknowledge = async () => {
    if (!updateLastReminderDate) {
      handleClose();
      return;
    }

    setIsAcknowledging(true);
    setError(null);
    try {
      await updateLastReminderDate();
      setVisible(false);
    } catch (ackError) {
      console.error('Failed to acknowledge reminder', ackError);
      setError('We could not save your reminder acknowledgment. Please try again.');
      setIsAcknowledging(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-30">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border-t-8 border-red-500">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-800">Daily Dutch Reminder</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Dismiss reminder"
          >
            ×
          </button>
        </div>

        <p className="text-gray-600 leading-relaxed">
          Keep the momentum going! A quick practice session today will help you stay on top of your Dutch and Afrikaans goals.
        </p>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-semibold text-red-700">
            Progress snapshot
          </p>
          <p className="text-sm text-red-800">Total XP: <span className="font-bold">{xp ?? 0}</span></p>
          <p className="text-sm text-red-800">Lessons completed: <span className="font-bold">{completedLessons}</span></p>
          {lastReminderDate && (
            <p className="text-xs text-red-500">Last reminder acknowledged on {lastReminderDate}</p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
          <Button onClick={handleClose} disabled={isAcknowledging} className="sm:flex-1">
            Later
          </Button>
          <Button primary onClick={handleAcknowledge} disabled={isAcknowledging} className="sm:flex-1">
            {isAcknowledging ? 'Saving…' : 'I practised today'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyReminderModal;
