import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isOnboarded: boolean | null;
  setIsOnboarded: (val: boolean) => void;
  checkOnboardingStatus: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  const checkOnboardingStatus = async (): Promise<boolean> => {
    if (!session?.access_token) return false;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/onboarding/status`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      if (!response.ok) return false;
      const data = await response.json();
      setIsOnboarded(data.isOnboarded);
      return data.isOnboarded;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        setIsOnboarded(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check onboarding status whenever session changes
  useEffect(() => {
    if (session?.access_token) {
      checkOnboardingStatus();
    }
  }, [session?.access_token]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsOnboarded(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isOnboarded, setIsOnboarded, checkOnboardingStatus, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
