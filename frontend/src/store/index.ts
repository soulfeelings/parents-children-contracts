import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import contractsReducer from "./slices/contractsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contracts: contractsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
