"use client";

import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutForm() {
  useEffect(() => {
    logout();
  }, []);

  const router = useRouter();

  const logout = async () => {
    const res = await fetch("/api/auth/logout");

    if (res.status === 200) {
      deleteCookie("currentUser");
      deleteCookie("accessToken");
      router.push("/login");
    } else {
      router.push("/profile");
    }
  };

  return <span className="font-medium">logging out...</span>;
}
