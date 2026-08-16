import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// User type
type User = {
  id: string;
  name: string;
  email: string;
  create_at: string;
};

// Auth type
type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

// Initial state

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true
}

// Slice 

const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
          token:string
          user: User;
        }>
      ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitializing = false;

    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false
    },
    initializingAuth: (state) => {
      state.isInitializing = false;
    }
  }
});

// Export actions

export const { setCredentials, logout, initializingAuth } = authSlice.actions;

// Export reducer

export default authSlice.reducer;
