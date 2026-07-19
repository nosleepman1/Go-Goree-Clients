export type JourSemaine =
  | "LUNDI"
  | "MARDI"
  | "MERCREDI"
  | "JEUDI"
  | "VENDREDI"
  | "SAMEDI"
  | "DIMANCHE";

export interface Trajet {
  id: string;
  jour: JourSemaine;
  heure_depart: string; // "HH:mm:ss"
  duree: string; // heures, décimal Laravel sérialisé en string (ex. "20.00")
}

export interface Chaloupe {
  id: string;
  imatriculation: string;
  nom: string;
  capacite: number;
  statut: string;
}

export interface Voyage {
  id: string;
  date_voyage: string; // "YYYY-MM-DD"
  places: number;
  places_restantes: number;
  trajet: Trajet;
  chaloupe: Chaloupe;
  created_at: string;
}

export interface TripSelection {
  voyage: Voyage;
  dateLabel: string;
  timeLabel: string;
}
