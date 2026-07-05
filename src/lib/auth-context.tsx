"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Gamer = { nickname: string };

type AuthCtx = {
  gamer: Gamer | null;
  loading: boolean;
  login: (nickname: string, pin: string) => Promise<{ ok: boolean; mustChangePin?: boolean; error?: string }>;
  register: (nickname: string, pin: string) => Promise<{ ok: boolean; error?: string }>;
  changePin: (nickname: string, newPin: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "tav_gamer";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [gamer, setGamer] = useState<Gamer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setGamer(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (g: Gamer) => {
    setGamer(g);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(g));
  };

  const login = async (nickname: string, pin: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, pin }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    if (!data.mustChangePin) persist({ nickname: data.nickname });
    return { ok: true, mustChangePin: data.mustChangePin };
  };

  const register = async (nickname: string, pin: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, pin }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    persist({ nickname: data.nickname });
    return { ok: true };
  };

  const changePin = async (nickname: string, newPin: string) => {
    const res = await fetch("/api/auth/change-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, newPin }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error };
    persist({ nickname });
    return { ok: true };
  };

  const logout = () => {
    setGamer(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ gamer, loading, login, register, changePin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
