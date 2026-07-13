export const ROUTE = {
  departure: "Dakar",
  destination: "Île de Gorée",
};

export const ADULT_PRICE = 5500;
export const CHILD_PRICE = 2750;

export function formatFcfa(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}
