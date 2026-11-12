import { apiClient } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { LaravelPaginated, unwrapPaginated } from "@/api/normalize";
import { Tarif } from "@/types/billet";

export const tarifService = {
  async list(): Promise<Tarif[]> {
    const { data } = await apiClient.get<LaravelPaginated<Tarif>>(endpoints.tarifs.list);
    return unwrapPaginated(data);
  },
};
