import { TicketStatus } from "@/types";

export function ticketStatusLabel(status: TicketStatus): string {
  return status === "en_attente" ? "En attente" : status;
}
