import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecruiterData {
    email: string | null;
    name: string | null;
    password: string | null;
    phone: string | null;
}

interface RecruiterState {
    isAuthenticated: boolean;
    recruiterData: RecruiterData | null;
}

const initialState: RecruiterState = {
    isAuthenticated: false,
    recruiterData: null
}

const recruiterAuthSlice = createSlice({
    name: "RecruiterAuth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<RecruiterData>) => {
            console.log("Redux recruiter Slice: ", action.payload);
            state.isAuthenticated = true;
            state.recruiterData = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.recruiterData = null;
        }
    }
})

export const { login, logout } = recruiterAuthSlice.actions;
export default recruiterAuthSlice;
