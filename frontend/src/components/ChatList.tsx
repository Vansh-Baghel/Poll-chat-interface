import { ChatItem } from "@/types";
import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { useAuth } from "./contexts/auth.context";
import PollMessage from "./PollMessage";
import { getAllChats } from "@/apis";

export default function ChatList({
  messages,
  onSetMessages,
}: {
  messages: ChatItem[];
  onSetMessages: React.Dispatch<React.SetStateAction<ChatItem[]>>;
}) {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getAllChats();
        const { data } = response;

        const newData = data.messages.map((msg: ChatItem) => ({
          ...msg,
          isRight: msg.user_id === user?.id,
        }));

        onSetMessages(newData);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div>
          {msg.type === "chat" ? (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSetMessages={onSetMessages}
            />
          ) : (
            <PollMessage
              key={msg.id}
              message={msg}
              onSetMessages={onSetMessages}
            />
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
