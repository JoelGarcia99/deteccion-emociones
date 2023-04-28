import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth.reducer";

let store = configureStore({
  reducer: {
    auth: authReducer as any,
  }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
