import axios from "@/lib/axios";

export const addChat = (user_id: number, message: string) => {
  return axios.post("/add-chat", {
    user_id,
    message,
  });
};

export const loginWithPassword = (email: string, password: string) => {
  return axios.post("/login", {
    email,
    password,
  });
};

export const getAllChats = () => {
  return axios.get(`/get-all-chats`);
};

export const toggleLikeChat = (chat_id: number) => {
  return axios.get(`/like-chat/${chat_id}`);
};

export const addPoll = (question: string, options: { text: string }[]) => {
  return axios.post(`/add-poll`, {
    question,
    options,
  });
};

export const deleteChat = (user_id: number, chat_id: number) => {
  return axios.delete(
    `/delete-chat?user_id=${user_id}&chat_id=${chat_id}`
  );
};

export const votePoll = (poll_id: number, option_id: number) => {
  return axios.post(
    `/vote-poll`, {
      poll_id,
      option_id,
    }
  );
};
