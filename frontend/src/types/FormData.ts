export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
}

export interface LabelFormData {
  id?: number;
  board_id: number;
  name: string;
}

export interface NoteFormData {
  id?: number;
  board_id: number;
  title: string;
  content: string;
  deadline?: Date;
  priority: number;
}

export interface BoardFormData {
  id?: number;
  team_id?: number;
  owner_id?: number;
  name: string;
}

export interface TeamFormData {
  id?: number;
  team_id?: number;
  board_id?: number;
  owner_id?: number;
  emails: string[];
}
