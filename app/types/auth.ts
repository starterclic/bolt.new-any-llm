export interface User {
  id: string;
  email: string;
}

export interface LoginActionData {
  error?: string;
}

export interface RegisterActionData {
  error?: string;
}
