export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://api.example.com";

export const APP_NAME = "Go Goree";

// TODO: passer à false une fois le backend d'authentification disponible.
// Simule login/register sans appel API pour pouvoir naviguer dans l'app en attendant.
export const MOCK_AUTH = true;
