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
}

// Initial state

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false
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
        state.isAuthenticated = true
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false
    },
  }
});

// Export actions

export const { setCredentials, logout } = authSlice.actions;

// Export reducer

export default authSlice.reducer;
