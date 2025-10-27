import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, BarChart2 } from "lucide-react";

export default function CreatePostDropdown({ onCreatePoll }: { onCreatePoll: () => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <MoreVertical className="w-5 h-5" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="bg-white shadow-lg rounded-md p-2">
        <DropdownMenu.Item
          onSelect={onCreatePoll}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
        >
          <BarChart2 className="w-4 h-4" /> Create Poll
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
