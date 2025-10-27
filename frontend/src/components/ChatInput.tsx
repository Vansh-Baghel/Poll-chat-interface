import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreatePostDropdown from "./CreatePostDropdown";
import PollModal from "./PollModal";
import { toast } from "sonner";
import { useAuth } from "./contexts/auth.context";
import axios from "axios";
import { ChatItem } from "@/types";

export default function ChatInput({
  onSetMessages,
}: {
  onSetMessages: React.Dispatch<React.SetStateAction<ChatItem[]>>;
}) {
  const [message, setMessage] = useState("");
  const [isPollModalOpen, setPollModalOpen] = useState(false);
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  console.log("🚀 ~ ChatInput ~ token:", token);

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!user) toast.error("Please login to send messages.");
    else {
      try {
        const res = await axios.post(
          "http://localhost:8000/add-chat",
          {
            user_id: user.id,
            message,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // 👈 token here
            },
          }
        );

        const newMsg: ChatItem = { ...res.data, isRight: true };
        onSetMessages((prev: ChatItem[]) => [...prev, newMsg]); // update state immediately
      } catch (error) {
        toast.error("Failed to send message.");
      } finally {
        setMessage("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex p-3 border-t sticky bottom-0 bg-white">
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 mr-2"
      />
      <Button onClick={handleSend}>
        <Send className="w-4 h-4" />
      </Button>
      <CreatePostDropdown onCreatePoll={() => setPollModalOpen(true)} />
      <PollModal
        open={isPollModalOpen}
        onClose={() => setPollModalOpen(false)}
      />
    </div>
  );
}
