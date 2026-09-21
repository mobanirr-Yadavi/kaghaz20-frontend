"use client";

import { useState } from "react";
import { clearAuthToken } from "@/lib/authToken";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    // The backend has no logout endpoint (stateless JWT); dropping the token logs out.
    clearAuthToken();
    window.location.replace("/login");
  }

  return (
    <button type="button" disabled={loading} onClick={logout}>
      <LogOut aria-hidden width={20} height={20} strokeWidth={1.8} />
      {loading ? "در حال خروج…" : "خروج از حساب"}
    </button>
  );
}
