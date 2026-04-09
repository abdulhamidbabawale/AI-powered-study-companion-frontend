
import api from "../api/client";
import type { ChatResponse } from "../types/chat";

export const sendMessage = async (
  message: string,
  chat_id?: string
): Promise<ChatResponse> => {
  const res = await api.post("/continue-chat", {
    message,
    chat_id,
  });

  return res.data;
};