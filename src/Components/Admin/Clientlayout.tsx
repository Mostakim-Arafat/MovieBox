"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "@/Components/Homepage/Navbar";
import Footer from "@/Components/Homepage/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const adminMessage = searchParams.get("admin");

    if (adminMessage === "access-denied") {
      toast.error("Only administrators can access the dashboard");
    } else if (adminMessage === "login-required") {
      toast.error("Please log in to access the admin dashboard");
    } else {
      return;
    }

    router.replace(pathname || "/");
  }, [pathname, router, searchParams]);

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}