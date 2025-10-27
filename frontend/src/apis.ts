import axios from "@/lib/axios";

export const addChat = (user_id: number, message: string) => {
  return axios.post("http://localhost:8000/add-chat", {
    user_id,
    message,
  });
};

export const loginWithPassword = (email: string, password: string) => {
  return axios.post("http://localhost:8000/login", {
    email,
    password,
  });
};

export const toggleLikeChat = (chat_id: number) => {
  return axios.get(`http://localhost:8000/like-chat/${chat_id}`);
};
