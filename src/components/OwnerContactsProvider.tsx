"use client";

import { createContext, useContext } from "react";
import type { OwnerContactInfo } from "@/lib/data/owners";

const OwnerContactsContext = createContext<Record<string, OwnerContactInfo>>({});

export function OwnerContactsProvider({
  contacts,
  children,
}: {
  contacts: Record<string, OwnerContactInfo>;
  children: React.ReactNode;
}) {
  return <OwnerContactsContext.Provider value={contacts}>{children}</OwnerContactsContext.Provider>;
}

export function useOwnerContact(ownerId: string): OwnerContactInfo | null {
  const contacts = useContext(OwnerContactsContext);
  return contacts[ownerId] ?? null;
}
