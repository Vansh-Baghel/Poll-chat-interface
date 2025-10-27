export type Profile = {
  id: number;
  name: string;
  email: string;
};

export type ChatItem = {
  id: number;
  user_id: number;
  name: string;
  message: string;
  created_at: string;
  isRight: boolean;
  is_liked: boolean;
  likes: number;
};
