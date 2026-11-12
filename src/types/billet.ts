import { Voyage } from "./voyage";

export type CategorieTarif = "ENFANT" | "ADULTE" | "RESIDENT" | "ETRANGER";

export interface Tarif {
  id: string;
  categorie: CategorieTarif;
  prix: string; // décimal Laravel sérialisé en string, ex. "2000.00"
}

export type PaymentMode =
  | "WAVE"
  | "ORANGE_MONEY"
  | "YAS"
  | "CARTE_BANCAIRE"
  | "PORTEFEUILLE"
  | "PAYDUNYA";

export type BilletStatut = "EN_ATTENTE_PAIEMENT" | "PAYE" | "UTILISE" | "EXPIRE" | "ANNULE";

export interface Billet {
  id: string;
  qr_token: string;
  montant: string; // décimal Laravel sérialisé en string
  statut: BilletStatut;
  // Nullables : un voyage/tarif supprimé côté admin laisse le billet orphelin
  // (observé dans les données réelles), et la relation peut ne pas être chargée.
  voyage?: Voyage | null;
  tarif?: Tarif | null;
  created_at: string;
}

export interface PurchaseResult {
  billet: Billet;
  redirectUrl: string | null;
}
