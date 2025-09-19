import { PlusCircle } from "lucide-react";

export function EmptyState({
  title = "Trống",
  hint = "Chưa có dữ liệu",
  action,
}) {
  return (
    <div className="text-center p-12 border rounded-2xl bg-white/50 dark:bg-neutral-900/50">
      <PlusCircle className="w-10 h-10 mx-auto opacity-50" />
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-1 opacity-70">{hint}</p>
      {action}
    </div>
  );
}
