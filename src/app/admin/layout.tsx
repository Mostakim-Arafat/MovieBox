import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/Components/Admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Failed to get session:", error);
    redirect("/login?admin=login-required");
  }

  if (!session?.user) {
    redirect("/login?admin=login-required");
  }

  if (session.user.role !== "admin") {
    redirect("/?admin=access-denied");
  }

  return <AdminShell>{children}</AdminShell>;
}

