import { apiClient } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { LaravelPaginated, unwrapPaginated, unwrapResource } from "@/api/normalize";
import { Voyage } from "@/types/voyage";

// Ces paramètres existent déjà côté backend (utilisés par l'admin) : on les
// consomme tels quels, sans en ajouter ni en modifier la sémantique côté API.
export interface ListVoyagesParams {
  date?: string; // "YYYY-MM-DD"
  periode?: "today" | "semaine";
  disponibles?: boolean;
}

// Le backend sérialise `date_voyage` en datetime ISO complet
// ("2026-07-19T00:00:00.000000Z"), pas en simple "YYYY-MM-DD" malgré la colonne
// SQL de type DATE. On normalise ici, une seule fois, pour que tout le reste de
// l'app puisse traiter `date_voyage` comme un "YYYY-MM-DD" fiable.
function normalizeVoyage(voyage: Voyage): Voyage {
  return { ...voyage, date_voyage: voyage.date_voyage.slice(0, 10) };
}

export const voyageService = {
  async list(params: ListVoyagesParams = {}): Promise<Voyage[]> {
    const { data } = await apiClient.get<LaravelPaginated<Voyage>>(endpoints.voyages.list, {
      params,
    });
    return unwrapPaginated(data).map(normalizeVoyage);
  },

  async get(id: string): Promise<Voyage> {
    const { data } = await apiClient.get<{ data: Voyage }>(endpoints.voyages.detail(id));
    return normalizeVoyage(unwrapResource(data));
  },
};
