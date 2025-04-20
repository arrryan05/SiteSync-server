// src/types/auth.types.ts

export interface SignupRequest {
    email: string;
    password: string;
    name?: string;
  }
  
  export interface SignupResponse {
    userId: string;
    email: string;
    name?: string;
    token: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    userId: string;
    email: string;
    name?: string;
    token: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name?: string;
    hashedPassword: string;
  }
  