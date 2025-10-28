import ChatInput from "@/components/ChatInput";
import ChatList from "@/components/ChatList";
import Header from "@/components/Header";
import PollModal from "@/components/PollModal";
import { ChatItem } from "@/types";
import React, { useState } from "react";

const Main = () => {
  const [messages, setMessages] = useState<ChatItem[]>([]); 

  return (
    <div className="flex flex-col h-screen">
      <div className="justify-between">
        <div className="min-h-screen bg-gray-50 overflow-y-scroll p-4 flex flex-col justify-end">
          <ChatList messages={messages} onSetMessages={setMessages} />
        </div>
        <ChatInput onSetMessages={setMessages} />
      </div>
    </div>
  );
};

export default Main;
