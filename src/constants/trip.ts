export const ROUTE = {
  departure: "Dakar",
  destination: "Île de Gorée",
};

export const CHILD_PRICE = 500;
export const ADULT_PRICE = 1500;
export const FOREIGNER_PRICE = 5000;

export type PassengerTypeId = "enfant" | "adulte" | "etranger";

export interface PassengerType {
  id: PassengerTypeId;
  label: string;
  price: number;
  icon: "happy-outline" | "person-outline" | "globe-outline";
}

export const PASSENGER_TYPES: PassengerType[] = [
  { id: "enfant", label: "Enfant", price: CHILD_PRICE, icon: "happy-outline" },
  { id: "adulte", label: "Adulte résident", price: ADULT_PRICE, icon: "person-outline" },
  { id: "etranger", label: "Étranger", price: FOREIGNER_PRICE, icon: "globe-outline" },
];

export function formatFcfa(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export interface TimeSlot {
  time: string;
  seatsAvailable: number;
}

// TODO: remplacer par les créneaux + places renvoyés par l'API (dépendent du jour ET du trajet choisi).
const TIME_STRINGS = ["07h00", "08h30", "10h00", "11h00", "12h00", "14h30", "16h00", "17h30"];

export function getTimeSlots(dateIso: string): TimeSlot[] {
  const seed = dateIso.split("-").reduce((sum, part) => sum + Number(part), 0);
  return TIME_STRINGS.map((time, i) => ({
    time,
    seatsAvailable: 20 + ((seed + i * 17) % 130),
  }));
}

const DAY_NAMES = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

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

export interface TripDate {
  iso: string;
  label: string;
  weekday: string;
  dayNumber: number;
  monthShort: string;
  isToday: boolean;
}

// TODO: remplacer par les jours disponibles renvoyés par l'API.
export function getUpcomingDates(count = 8): TripDate[] {
  const today = new Date();
  const dates: TripDate[] = [];

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    let label: string;
    if (i === 0) label = "Aujourd'hui";
    else if (i === 1) label = "Demain";
    else label = `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;

    dates.push({
      iso: d.toISOString().slice(0, 10),
      label,
      weekday: DAY_NAMES[d.getDay()],
      dayNumber: d.getDate(),
      monthShort: MONTH_NAMES[d.getMonth()],
      isToday: i === 0,
    });
  }

  return dates;
}
