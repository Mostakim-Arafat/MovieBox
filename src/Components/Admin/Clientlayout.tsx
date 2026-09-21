"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "@/Components/Homepage/Navbar";
import Footer from "@/Components/Homepage/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const adminMessage = new URLSearchParams(window.location.search).get("admin");

    if (adminMessage === "access-denied") {
      toast.error("Only administrators can access the dashboard");
    } else if (adminMessage === "login-required") {
      toast.error("Please log in to access the admin dashboard");
    } else {
      return;
    }

    router.replace(pathname || "/");
  }, [pathname, router]);

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}