import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./slices/toastSlice";

export default configureStore({
  reducer: {
    toast: toastReducer,
  },
});
