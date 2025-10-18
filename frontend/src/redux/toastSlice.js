import { createSlice } from "@reduxjs/toolkit";

export const toastSlice = createSlice({
  name: "toast",

  initialState: {
    toastState: false,
    message: "",
    type: "",
  },

  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.toastState = true;
    },

    hideToast: (state) => {
      state.toastState = false;
      state.message = "";
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
