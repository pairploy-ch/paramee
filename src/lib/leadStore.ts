"use client";

import { useEffect, useState } from "react";
import { leads as baseLeads, type Lead } from "./leads";

const NEW_LEADS_KEY = "paramee-new-leads";

function readNewLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(NEW_LEADS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeNewLeads(list: Lead[]) {
  window.localStorage.setItem(NEW_LEADS_KEY, JSON.stringify(list));
}

/** Browser-local fallback store used when Supabase isn't configured. */
export function useLeads() {
  const [newLeads, setNewLeads] = useState<Lead[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setNewLeads(readNewLeads());
    setReady(true);
  }, []);

  function addLead(lead: Lead) {
    setNewLeads((prev) => {
      const next = [lead, ...prev];
      writeNewLeads(next);
      return next;
    });
  }

  const leads: Lead[] = [...newLeads, ...baseLeads];

  return { leads, addLead, ready };
}
