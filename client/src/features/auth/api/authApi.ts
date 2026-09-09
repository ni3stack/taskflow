const API_URL =  import.meta.env.VITE_API_URL;

import type {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  UserResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/auth.types";


export async function register(
  data:SignupRequest
):Promise<SignupResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Unable to create account");
    }
    return response.json();
}

export async function login(
    data: LoginRequest
): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(data)
    });

    if(!response.ok) {
      throw new Error("Invalid email or password");
    }

    return response.json();
}

export async function getCurrentUser(
    token:string
):Promise<UserResponse>{

    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if(!response.ok) {
      throw new Error("Unable to fetch current user");
    }
    return response.json();

}

export async function forgotPassword(
  data:ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {

  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if(!response.ok) {
    throw new Error("Unable to process password reset request");
  }
  return response.json();
}

export async function resetPassword(
  data:ResetPasswordRequest
):Promise<ResetPasswordResponse> {

  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if(!response.ok) {
    throw new Error("Invalid or expired password reset link");
  }
  return response.json();

}