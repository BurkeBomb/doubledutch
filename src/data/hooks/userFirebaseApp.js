import { useReducer, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
  query,
  limit,
  onSnapshot
} from 'firebase/firestore';

import courseJson from '../data/course_data.json';

const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'doubledutch-app';
const initialAuthToken = typeof __initial_auth_token !== 'undefined'
  ? __initial_auth_token
  : null;

const initialState = {
  auth: null,
  db: null,
  userId: null,
  isAuthReady: false,
  userData: {
    xp: 0,
    levelProgress: {},
    avatar: 'bear',
    lastReminderDate: null
  },
  leaderboard: [],
  isLoading: true
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        auth: action.payload.auth,
        db: action.payload.db,
        userId: action.payload.userId,
        isAuthReady: true
      };
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: action.payload,
        isLoading: false
      };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export function useFirebaseApp() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (Object.keys(firebaseConfig).length === 0) {
      console.error('Firebase config is missing. Cannot initialize Firestore.');
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const authenticate = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error('Firebase authentication failed:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch({ type: 'SET_AUTH', payload: { auth, db, userId: user.uid } });
      } else {
        authenticate();
      }
    });

    if (!auth.currentUser) {
      authenticate();
    }
  }, []);

  // Real-time user data
  useEffect(() => {
    if (!state.db || !state.userId) return;

    const userDocRef = doc(
      state.db,
      'artifacts',
      appId,
      'users',
      state.userId,
      'profiles',
      'self'
    );

    const unsubscribe = onSnapshot(
      userDocRef,
      docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          dispatch({
            type: 'SET_USER_DATA',
            payload: {
              ...data,
              xp: data.xp ?? 0,
              levelProgress: data.levelProgress ?? {},
              avatar: data.avatar ?? 'bear',
              lastReminderDate: data.lastReminderDate ?? null
            }
          });
        } else {
          // initialize
          setDoc(userDocRef, initialState.userData, { merge: true }).then(() => {
            dispatch({
              type: 'SET_USER_DATA',
              payload: initialState.userData
            });
          }).catch(e => console.error('Error initializing user data:', e));
        }
      },
      error => {
        console.error('Error fetching user data:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    );

    return () => unsubscribe();
  }, [state.db, state.userId]);

  // Leaderboard listener
  useEffect(() => {
    if (!state.db || !state.userId) return;

    const lbCol = collection(state.db, 'artifacts', appId, 'public', 'data', 'leaderboard');
    const lbQuery = query(lbCol, limit(10));

    const unsubscribe = onSnapshot(
      lbQuery,
      snapshot => {
        const arr = snapshot.docs
          .map(doc => {
            const d = doc.data();
            return {
              id: doc.id,
              xp: d.xp ?? 0,
              avatar: d.avatar,
              isCurrentUser: doc.id === state.userId
            };
          })
          .sort((a, b) => b.xp - a.xp);
        dispatch({ type: 'SET_LEADERBOARD', payload: arr });
      },
      err => {
        console.error('Error fetching leaderboard:', err);
      }
    );

    return () => unsubscribe();
  }, [state.db, state.userId]);

  const updateProgress = useCallback(
    async (levelId, newXP) => {
      if (!state.db || !state.userId) return false;

      const userRef = doc(
        state.db,
        'artifacts',
        appId,
        'users',
        state.userId,
        'profiles',
        'self'
      );
      const lbRef = doc(
        state.db,
        'artifacts',
        appId,
        'public',
        'data',
        'leaderboard',
        state.userId
      );

      const curProg = state.userData.levelProgress[levelId] ?? { completed: false };
      if (curProg.completed) {
        console.log(`Level ${levelId} already done.`);
        return true;
      }

      const newProg = {
        ...state.userData.levelProgress,
        [levelId]: { completed: true, timestamp: Date.now() }
      };
      const totalXP = (state.userData.xp || 0) + newXP;

      try {
        await updateDoc(userRef, {
          xp: totalXP,
          levelProgress: newProg
        });
        await setDoc(
          lbRef,
          {
            userId: state.userId,
            xp: totalXP,
            avatar: state.userData.avatar,
            lastUpdate: Date.now()
          },
          { merge: true }
        );
        return true;
      } catch (err) {
        console.error('Error updating progress:', err);
        return false;
      }
    },
    [state.db, state.userId, state.userData]
  );

  const updateLastReminderDate = useCallback(async () => {
    if (!state.db || !state.userId) return;
    const userRef = doc(
      state.db,
      'artifacts',
      appId,
      'users',
      state.userId,
      'profiles',
      'self'
    );
    const today = new Date().toISOString().split('T')[0];
    try {
      await updateDoc(userRef, { lastReminderDate: today });
    } catch (err) {
      console.error('Error updating last reminder date:', err);
    }
  }, [state.db, state.userId]);

  return {
    ...state,
    updateProgress,
    updateLastReminderDate,
    COURSE_DATA: courseJson.courseData,
    AVATAR_MAP: courseJson.avatars
  };
}
