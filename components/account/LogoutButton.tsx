"use client";

import { useState } from "react";
import { clearAuthToken } from "@/lib/authToken";

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
      <DashboardIcon name="logout" />
      {loading ? "در حال خروج…" : "خروج از حساب"}
    </button>
  );
}

function DashboardIcon({ name }: { name: "logout" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-3" />
      <path d="M10 12h11m-4-4 4 4-4 4" />
    </svg>
  );
}
