import { DataDays, DayName } from "@/types/Schedule";
import timeToMinutes from "utils/TimeToMinuts";

export const SCHEDULE_DAYS: DayName[] = [
   "Lunes",
   "Martes",
   "Miércoles",
   "Jueves",
   "Viernes",
   "Sábado",
   "Domingo",
];

export type OpenStatus = { open: boolean; label: string };

/** Índice de HOY en `SCHEDULE_DAYS` (Lunes = 0, Domingo = 6). */
export const todayIndex = (): number => (new Date().getDay() + 6) % 7;

/**
 * Estado de atención de la empresa AHORA, a partir de sus `businessHours`.
 * Devuelve `null` si no hay horarios cargados.
 */
export function getOpenStatus(businessHours?: DataDays): OpenStatus | null {
   if (!businessHours) return null;

   const today = SCHEDULE_DAYS[todayIndex()];
   const day = businessHours[today];
   if (!day) return null;
   if (!day.open) return { open: false, label: "Cerrado hoy" };

   const now = new Date();
   const minutes = now.getHours() * 60 + now.getMinutes();
   const start = timeToMinutes(day.intervals.start);
   const end = timeToMinutes(day.intervals.end);

   if (minutes < start) return { open: false, label: `Abre a las ${day.intervals.start}` };
   if (minutes < end) return { open: true, label: `Abierto · cierra ${day.intervals.end}` };
   return { open: false, label: "Cerrado" };
}
