import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  postUser: string | null;
  unseenCount: number;
}

const initialState: NotificationState = {
  postUser: null,
  unseenCount: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    incrementUnseenCount: (state, action: PayloadAction<string>) => {
        if (typeof action.payload === 'string') {
          state.postUser = action.payload;
          state.unseenCount += 1;
        } else {
          console.error('Invalid payload type for incrementUnseenCount. Expected string, got:', typeof action.payload);
        }
      },
    resetUnseenCount: (state) => {
      state.postUser = null;
      state.unseenCount = 0;
    },
  },
});

export const { incrementUnseenCount, resetUnseenCount } = notificationSlice.actions;
export default notificationSlice;