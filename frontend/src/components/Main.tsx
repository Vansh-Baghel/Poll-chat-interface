import ChatInput from "@/components/ChatInput";
import ChatList from "@/components/ChatList";
import Header from "@/components/Header";
import PollModal from "@/components/PollModal";
import { ChatItem } from "@/types";
import React, { useState } from "react";

const Main = () => {
  const [isPollModalOpen, setPollModalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>([]);

  return (
    <div className="flex flex-col h-screen ">
      <div className="justify-between">
        <div className="max-h-screen bg-gray-50 overflow-y-scroll p-4">
          <ChatList messages={messages} onSetMessages={setMessages} />
        </div>
        <ChatInput onSetMessages={setMessages} />
      </div>
      <PollModal
        open={isPollModalOpen}
        onClose={() => setPollModalOpen(false)}
      />
    </div>
  );
};

export default Main;
