import { createSlice } from "@reduxjs/toolkit";

const savedLang = typeof window !== "undefined" ? localStorage.getItem("dk-lang") : null;
const validLang = savedLang === "ar" || savedLang === "en" ? savedLang : "ar";

const initialState = {
  lang: validLang,
};

const langSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setLang: (state, action) => {
      state.lang = action.payload;
      document.documentElement.lang = action.payload;
      document.documentElement.dir = action.payload === "ar" ? "rtl" : "ltr";
      localStorage.setItem("dk-lang", action.payload);
    },
    toggleLang: (state) => {
      const next = state.lang === "ar" ? "en" : "ar";
      state.lang = next;
      document.documentElement.lang = next;
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
      localStorage.setItem("dk-lang", next);
    },
  },
});

export const { setLang, toggleLang } = langSlice.actions;
export default langSlice.reducer;
