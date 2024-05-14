import { Request } from "express";

export interface ConverseRequest extends Request {
  body: {
    content: string;
    threadId?: string;
  };
}
