import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminData {
    email: string | null;
}

interface AdminState {
    isAuthenticated: boolean;
    adminData: AdminData | null
}

const initialState: AdminState = {
    isAuthenticated: false,
    adminData: null
}

const adminAuthSlice = createSlice({
    name: "AdminAuth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AdminData>) => {
            console.log("Redux Admin Slice: ", action.payload);
            state.isAuthenticated = true;
            state.adminData = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.adminData = null;
        }
    }
})

export const { login, logout } = adminAuthSlice.actions;
export default adminAuthSlice