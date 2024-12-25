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
