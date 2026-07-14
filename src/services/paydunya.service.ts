export type PaydunyaMethod = "wave" | "orange" | "yas";

interface PaydunyaResult {
  success: boolean;
  reference: string;
}

// TODO: brancher le vrai SDK/API Paydunya (checkout invoice + redirection ou webview).
// Wave, Orange Money et Yas passent tous par la même intégration Paydunya côté backend.
export async function payViaPaydunya(
  method: PaydunyaMethod,
  amount: number
): Promise<PaydunyaResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return {
    success: true,
    reference: `PAYDUNYA-${method.toUpperCase()}-${Date.now()}`,
  };
}
