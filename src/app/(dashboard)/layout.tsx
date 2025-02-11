"use client";

import DashboardLayoutProvider from "@/components/layout-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutProvider>{children}</DashboardLayoutProvider>;
}
