"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import type { User } from "@/types";
import { getAvatarUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { validateDemoCredentials } from "@/data/demo-accounts";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: "google") => Promise<{ success: boolean; error?: string; redirecting?: boolean }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function createUserFromEmail(email: string): User {
  const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  return {
    id: `user_${Date.now()}`,
    username,
    name,
    email,
    avatar: getAvatarUrl(email),
    bio: "",
    location: "",
    skills: [],
    builderDna: [],
    funPrompts: [],
    aiSummary: "",
    availability: "Open",
    interests: [],
    createdAt: new Date().toISOString(),
    online: true,
  };
}

function createUserFromSupabaseUser(supaUser: { id: string; email?: string; user_metadata?: Record<string, string> }): User {
  const email = supaUser.email || "user@buildr.dev";
  const meta = supaUser.user_metadata || {};
  const name = meta.full_name || meta.name || meta.user_name || email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const username = meta.user_name || meta.preferred_username || email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  const avatarUrl = meta.avatar_url || getAvatarUrl(email);

  return {
    id: supaUser.id,
    username,
    name,
    email,
    avatar: avatarUrl,
    bio: meta.bio || "",
    location: meta.location || "",
    github: meta.user_name || "",
    skills: [],
    builderDna: [],
    funPrompts: [],
    aiSummary: "",
    availability: "Open",
    interests: [],
    createdAt: new Date().toISOString(),
    online: true,
  };
}

const STORAGE_KEY = "buildr_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create supabase client once (stable reference)
  const supabase = useMemo(() => createClient(), []);

  // Check for existing session on mount
  const checkSession = useCallback(async () => {
    try {
      // First check localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
        setIsLoading(false);
        return;
      }

      // Then check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const newUser = createUserFromSupabaseUser(session.user);
        setUser(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      }
    } catch {
      // ignore errors
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    checkSession();

    // Listen for auth state changes (handles OAuth callback redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const existingSaved = localStorage.getItem(STORAGE_KEY);
        if (!existingSaved) {
          const newUser = createUserFromSupabaseUser(session.user);
          setUser(newUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [checkSession, supabase]);

  // Persist to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }
    if (!password || password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    // Validate against known demo accounts
    if (!validateDemoCredentials(email, password)) {
      return { success: false, error: "Invalid email or password. Use one of the demo accounts below." };
    }

    const newUser = createUserFromEmail(email);
    setUser(newUser);
    return { success: true };
  }, []);

  const loginWithOAuth = useCallback(async (provider: "google"): Promise<{ success: boolean; error?: string; redirecting?: boolean }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/onboarding`,
        },
      });

      if (error) {
        // If Supabase OAuth fails (e.g., provider not configured), fall back to demo
        console.warn("Supabase OAuth error, using demo mode:", error.message);
        const demoEmail = "builder@gmail.com";
        const newUser = createUserFromEmail(demoEmail);
        newUser.name = "Google Builder";
        newUser.username = "google_builder";
        setUser(newUser);
        return { success: true, redirecting: false };
      }

      // Supabase will redirect to the OAuth provider — DON'T navigate away
      return { success: true, redirecting: true };
    } catch {
      // Network error or other issue — fall back to demo mode
      const demoEmail = "builder@gmail.com";
      const newUser = createUserFromEmail(demoEmail);
      newUser.name = "Google Builder";
      newUser.username = "google_builder";
      setUser(newUser);
      return { success: true, redirecting: false };
    }
  }, [supabase]);

  const logout = useCallback(() => {
    supabase.auth.signOut().catch(() => {});
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, [supabase]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithOAuth,
    logout,
    updateUser,
  }), [user, isLoading, login, loginWithOAuth, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
