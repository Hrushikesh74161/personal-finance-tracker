import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./toastSlice";

export default configureStore({
  reducer: {
    toast: toastReducer,
  },
});
