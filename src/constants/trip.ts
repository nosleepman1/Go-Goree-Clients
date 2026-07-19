export const ROUTE = {
  departure: "Dakar",
  destination: "Île de Gorée",
};

export function formatFcfa(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}
