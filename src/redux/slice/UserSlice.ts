import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
    email: string | null;
    name: string | null;
    password: string | null;
    phone: string | null;
}

interface UserState {
    isAuthenticated: boolean;
    userData: UserData | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    userData: null
}

const userAuthSlice = createSlice({
    name: "UserAuth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserData>) => {
            console.log("Redux User Slice: ", action.payload);
            state.isAuthenticated = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.userData = null;
        }
    }
})

export const { login, logout } = userAuthSlice.actions;
export default userAuthSlice;
