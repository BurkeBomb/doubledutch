# Double Dutch App

A language‑learning app to teach **Dutch & Afrikaans** with gamified modules, quizzes, pronunciation, daily streaks, achievements, and leaderboards.

## Setup

1. Clone or create new repo with this file structure.
2. `npm install`
3. Provide Firebase configuration via environment or global variables:
   - `__firebase_config` (JSON string)
   - `__app_id`
4. Run `npm start`
5. Open in browser at `http://localhost:3000`

## Features

- Module‑based lessons with vocabulary, mascot dialogues, poetry
- Quizzes that award XP and track level completion
- Pronunciation using Web Speech API (speak Dutch)
- Flashcard mode for vocabulary review
- Daily streak tracking and daily XP goals
- Achievements and unlockable avatars
- Leaderboard of top learners
- Real-time sync via Firestore

## Future Ideas

- Offline mode / caching
- Chatbot conversation practice
- Dark mode / theming
- Audio recording & pronunciation feedback
