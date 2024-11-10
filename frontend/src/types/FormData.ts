export interface FormData {
  csrf_token: string;
}

export interface LoginFormData extends FormData {
  email: string;
  password: string;
}

export interface SignupFormData extends FormData {
  username: string;
  email: string;
  password: string;
}

export interface LabelFormData extends FormData {
  id?: number;
  board_id: number;
  name: string;
}

export interface NoteFormData extends FormData {
  id?: number;
  board_id: number;
  title: string;
  content: string;
  deadline: Date;
  priority: number;
}
