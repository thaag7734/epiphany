import type { Label, Board, Note } from "./Models";

export type ErrorResponse = { errors: { [key: string]: string } };
export type APIResponse<T> = T | ErrorResponse;
export type LabelCollection = { labels: Label[] };
export type NoteCollection = { notes: Note[] };
export type BoardCollection = { boards: Board[] };

export interface SuccessResponse {
  message: string;
}