// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    quizProgress: JSON.parse(localStorage.getItem('quizProgress')) || {},
    chapterProgress: JSON.parse(localStorage.getItem('chapterProgress')) || {},
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        updateQuizScore: (state, action) => {
            const { quizId, score } = action.payload;
            state.quizProgress = {
                ...state.quizProgress,
                [quizId]: score
            };
            localStorage.setItem('quizProgress', JSON.stringify(state.quizProgress));
        },
        updateChapterProgress: (state, action) => {
            const { chapterId, progress } = action.payload;
            state.chapterProgress = {
                ...state.chapterProgress,
                [chapterId]: progress
            };
            localStorage.setItem('chapterProgress', JSON.stringify(state.chapterProgress));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.quizProgress = {};
            state.chapterProgress = {};
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('quizProgress');
            localStorage.removeItem('chapterProgress');
        },
    },
});

export const {
    setCredentials,
    logout,
    updateUser,
    updateQuizScore,
    updateChapterProgress
} = authSlice.actions;

export default authSlice.reducer;