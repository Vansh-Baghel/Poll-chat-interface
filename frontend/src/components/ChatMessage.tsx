import { useFormattedTime } from "@/hooks/useFormattedTime";
import { ChatItem } from "@/types";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Delete, Heart, HeartIcon, MoreVertical, Trash } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { toggleLikeChat } from "@/apis";

const ChatMessage = ({
  message,
  onSetMessages,
}: {
  message: ChatItem;
  onSetMessages: React.Dispatch<React.SetStateAction<ChatItem[]>>;
}) => {
  const formattedTime = useFormattedTime(message.created_at);
  const [hovered, setHovered] = useState(false);
  const { isRight } = message;
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <div
      className={`relative flex items-start ${
        isRight ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Message bubble */}
      <div
        className={`min-w-[15%] max-w-[70%] rounded-2xl shadow-sm p-3 ${
          isRight
            ? "bg-purple-100 text-right"
            : "bg-green-50 text-left self-start"
        }`}
      >
        <div
          className={`font-medium text-sm ${
            isRight ? "text-purple-500" : "text-green-500"
          }`}
        >
          {message.name}
        </div>
        <div className="text-gray-700">{message.message}</div>
        <div className="text-xs text-gray-400 mt-1">{formattedTime}</div>

        <div className={`${isRight ? "float-left" : "float-right"} flex gap-2`}>
          {/* Like Button */}
          <Button
            className={`h-9 p-2 bg-white rounded-lg`}
            // onClick={handleFavoriteClick}
          >
            {loading ? (
              <Spinner size="small" className="w-5" />
            ) : (
              <div className="flex items-center gap-1">
                <HeartIcon
                  className={`w-5 h-5 ${message.is_liked ? "fill-red-400" : "hover:fill-red-100"}`}
                  onClick={toggleLikeHandler}
                />
                <span>{message.likes}</span>
              </div>
            )}
          </Button>

          {/* Dropdown Button */}
          <Button
            size="icon"
            className="h-9 p-2 bg-white rounded-lg hover:bg-gray-100 transition"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
