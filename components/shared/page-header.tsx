import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, className, action }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
        {description ? <p className="text-sm text-zinc-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
