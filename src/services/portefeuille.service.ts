import { apiClient } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { unwrapResource } from "@/api/normalize";
import { Portefeuille } from "@/types/wallet";
import { PaymentMode } from "@/types/billet";

// Modes acceptés par POST /portefeuille/recharge : tout sauf PORTEFEUILLE
// (rejeté explicitement par le backend — on ne recharge pas un wallet avec lui-même).
export type RechargeMode = Exclude<PaymentMode, "PORTEFEUILLE">;

// Réponse JSON brute du RechargeController (pas de wrapping { data }).
interface RechargeResponseBody {
  message: string;
  reference: string;
  montant: number;
  statut: string;
  redirect_url: string | null;
}

export interface RechargeResult {
  reference: string;
  redirectUrl: string | null;
}

export const portefeuilleService = {
  async get(): Promise<Portefeuille> {
    const { data } = await apiClient.get<{ data: Portefeuille }>(endpoints.portefeuille.get);
    return unwrapResource(data);
  },

  async recharge(montant: number, paymentMode: RechargeMode): Promise<RechargeResult> {
    const { data } = await apiClient.post<RechargeResponseBody>(endpoints.portefeuille.recharge, {
      montant,
      payment_mode: paymentMode,
    });
    return { reference: data.reference, redirectUrl: data.redirect_url };
  },
};
