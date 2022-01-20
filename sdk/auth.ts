import {
  ApiError,
  Session,
  User,
  AuthChangeEvent,
  AuthSession,
} from "@supabase/supabase-js";

import { supabase } from "./supabase";

// Get current user
export const getUser = async () => supabase.auth.user();

// Get Session From Url
export const getSessionFromUrl = () => {
  return supabase.auth.getSessionFromUrl();
};

// Listen to auth state
export const authStateChange = (
  callback: (event: AuthChangeEvent, session: AuthSession | null) => any
) =>
  supabase.auth.onAuthStateChange((event, session) => callback(event, session));

// Sign Up
export const signUp = async (
  email: string,
  password: string,
  redirectTo?: string
): Promise<{
  user: User | null;
  session: Session | null;
  error: ApiError | null;
}> => {
  return supabase.auth
    .signUp(
      { email: email, password: password },
      {
        redirectTo: redirectTo,
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

// Sign In
export const signIn = async (
  email: string,
  password: string
): Promise<{
  user: User | null;
  session: Session | null;
  error: ApiError | null;
}> =>
  await supabase.auth.signIn({
    email: email,
    password: password,
  });

// Logout
export const signOut = async (): Promise<{
  error: ApiError | null;
}> => await supabase.auth.signOut();

// Get session
export const getSession = () => supabase.auth.session();

// Get user by cookie
// export const getUserByCookie = async (req) =>
//   await supabase.auth.api.getUserByCookie(req);
