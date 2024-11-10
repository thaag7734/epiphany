import type { Label } from "./Models";

export type ErrorResponse = { errors: { [key: string]: string } };
export type APIResponse<T> = T | ErrorResponse;
export type LabelCollection = { labels: Label[] };

export interface SuccessResponse {
  message: string;
}

export interface LabelResponse extends SuccessResponse {
  label: Label;
}
