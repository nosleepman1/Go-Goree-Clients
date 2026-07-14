import React, { createContext, useState } from "react";
import { Ticket } from "@/types";

type NewTicket = Omit<Ticket, "id" | "qrToken" | "purchasedAt" | "status">;

interface TicketsContextValue {
  tickets: Ticket[];
  addTicket: (data: NewTicket) => Ticket;
  getTicket: (id: string) => Ticket | undefined;
}

export const TicketsContext = createContext<TicketsContextValue | undefined>(undefined);

const TOKEN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// TODO: le backend (Laravel) génère et renvoie le vrai qr_token à l'achat.
// Cette génération locale est un mock en attendant le branchement API.
function generateQrToken(length = 32) {
  let token = "";
  for (let i = 0; i < length; i++) {
    token += TOKEN_CHARS[Math.floor(Math.random() * TOKEN_CHARS.length)];
  }
  return token;
}

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  function addTicket(data: NewTicket) {
    const ticket: Ticket = {
      ...data,
      id: `GG-${Date.now().toString(36).toUpperCase()}`,
      qrToken: generateQrToken(),
      purchasedAt: new Date().toISOString(),
      status: "valide",
    };
    setTickets((prev) => [ticket, ...prev]);
    return ticket;
  }

  function getTicket(id: string) {
    return tickets.find((t) => t.id === id);
  }

  return (
    <TicketsContext.Provider value={{ tickets, addTicket, getTicket }}>
      {children}
    </TicketsContext.Provider>
  );
}
