// socketHandlers.ts
import { Platform } from "react-native";
import { API_WEBHOOK } from "@env";
import { SetState, GetState, GlobalActions } from "./types";
import { responses } from "./websocketResponses";

const MAX_ATTEMPTS = 3;
const PING_INTERVAL_MS = 50_000;

export const createSocketHandlers = (
    set: SetState,
    get: GetState
): Pick<
    GlobalActions,
    | "clearRetryTimer"
    | "socketDisconnect"
    | "socketConnect"
    | "handleRetrySocket"
    | "onAppForeground"
> => ({
    clearRetryTimer: () => {
        const t = get().retryTimer;
        if (t) clearTimeout(t);
        set({ retryTimer: null });
    },

    socketDisconnect: () => {
        get().clearRetryTimer();
        const s = get().socket;

        try {
            const pingInterval = (s as any)?._pingInterval;
            if (pingInterval) clearInterval(pingInterval);
            s?.close();
        } catch { }

        set({
            socket: null,
            socketStatus: "disconnected",
            connectInFlight: false,
            attempts: 0,
        });
    },

    socketConnect: async () => {
        const { token, socket, connectInFlight } = get();

        // ✅ Regla 1: sin token no conecta
        if (!token || token.trim().length === 0) {
            set({ socketStatus: "disconnected" });
            return;
        }

        // Evitar conexiones duplicadas
        if (connectInFlight) return;

        if (socket) {
            // ✅ Si ya está abierto, asegúrate de reflejarlo en el estado
            if (socket.readyState === WebSocket.OPEN) {
                if (get().socketStatus !== "connected") {
                    set({ socketStatus: "connected", connectInFlight: false });
                }
                return;
            }

            if (socket.readyState === WebSocket.CONNECTING) {
                // opcional: mantener "connecting"
                if (get().socketStatus !== "connecting") set({ socketStatus: "connecting" });
                return;
            }
        }

        get().clearRetryTimer();
        set({ connectInFlight: true });

        const ws = new WebSocket(`${API_WEBHOOK}/ws?token=${token}`)

        set({ socket: ws });

        // ✅ Conectó → connected, reset attempts
        ws.onopen = () => {
            console.log(`🟢 [${new Date().toLocaleTimeString()}] Socket conectado`);

            set({
                socketStatus: "connected",
                connectInFlight: false,
                attempts: 0,
            });

            const sendPing = () => {
                try {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: "ping", timestamp: Date.now() }));
                        console.log(`🏓 [${new Date().toLocaleTimeString()}] Ping enviado`);
                    }
                } catch { }
            };

            sendPing();

            const pingInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) sendPing();
                else clearInterval(pingInterval);
            }, PING_INTERVAL_MS);

            (ws as any)._pingInterval = pingInterval;
        };

        ws.onerror = () => {
            try { ws.close(); } catch (e) {
                console.error(e)
            }
        };

        ws.onclose = () => {
            console.log(`🔴 [${new Date().toLocaleTimeString()}] Socket cerrado`);

            const pingInterval = (ws as any)._pingInterval;
            if (pingInterval) clearInterval(pingInterval);

            set({ socket: null, connectInFlight: false });

            // Si no hay token, no reintentar
            if (!get().token) return;

            const nextAttempts = get().attempts + 1;
            set({ attempts: nextAttempts });

            // ✅ Llegó al máximo → disconnected, para de reintentar
            if (nextAttempts >= MAX_ATTEMPTS) {
                console.log(`⛔ [${new Date().toLocaleTimeString()}] Max intentos alcanzado (${nextAttempts})`);
                set({ socketStatus: "disconnected" });
                return;
            }

            // ✅ Primer reintento (attempts = 1) → silencioso, no cambia el status
            // ✅ Segundo reintento en adelante (attempts > 1) → muestra "connecting"
            if (nextAttempts > 1) {
                set({ socketStatus: "connecting" });
            }

            console.log(`🔁 [${new Date().toLocaleTimeString()}] Reintento ${nextAttempts}/${MAX_ATTEMPTS}`);

            // Backoff: 1s, 2s, 4s...
            const delay = Math.pow(2, nextAttempts - 1) * 1000;
            const timer = setTimeout(() => {
                set({ retryTimer: null });
                get().socketConnect();
            }, delay);

            set({ retryTimer: timer });
        };

        ws.onmessage = (e: MessageEvent) => {
            let parsed: any;
            try {
                parsed = JSON.parse(e.data);
            } catch {
                // console.warn("[WS] mensaje no JSON:", e.data);
                return;
            }

            if (!parsed?.type) return;

            const handler = responses[parsed.type];
            if (!handler) {
                // console.warn("[WS] sin handler para:", parsed.type);
                return;
            }

            handler(set, get, parsed.data);
        };
    },

    // Llamado manualmente desde la UI cuando el usuario presiona "Reintentar"
    handleRetrySocket: () => {
        if (!get().token) return;
        get().clearRetryTimer();

        set({
            socketStatus: "connecting",
            connectInFlight: false,
            attempts: 0, // reset completo al reintentar manualmente
        });

        get().socketConnect();
    },

    onAppForeground: () => {
        if (!get().token) return;
        get().socketConnect();
    },
});