import React, { useState } from 'react';

// speakDutch function (Text-to-Speech)
const speakDutch = (text) => {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'nl-NL';
  window.speechSynthesis.speak(utterance);
};

// Flashcard component
const Flashcard = ({ front, back }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer w-full h-40 flex items-center justify-center text-lg font-semibold rounded-xl shadow-xl transition-transform duration-300 bg-white border-2 border-red-300 hover:shadow-2xl p-2"
    >
      {flipped ? back : front}
    </div>
  );
};

const LessonView = ({ level, setQuizState, setView }) => {
  const [useFlashcards, setUseFlashcards] = useState(false);

  if (!level || !level.vocabulary) {
    return <div className="p-6 text-center text-red-500">Error: Lesson data not found.</div>;
  }

  const { title, theme, vocabulary, mascot, nugget, poetry } = level;

  const ContentCard = ({ title, icon, children, className = '' }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-xl ring-1 ring-gray-100 border-l-4 border-red-400 ${className}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
        <span className="text-2xl mr-2">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="p-4 space-y-6 flex-grow overflow-y-auto pb-20 md:pb-4">
      <h1 className="text-3xl font-black text-red-600 mb-2">{title}</h1>
      <p className="text-lg text-gray-600 font-medium">Theme: {theme}</p>

      {/* Vocabulary Section with Toggle */}
      <ContentCard title="Essential Vocabulary" icon="📘" className="!border-blue-500">
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setUseFlashcards(!useFlashcards)}
            className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-sm font-semibold rounded-lg border border-yellow-300"
          >
            {useFlashcards ? 'Switch to Table View' : 'Switch to Flashcards'}
          </button>
        </div>

        {useFlashcards ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {vocabulary.map((v, idx) => (
              <Flashcard
                key={idx}
                front={
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xl mb-2">{v.dutch}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakDutch(v.dutch);
                      }}
                      className="px-3 py-1 bg-blue-200 hover:bg-blue-300 rounded text-sm"
                    >
                      🔊 Play
                    </button>
                  </div>
                }
                back={
                  <div className="text-center">
                    <p className="text-lg font-bold">{v.english}</p>
                    <p className="text-sm text-gray-600">Afrikaans: {v.afrikaans}</p>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider rounded-tl-lg">
                    Dutch 🇳🇱
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">
                    Afrikaans 🇿🇦
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider rounded-tr-lg">
                    English 🇬🇧
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vocabulary.map((v, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 flex items-center">
                      {v.dutch}
                      <button
                        onClick={() => speakDutch(v.dutch)}
                        className="ml-2 px-2 py-1 bg-blue-200 hover:bg-blue-300 rounded"
                        title="Play Dutch"
                      >
                        🔊
                      </button>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{v.afrikaans}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{v.english}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          * Tap on a flashcard or click the 🔊 button to hear pronunciation.
        </p>
      </ContentCard>

      {/* Mascot Dialogue, Nugget, Poetry, and Quiz CTA remain here */}
      {mascot && (
        <ContentCard title="Mascot Dialogue" icon="🎭" className="!border-yellow-500">
          <p className="text-sm font-semibold text-gray-700 mb-3">{mascot.task}</p>
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            {mascot.dialogue.map((line, i) => (
              <div key={i} className={`flex ${line.speaker === 'Bear' ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-3 rounded-xl max-w-[80%] shadow-md ${line.speaker === 'Bear' ? 'bg-blue-100 text-gray-800' : 'bg-yellow-100 text-gray-800'}`}>
                  <span className="font-bold text-xs block mb-0.5">{line.speaker}:</span>
                  {line.line}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">Goal: {mascot.goal}</p>
        </ContentCard>
      )}

      {nugget && (
        <ContentCard title={nugget.title} icon={nugget.icon} className="!border-green-500">
          <p className="text-sm text-gray-700">{nugget.fact}</p>
        </ContentCard>
      )}

      {poetry && poetry.length > 0 && (
        <ContentCard title="Poetry Integration" icon="📜" className="!border-purple-500">
          <div className="space-y-3">
            {poetry.map((p, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="font-semibold text-gray-800">"{p.title}"</p>
                <p className="text-xs text-gray-500 mb-1">by {p.author} ({p.type})</p>
                <p className="text-sm text-gray-600 mt-1">Activity: {p.activity}</p>
              </div>
            ))}
          </div>
        </ContentCard>
      )}

      <div className="text-center py-4 sticky bottom-0 bg-gray-50 md:bg-transparent">
        <button
          className="px-6 py-3 font-bold text-lg rounded-xl bg-red-600 hover:bg-red-700 text-white border-b-4 border-red-800 shadow-lg transform active:scale-95 w-full max-w-sm"
          onClick={() => {
            setQuizState({ active: true, level: level, currentQuestionIndex: 0, score: 0, showResult: false });
            setView('quiz');
          }}
        >
          Test Your Knowledge (Quiz)
        </button>
      </div>
    </div>
  );
};

export default LessonView;
