import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DeleteIcon, Trash } from "lucide-react";

interface ConfirmModalProps {
  title: string;
  content: string;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({
  title,
  content,
  open,
  onOk,
  onCancel,
}: ConfirmModalProps) => (
  <Dialog open={open} onOpenChange={onCancel}>
    <DialogContent className="bg-white w-[400px]">
      <DialogTitle>
        <div className="border inline-flex items-center justify-center p-3 rounded-md bg-error-secondary">
          <Trash className="w-6 h-6 text-error-600" />
        </div>
      </DialogTitle>
      <div className="relative">
        <div className="text-lg font-semibold text-primary-900">{title}</div>
        <div className="text-sm leading-5 mt-1 mb-6">{content}</div>
        <div className="flex">
          <Button
            className="mr-3 w-full border leading-5"
            onClick={onCancel}
            tabIndex={-1}
          >
            Cancel
          </Button>
          <Button tabIndex={-1} className="w-full leading-5" onClick={onOk}>
            Delete
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default DeleteConfirmModal;
