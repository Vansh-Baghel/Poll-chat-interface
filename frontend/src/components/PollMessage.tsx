import React from "react";
import { ChatItem } from "@/types";
import { useFormattedTime } from "@/hooks/useFormattedTime";
import { Button } from "./ui/button";
import { HeartIcon, Trash } from "lucide-react";
import { toggleLikeChat } from "@/apis";
import { Spinner } from "./ui/spinner";

interface PollMessageProps {
  message: ChatItem;
  onSetMessages: React.Dispatch<React.SetStateAction<ChatItem[]>>;
}

const PollMessage = ({ message, onSetMessages }: PollMessageProps) => {
  const formattedTime = useFormattedTime(message.created_at);
  const [loading, setLoading] = React.useState(false);
  const { isRight } = message;

  const toggleLikeHandler = async () => {
    setLoading(true);
    try {
      await toggleLikeChat(message.id);
      onSetMessages((prevMessages) =>
        prevMessages.map((prevMsg) =>
          prevMsg.id === message.id
            ? {
                ...prevMsg,
                is_liked: !prevMsg.is_liked,
                likes: prevMsg.is_liked ? prevMsg.likes - 1 : prevMsg.likes + 1,
              }
            : prevMsg
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!message.poll) return null;

  return (
    <div className="flex justify-start">
      <div className="bg-green-50 p-4 rounded-2xl shadow-sm w-full max-w-[75%]">
        <div className="font-medium text-green-600 mb-2">
          {message.poll.question}
        </div>

        <div className="flex flex-col gap-2">
          {message.poll.options.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between border rounded-lg px-3 py-2 bg-white"
            >
              <span>{option.text}</span>
              <span className="text-sm text-gray-500">
                {option.vote_percentage ?? 0}%
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-3 items-center">
          <div className="text-xs text-gray-400">{formattedTime}</div>

          <div className="flex justify-between items-end pt-2">
            <div
              className={`${isRight ? "float-left" : "float-right"} flex gap-2`}
            >
              <Button
                className="h-9 p-2 bg-white rounded-lg gap-2"
                onClick={toggleLikeHandler}
              >
                {loading ? (
                  <Spinner size="small" className="w-5" />
                ) : (
                  <div className="flex items-center gap-1">
                    <HeartIcon
                      className={`w-5 h-5 ${
                        message.is_liked ? "fill-red-400" : "hover:fill-red-100"
                      }`}
                    />
                    <span>{message.likes}</span>
                  </div>
                )}
              </Button>

              <Button
                size="icon"
                className="h-9 p-2 bg-white rounded-lg hover:bg-gray-100 transition"
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollMessage;
