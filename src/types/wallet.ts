export interface Portefeuille {
  id: string;
  solde: string; // décimal Laravel sérialisé en string, ex. "10500.00"
  user_id: string;
}
