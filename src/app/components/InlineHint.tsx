 "use client";

import { useEffect, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip"; // ← tooltip.tsx の場所に合わせて

type Props = {
  label: string;
  content: string;
  labelClassName?: string;
};

export function InlineHint({ label, content, labelClassName = "" }: Props) {
  // Radix Tooltip を「クリックで開く」もできるように controlled にする
  const [open, setOpen] = useState(false);

  // 外側クリックで閉じる（スマホ向け）
  useEffect(() => {
    const onDocClick = () => setOpen(false);
    if (!open) return;
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <span
          className={labelClassName}
          role="button"
          tabIndex={0}
          onClick={(e) => {
            // クリックでトグル（スマホ想定）。PCでもクリックしたら開く。
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((v) => !v);
            }
            if (e.key === "Escape") setOpen(false);
          }}
        >
          {label}
        </span>
      </TooltipTrigger>

      <TooltipContent
  side="bottom"
  align="start"
  sideOffset={6}
  className="max-w-[min(70vw,28rem)] whitespace-normal rounded border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 shadow"
  onClick={(e) => e.stopPropagation()}
>
  {content}
</TooltipContent>

    </Tooltip>
  );
}
