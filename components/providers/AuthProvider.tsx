"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Routing rules
      if (!currentUser && !pathname.startsWith('/login')) {
        router.push('/login');
      } else if (currentUser && pathname.startsWith('/login')) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe && unsubscribe();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {/* Always render children so the component tree (and hook counts) stay
          stable between renders. Use opacity instead of visibility so the browser
          still computes real layout dimensions (ResizeObserver reads 0 for
          visibility:hidden elements, causing Recharts -1 errors). */}
      <div
        style={{
          opacity: loading ? 0 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          transition: 'opacity 0.15s ease',
        }}
        aria-hidden={loading}
      >
        {children}
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F9FB]">
          <div className="flex flex-col items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="#8A4FFF"/>
                <path d="M12 28C12 28 16 12 28 12" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="28" cy="28" r="4" fill="white"/>
                <circle cx="12" cy="12" r="4" fill="white"/>
              </svg>
              <span className="text-3xl font-extrabold tracking-tight text-[#1C1C2E]" style={{ fontFamily: 'var(--font-nunito)' }}>Rolled</span>
            </div>
            {/* Spinner */}
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
            </div>
            <p className="text-sm text-gray-500 tracking-wide">Authenticating…</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}
