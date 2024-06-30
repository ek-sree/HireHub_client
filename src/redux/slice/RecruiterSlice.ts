import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecruiterData {
    email: string | null;
    name: string | null;
    password: string | null;
    phone: string | null;
    isVerified: string | null
}

interface RecruiterState {
    isAuthenticated: boolean;
    token: string| null;
    recruiterData: RecruiterData | null;
}

const initialState: RecruiterState = {
    isAuthenticated: false,
    token: null,
    recruiterData: null
}

const recruiterAuthSlice = createSlice({
    name: "RecruiterAuth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{token:string,RecruiterData:RecruiterData}>) => {
            console.log("Redux recruiter Slice: ", action.payload);
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.recruiterData = action.payload.RecruiterData;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.recruiterData = null;
        }
    }
})

export const { login, logout } = recruiterAuthSlice.actions;
export default recruiterAuthSlice;
