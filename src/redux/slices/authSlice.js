import { createSlice } from "@reduxjs/toolkit";

const savedData = typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;

const initialState = {
  userInfo: savedData ? JSON.parse(savedData) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.userInfo = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");
      }
    },
  },
});

export const { setUserInfo, logout } = authSlice.actions;
export default authSlice.reducer;
