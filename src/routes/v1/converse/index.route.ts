import express, { Router, Response } from "express";
import { ConverseRequest } from "./types";
import * as z from "zod";

import OpenAI from "openai";
import { config } from "../../../config";

const converseRouter: Router = express.Router();

converseRouter.post("/", async (req: ConverseRequest, res: Response) => {
  const schema = z.object({
    content: z.string().max(150),
    threadId: z.string().optional(),
  });
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send(result.error);
  }

  const { content, threadId } = result.data;
  const openai = new OpenAI({
    apiKey: config.OPENAI_KEY,
    organization: config.OPENAI_ORG_ID,
    project: config.OPENAI_PROJECT_ID,
  });
  const assistant = await openai.beta.assistants.retrieve(
    config.OPENAI_ASSISTANT_ID
  );

  const thread = await (threadId
    ? openai.beta.threads.retrieve(threadId)
    : openai.beta.threads.create());

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: content,
  });

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  });

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const reply = messages.data[0].content[0];

    if (reply.type === "text") {
      return res.status(200).send({
        content: reply.text.value,
        threadId: threadId ? threadId : thread.id,
      });
    } else {
      return res.status(200).send({
        content: "Sorry, I don't understand. Please ask another question.",
        threadId: threadId ? threadId : thread.id,
      });
    }
  }

  return res.status(500).send(run);
});

export default converseRouter;
