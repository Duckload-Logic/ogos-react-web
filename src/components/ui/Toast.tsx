import { Bell } from "lucide-react";

interface Props {
  toasts: string[];
}

export default function Toast({ toasts }: Props) {
  return (
    <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-3">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className="bg-card border shadow-xl rounded-xl px-5 py-3 text-sm flex items-center gap-3"
        >
          <Bell size={16} />
          {toast}
        </div>
      ))}
    </div>
  );
}