"use client";

import { ReactNode, useState } from "react";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Drawer } from "@/components/ui/Drawer";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: ReactNode;
  description?: ReactNode;
  headerAction?: ReactNode;
  /** Compact chart shown inside the card */
  preview: ReactNode;
  /** Full detail view shown inside the drawer */
  detail: ReactNode;
  /** Optional override for drawer title */
  detailTitle?: ReactNode;
  /** Optional override for drawer description */
  detailDescription?: ReactNode;
  /** Optional widthClassName override (e.g. for wider drawers) */
  drawerWidth?: string;
  className?: string;
}

export function ChartCard({
  title,
  description,
  headerAction,
  preview,
  detail,
  detailTitle,
  detailDescription,
  drawerWidth,
  className
}: ChartCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className={cn("group cursor-pointer transition hover:shadow-elevated", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full text-left"
        >
          <CardHeader
            title={title}
            description={description}
            action={
              <div className="flex items-center gap-2">
                {headerAction}
                <span className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-bg-subtle/60 px-2 text-[10px] font-medium text-fg-muted opacity-0 transition group-hover:opacity-100">
                  <Maximize2 className="h-3 w-3" /> Drill down
                </span>
              </div>
            }
          />
          <CardBody>{preview}</CardBody>
        </button>
      </Card>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={detailTitle ?? title}
        description={detailDescription ?? description}
        widthClassName={drawerWidth}
        action={
          <button
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-subtle px-2 py-1 text-[11px] font-medium text-fg-muted hover:text-fg"
            type="button"
          >
            Export <ArrowUpRight className="h-3 w-3" />
          </button>
        }
      >
        {detail}
      </Drawer>
    </>
  );
}
