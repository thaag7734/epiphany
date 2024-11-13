interface Model {
  id: number;
}

export interface User extends Model {
  username: string;
  email: string;
  password?: string;
  root_board_id?: number;
}

export interface Label extends Model {
  name: string;
  board_id: number;
}

export interface Note extends Model {
  title: string;
  content: string;
  deadline?: Date;
  priority: number;
  board_id: number;
  labels: number[];
}

export interface Team extends Model {
  owner_id: number;
  owner?: User;
  users: User[];
}

export interface Board extends Model {
  team_id: number | null;
  owner_id: number;
  name: string;
  team?: Team;
  notes: Note[];
  labels: Label[];
  owner: User;
}
