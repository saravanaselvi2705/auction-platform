
import { InboxIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";

export default function EmptyState({
  title = "No items found",
  description = "There is nothing to show here at the moment.",
  actionText,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 max-w-md mx-auto my-8">
      <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100 mb-4">
        <InboxIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
