export interface Portefeuille {
  id: string;
  solde: string; // décimal Laravel sérialisé en string, ex. "10500.00"
  user_id: string;
}

export type MouvementType = "RECHARGE" | "DEBIT";
export type MouvementStatut = "EN_ATTENTE" | "VALIDE" | "REJETE";
export type TypeTransaction =
  | "ACHAT_BILLET"
  | "RECHARGE_PORTEFEUILLE"
  | "ABONNEMENT"
  | null;

export interface MouvementPortefeuille {
  id: string;
  type: MouvementType;
  montant: string; // décimal Laravel sérialisé en string
  statut: MouvementStatut;
  type_transaction: TypeTransaction;
  mode: string | null;
  reference: string | null;
  created_at: string;
}
