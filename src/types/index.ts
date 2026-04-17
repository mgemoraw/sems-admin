export interface User {
  id: number;
  student_id: string;
  email: string;
  first_name: string;
  last_name: string;
  program: string;
}

export interface Question {
  id: number;
  title: string;
  body: string;
  program: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  student_id: string;
  email: string;
  first_name: string;
  last_name: string;
  program: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}


