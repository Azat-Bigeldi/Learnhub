import { createSlice } from '@reduxjs/toolkit';

function readUserFromStorage() {
    try {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

const authslice = createSlice({
    name: 'auth',
    initialState: { user: readUserFromStorage() },
    reducers: {
        setUser: (state, action) => { state.user = action.payload; },
        clearUser: (state) => { state.user = null; },
    },
});

export const { setUser, clearUser } = authslice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsLoggedIn = (state) => state.auth.user !== null;
export default authslice.reducer;