import { CategorieTarif } from "@/types/billet";

export const CATEGORIE_LABELS: Record<CategorieTarif, string> = {
  ENFANT: "Enfant",
  ADULTE: "Adulte",
  RESIDENT: "Résident",
  ETRANGER: "Étranger",
};

export const CATEGORIE_ICONS: Record<
  CategorieTarif,
  "happy-outline" | "person-outline" | "home-outline" | "globe-outline"
> = {
  ENFANT: "happy-outline",
  ADULTE: "person-outline",
  RESIDENT: "home-outline",
  ETRANGER: "globe-outline",
};
