import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth, googleProvider } from "../lib/firebase";
import { checkWriterAuthorization } from "../services/blogService";
import type { AuthAccessRole, WriterRecord } from "../utils/blogLogic";

interface AuthContextValue {
  user: User | null;
  authReady: boolean;
  signingIn: boolean;
  accessRole: AuthAccessRole;
  writerProfile: WriterRecord | null;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAccess: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [accessRole, setAccessRole] = useState<AuthAccessRole>("guest");
  const [writerProfile, setWriterProfile] = useState<WriterRecord | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const resolveAccess = useCallback(
    async (currentUser: User | null, fromInteractiveSignIn = false) => {
      if (!currentUser) {
        setUser(null);
        setAccessRole("guest");
        setWriterProfile(null);
        return;
      }
      try {
        const result = await checkWriterAuthorization(currentUser);
        if (result.role === "admin" || result.role === "writer") {
          setUser(currentUser);
          setAccessRole(result.role);
          setWriterProfile(result.writerRecord);
          return;
        }
      } catch {
        // Fall through to immediate sign-out
      }

      // Immediately revoke unauthorized sessions so non-approved visitors never remain signed in
      await signOut(auth).catch(() => undefined);
      setUser(null);
      setAccessRole("guest");
      setWriterProfile(null);
      if (fromInteractiveSignIn) {
        setAuthError("This Google account is not authorized to sign in.");
      }
    },
    [],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      await resolveAccess(nextUser, false);
      setAuthReady(true);
    });
    return unsubscribe;
  }, [resolveAccess]);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    setSigningIn(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await resolveAccess(cred.user, true);
    } catch (error) {
      const code =
        typeof error === "object" && error !== null && "code" in error
          ? String((error as { code?: unknown }).code)
          : "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setAuthError(null);
      } else if (code === "auth/popup-blocked") {
        setAuthError(
          "Your browser blocked the Google sign-in popup. Please allow popups for this site and try again.",
        );
      } else {
        setAuthError(
          error instanceof Error
            ? error.message
            : "Could not complete Google sign-in. Please try again.",
        );
      }
    } finally {
      setSigningIn(false);
    }
  }, [resolveAccess]);

  const logout = useCallback(async () => {
    setAuthError(null);
    await signOut(auth);
    setUser(null);
    setAccessRole("guest");
    setWriterProfile(null);
  }, []);

  const refreshAccess = useCallback(async () => {
    await resolveAccess(auth.currentUser);
  }, [resolveAccess]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        signingIn,
        accessRole,
        writerProfile,
        authError,
        clearAuthError,
        signInWithGoogle,
        logout,
        refreshAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
