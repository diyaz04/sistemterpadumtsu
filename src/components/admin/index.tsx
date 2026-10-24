import * as React from "react";

// Admin components placeholder
export interface AdminComponentProps {
  className?: string;
}

export function AdminHeader() {
  return (
    <header className="p-4 border-b border-border bg-card">
      <h1 className="text-xl font-bold text-primary">Admin Portal Madrasah</h1>
    </header>
  );
}
