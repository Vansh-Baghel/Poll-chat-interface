import { useFormattedTime } from "@/hooks/useFormattedTime";
import { ChatItem } from "@/types";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { HeartIcon, Trash } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { deleteChat, toggleLikeChat } from "@/apis";
import { toast } from "sonner";
import DeleteConfirmModal from "@/modals/DeleteConfirmModal";

interface ChatMessageProps {
  message: ChatItem;
  onSetMessages: React.Dispatch<React.SetStateAction<ChatItem[]>>;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSetMessages,
}) => {
  const formattedTime = useFormattedTime(message.created_at);
  const { isRight } = message;
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const deleteOnClickHandler = async () => {
    const { data } = await deleteChat(message.user_id, message.id);
    toast.success(data.message);
    setDeleteModalOpen(false);
    onSetMessages((prevMessages) =>
      prevMessages.filter((prevMsg) => prevMsg.id !== message.id)
    );
  };

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
    >
      <div
        className={`min-w-[300px] max-w-[70%] rounded-2xl shadow-sm p-3 ${
          isRight
            ? "bg-purple-100 text-right"
            : "bg-green-50 text-left self-start"
        }`}
      >
        {!isRight && (
          <div
            className={`font-medium text-sm ${
              isRight ? "text-purple-500" : "text-green-500"
            }`}
          >
            {message.name}
          </div>
        )}
        <div className="text-gray-700">{message.message}</div>

        <div className="flex justify-between items-end pt-2">
          <div
            className={`${isRight ? "float-left" : "float-right"} flex gap-2`}
          >
            <Button
              className="h-9 p-2 bg-white rounded-lg"
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

            {isRight && (
              <Button
                size="icon"
                onClick={() => setDeleteModalOpen(true)}
                className="h-9 p-2 bg-white rounded-lg hover:bg-gray-100 transition"
              >
                <Trash size={16} />
              </Button>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">{formattedTime}</div>
          <DeleteConfirmModal
            content="Are you confirm you want to delete this chat?"
            onCancel={() => setDeleteModalOpen(false)}
            onOk={deleteOnClickHandler}
            open={deleteModalOpen}
            title="Delete"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
