import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { addPoll } from "@/apis";
import { ChatItem } from "@/types";
import { toast } from "sonner";

export default function PollModal({
  open,
  onClose,
  onSetMessages,
}: {
  open: boolean;
  onClose: () => void;
  onSetMessages: React.Dispatch<React.SetStateAction<ChatItem[]>>;
}) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);

  const addOption = () => setOptions([...options, ""]);

  const handleChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async () => {
    if (options.length < 2) {
      toast.error("Please provide a question and at least two options.");
      return;
    }

    if (!question.trim()) {
      toast.error("Please provide a question and at least two options.");
      return;
    }

    if (options.some((opt) => !opt.trim())) {
      toast.error("Options cannot be empty.");
      return;
    }

    const response = await addPoll(question, options.map((text) => ({ text })));    
    const { data } = response;

    onSetMessages((prevMessages) => {
      const updated = [
        ...prevMessages,
        {
          id: data.id,
          user_id: data.user_id,
          name: data.name,
          message: "",
          created_at: data.created_at,
          isRight: true,
          is_liked: false,
          likes: 0,
          type: "poll",
          poll: {
            question: data.poll.question,
            options: data.poll.options,
          },
        },
      ];

      // ✅ Sort by created_at before setting
      return updated.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
    onClose();
    setQuestion("");
    setOptions([""]);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Create Poll
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <Input
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mb-4"
          />

          {options.map((opt, i) => (
            <Input
              key={i}
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => handleChange(i, e.target.value)}
              className="mb-2"
            />
          ))}

          <Button onClick={addOption} className="flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4" /> Add Option
          </Button>

          <Button className="w-full" onClick={handleSubmit}>
            Create Poll
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
