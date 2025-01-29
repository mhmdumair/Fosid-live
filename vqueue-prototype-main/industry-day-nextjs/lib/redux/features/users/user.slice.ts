// lib/redux/userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, deleteCookie, setCookie } from "cookies-next";

interface UserState {
  user: any | null;
  accessToken: string | null;
}

const initialState: UserState = {
  user: getCookie("currentUser") || null,
  accessToken: getCookie("accessToken") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
      setCookie("currentUser", action.payload, { maxAge: 60 * 60 * 24 });
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      setCookie("accessToken", state.accessToken, { maxAge: 60 * 60 * 24 });
    },
    clearUser(state) {
      state.user = null;
      state.accessToken = null;
      deleteCookie("currentUser");
      deleteCookie("accessToken");
    },
  },
});

export const { setUser, setAccessToken, clearUser } = userSlice.actions;
export default userSlice.reducer;
