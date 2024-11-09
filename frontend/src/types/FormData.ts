export interface FormData {
  csrf_token: string
}

export interface LoginFormData extends FormData {
  email: string
  password: string
}

export interface SignupFormData extends FormData {
  username: string
  email: string
  password: string
}
