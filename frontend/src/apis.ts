import axios from "@/lib/axios";
import { PollOption } from "./types";

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

export const getAllChats = () => {
  return axios.get(`http://localhost:8000/get-all-chats`);
};

export const toggleLikeChat = (chat_id: number) => {
  return axios.get(`http://localhost:8000/like-chat/${chat_id}`);
};

export const addPoll = (question: string, options: { text: string }[]) => {
  return axios.post(`http://localhost:8000/add-poll`, {
    question,
    options,
  });
};

export const deleteChat = (user_id: number, chat_id: number) => {
  return axios.delete(
    `http://localhost:8000/delete-chat?user_id=${user_id}&chat_id=${chat_id}`
  );
};

export const votePoll = (poll_id: number, option_id: number) => {
  return axios.post(
    `http://localhost:8000/vote-poll`, {
      poll_id,
      option_id,
    }
  );
};
