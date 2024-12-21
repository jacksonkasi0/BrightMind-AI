import { google } from "@ai-sdk/google";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";

// ** import custom middleware
import { customMiddleware } from "./custom-middleware";

export const geminiFlashModel = wrapLanguageModel({
  model: google("gemini-1.5-flash"),
  middleware: customMiddleware,
});