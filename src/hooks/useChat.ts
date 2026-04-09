import { useState } from "react";
import { sendMessage } from "../services/chat.service";

export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);

  const send = async (text: string) => {
    const res = await sendMessage(text, chatId || undefined);

    setChatId(res.chat_id);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "model", content: res.reply },
    ]);
  };

  return { messages, send };
};