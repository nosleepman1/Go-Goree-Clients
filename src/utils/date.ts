const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const MONTH_NAMES = [
  "Jan",
  "Fév",
  "Mars",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export interface DateLabel {
  iso: string;
  label: string;
  weekday: string;
  dayNumber: number;
  monthShort: string;
  isToday: boolean;
}

/** `iso` doit être au format "YYYY-MM-DD" (celui renvoyé par l'API, ex. voyage.date_voyage). */
export function describeDate(iso: string): DateLabel {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date.getTime() - today.getTime()) / 86_400_000);

  let label: string;
  if (diffDays === 0) label = "Aujourd'hui";
  else if (diffDays === 1) label = "Demain";
  else label = `${DAY_NAMES[date.getDay()]} ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;

  return {
    iso,
    label,
    weekday: DAY_NAMES[date.getDay()],
    dayNumber: date.getDate(),
    monthShort: MONTH_NAMES[date.getMonth()],
    isToday: diffDays === 0,
  };
}

/** L'API renvoie l'heure de départ au format "HH:mm:ss" (colonne SQL TIME). */
export function formatHeureDepart(heureDepart: string): string {
  return heureDepart.slice(0, 5);
}

/** Date du jour au format "YYYY-MM-DD", en heure locale (pas d'UTC-shift via toISOString). */
export function todayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
