export type Profile = {
  id: number;
  name: string;
  email: string;
};

export type PollOption = {
  id: number;
  text: string;
  vote_percentage?: number;
};

export type Poll = {
  question: string;
  options: PollOption[];
}

export type ChatItem = {
  id: number;
  user_id: number;
  name: string;
  message: string;
  created_at: string;
  isRight: boolean;
  is_liked: boolean;
  poll?: Poll;
  likes: number;
  type: string;
};
