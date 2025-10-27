import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function PollModal({ open, onClose }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);

  const addOption = () => setOptions([...options, ""]);
  const handleChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = () => {
    console.log({ question, options });
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0" />
        <Dialog.Content className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">Create Poll</Dialog.Title>
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

          <Button variant="ghost" onClick={addOption} className="flex items-center gap-2 mb-4">
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
