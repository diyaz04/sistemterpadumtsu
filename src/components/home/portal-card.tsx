import * as React from "react";
import Link from "next/link";
import { ExternalLink, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICE_COLOR_STYLES, type ServiceColor } from "@/types";

export interface PortalCardProps {
  title: string;
  description?: string | null;
  url: string;
  category?: string;
  color?: ServiceColor;
  icon?: React.ReactNode;
  openInNewTab?: boolean;
  className?: string;
}

export function PortalCard({
  title,
  description,
  url,
  category,
  color = "green",
  icon,
  openInNewTab = true,
  className,
}: PortalCardProps) {
  const colorStyle = SERVICE_COLOR_STYLES[color] || SERVICE_COLOR_STYLES.green;

  return (
    <div
      className={cn(
        "card-madrasah group relative flex flex-col justify-between p-6 transition-all duration-300",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl border transition-transform duration-300 group-hover:scale-105",
              colorStyle.bg,
              colorStyle.text,
              colorStyle.border
            )}
          >
            {icon || <Globe className="w-6 h-6" />}
          </div>
          {category && (
            <span
              className={cn(
                "text-xs font-semibold px-2.5 py-1 rounded-full",
                colorStyle.badge
              )}
            >
              {category}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-emerald-100/60 dark:border-emerald-950/60 flex items-center justify-between">
        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1 group-hover:underline">
          Kunjungi Website
        </span>
        <Link
          href={url}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 group-hover:bg-gradient-to-r group-hover:from-[#0F5C3A] group-hover:to-[#16A34A] group-hover:text-white transition-all duration-300"
          aria-label={`Buka website ${title}`}
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
