"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type DemoRole = "client" | "creator";

export interface DemoUser {
  id: string;
  name: string;
  role: DemoRole;
  avatar: string;
}

export const DEMO_CLIENT: DemoUser = {
  id: "client_demo",
  name: "Demo Client",
  role: "client",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=democlient&backgroundColor=d1d4f9",
};

export const DEMO_CREATOR: DemoUser = {
  id: "creator_demo",
  name: "Alex Rivera (Demo Creator)",
  role: "creator",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera&backgroundColor=b6e3f4",
};

interface RoleContextType {
  role: DemoRole;
  user: DemoUser;
  setRole: (role: DemoRole) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType>({
  role: "client",
  user: DEMO_CLIENT,
  setRole: () => {},
  toggleRole: () => {},
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<DemoRole>("client");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("skillswap_demo_role") as DemoRole | null;
      if (saved === "creator" || saved === "client") {
        setRoleState(saved);
      }
    } catch {
      // ignore localStorage errors in non-browser environments
    }
  }, []);

  const setRole = (newRole: DemoRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("skillswap_demo_role", newRole);
    } catch {
      // ignore
    }
  };

  const toggleRole = () => {
    setRole(role === "client" ? "creator" : "client");
  };

  const user = role === "client" ? DEMO_CLIENT : DEMO_CREATOR;

  return (
    <RoleContext.Provider value={{ role, user, setRole, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useDemoRole() {
  return useContext(RoleContext);
}
