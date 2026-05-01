
export type Message = {
  role: "user" | "model";
  content: string;
}

export type ChatResponse = {
  chat_id: string;
  reply: string;
}

export type ChatHistory = {
  _id: string;
  title: string;
  messages: Message[];
}

export type ChatSummary = {
  _id: string;
  title: string;
  created_at: string;
}