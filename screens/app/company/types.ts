export type Social =
   | "facebook-square"
   | "linkedin-square"
   | "phone-square"
   | "instagram";

export type SocialMedia = {
   icon: Social;
   url?: string;
   phone?: string;
   isCall?: boolean;
   color: string;
};

export type Service = {
   title: string;
   description: string;
   price: number;
};

export type Time = {
   title: string;
   description: string;
};

export type DayName = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
export interface TimeInterval {
   start: string;
   end: string;
}

export interface Day {
   open: boolean;
   intervals: TimeInterval;
}

export type DataDays = {
   [key in DayName]: Day;
};

export type Period = 'AM' | 'PM';