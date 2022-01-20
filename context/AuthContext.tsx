import { createContext, useEffect, useState } from "react";
import { authStateChange, getSession } from "../sdk/auth";
import { User } from "@supabase/supabase-js";
import Router from "next/router";
import { supabase } from "../sdk/supabase";

export const AuthContext = createContext<User | null | undefined>(undefined);

export const AuthWrapper = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  // Get initial session and end loading
  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session?.user);
    } else {
      setUser(null);
    }
  }, []);

  // Subscribe to auth state change
  useEffect(() => {
    // Auth listener
    const { data: authListener } = authStateChange((event, session) => {
      // Save user
      setUser(session?.user);

      // Cookie for SSR
      fetch("/api/auth", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ event, session }),
      });

      // Redirect on logout
      if (event === "SIGNED_OUT") {
        Router.push("/");
      }
    });

    return () => authListener?.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("accessToken", JSON.stringify(user));
    }
    if (!user) {
      localStorage.removeItem("accessToken");
    }
  }, [user]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
