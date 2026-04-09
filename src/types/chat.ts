
export type Message ={
  role: "user" | "model";
  content: string;
}

export type ChatResponse ={
  chat_id: string;
  reply: string;
}