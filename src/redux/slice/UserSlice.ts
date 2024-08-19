import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData {
    _id: string | null;
    email: string | null;
    name: string | null;
    phone: string | null;
    status: boolean
}

interface UserState {
    isAuthenticated: boolean;
    token: string| null;
    userData: UserData | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    token: null,
    userData: null
}

const userAuthSlice = createSlice({
    name: "UserAuth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{token:string, UserData:UserData}>) => {
            state.isAuthenticated = true;
            state.token=action.payload.token;
            state.userData = action.payload.UserData;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.userData = null;
        }
    }
})

export const { login, logout } = userAuthSlice.actions;
export default userAuthSlice;
