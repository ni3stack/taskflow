export type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  };
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type UserResponse = {
  user: CurrentUser;
};

export type ResetPasswordRequest = {
  token:string;
  password: string;
}

export type ResetPasswordResponse = {
  message:string
}