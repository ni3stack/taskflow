const API_URL =  import.meta.env.VITE_API_URL;

type SignupRequest = {
  name: string;
  email: string;
  password: string;
}

type SignupResponse = {
  user: {
    id: string,
    name: string,
    email: string,
    create_at: string
  }
}

type LoginRequest = {
  email: string;
  password: string;
}

type LoginResponse = {
  token: string;
}

type CurrentUser = {
  id: string,
  name: string,
  email: string,
  create_at: string
}

type UserResponse = {
  user:CurrentUser
}

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