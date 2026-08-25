import { getAuth } from "@react-native-firebase/auth";
import { API_HOST } from "@env";
import { SetState, GetState, GlobalActions } from "./types";

export const createAuthHandlers = (
    set: SetState,
    get: GetState
): Pick<GlobalActions, "clearData" | "init" | "setToken" | "serverPing"> => ({
    clearData: () => {
        set({
            // customer
            customer: null,
            orders: null,

            // messages
            chats: [],
            activeRoom: null,

            // company
            company: null,
            services: null,
            sales: null,
        });
        console.log("🧹 Estado de usuario limpiado");
    },

    init: async () => {
        await get().serverPing();
        const auth = getAuth();
        const user = auth.currentUser;

        // Si no hay usuario, limpiar datos y salir
        if (!user) {
            get().clearData();
            return;
        }

        const token = await user.getIdToken(true);
        set({
            initialized: true,
            user,
            token,
        });

        // 🔑 iniciar socket DESPUÉS
        await get().socketConnect();
    },

    setToken: (token: string | null) => {
        // Si el token es null = cierre de sesión → limpiar todo
        if (!token) {
            get().clearData();
            get().socketDisconnect();
            set({ token: null, user: null });
            return;
        }

        set({ token, socketStatus: "connecting", attempts: 0 });
        get().socketConnect();
    },

    serverPing: async (): Promise<boolean> => {
        try {
            const res = await fetch(`${API_HOST}ping`);
            set({ serverUp: res.ok });
            return res.ok;
        } catch (err) {
            set({ serverUp: false });
            return false;
        }
    },
});