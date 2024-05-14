import dotenv from "dotenv";

dotenv.config();

const { OPENAI_KEY, OPENAI_PROJECT_ID, OPENAI_ORG_ID, OPENAI_ASSISTANT_ID } =
  process.env;

if (
  !OPENAI_KEY ||
  !OPENAI_PROJECT_ID ||
  !OPENAI_ORG_ID ||
  !OPENAI_ASSISTANT_ID
) {
  throw new Error("Missing environment variables");
}

export const config = {
  OPENAI_KEY,
  OPENAI_PROJECT_ID,
  OPENAI_ORG_ID,
  OPENAI_ASSISTANT_ID,
};
