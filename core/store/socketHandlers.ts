// socketHandler.ts
import { Platform } from "react-native";
import { API_WEBHOOK } from "@env";
import { SetState, GetState, GlobalActions } from "./types";
import { responses } from "./websocketResponses";

const MAX_SILENT_RETRIES = 3;
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
            autoRetryCount: 0,
            silentRetryCount: 0,
        });
    },

    socketConnect: async ({ auto = true }: { auto?: boolean } = {}) => {
        const { token, socket, connectInFlight, socketStatus } = get();

        if (!token || token.trim?.()?.length === 0) {
            set({ socketStatus: "disconnected" });
            return;
        }

        if (connectInFlight) return;

        if (
            socket &&
            (socket.readyState === WebSocket.OPEN ||
                socket.readyState === WebSocket.CONNECTING)
        ) return;

        get().clearRetryTimer();

        if (socketStatus !== "connected") {
            set({ socketStatus: "connecting" });
        }

        set({ connectInFlight: true });

        const ok = await get().serverPing();
        if (!ok) {
            set({ connectInFlight: false, socket: null });
            if (get().socketStatus !== "connected") set({ socketStatus: "disconnected" });
            return;
        }

        const ws =
            Platform.OS === "android"
                ? new WebSocket(`ws://${API_WEBHOOK}/ws?token=${token}`)
                : new WebSocket(`wss://${API_WEBHOOK}/ws?token=${token}`);

        set({ socket: ws });

        ws.onopen = () => {
            console.log(`🟢 [${new Date().toLocaleTimeString()}] Socket conectado`);

            set({
                socketStatus: "connected",
                connectInFlight: false,
                silentRetryCount: 0,
            });

            // ✅ helper para enviar ping
            const sendPing = () => {
                try {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: "ping", timestamp: Date.now() }));
                        console.log(`🏓 [${new Date().toLocaleTimeString()}] Ping enviado`);
                    }
                } catch { }
            };

            // ✅ Ping inicial
            sendPing();

            // ✅ Ping cada 50s (keepalive)
            const pingInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) sendPing();
                else clearInterval(pingInterval);
            }, PING_INTERVAL_MS);

            (ws as any)._pingInterval = pingInterval;
        };

        ws.onerror = () => {
            try { ws.close(); } catch { }
        };

        ws.onclose = () => {
            console.log(`🔴 [${new Date().toLocaleTimeString()}] Socket cerrado`);

            const pingInterval = (ws as any)._pingInterval;
            if (pingInterval) clearInterval(pingInterval);

            set({ socket: null, connectInFlight: false });

            const { token } = get();
            if (!token) return;

            const nextSilent = get().silentRetryCount + 1;

            if (nextSilent <= MAX_SILENT_RETRIES) {
                set({ silentRetryCount: nextSilent });

                const delay = 800 * nextSilent;
                const timer = setTimeout(() => {
                    set({ retryTimer: null });
                    get().socketConnect({ auto: true });
                }, delay);

                set({ retryTimer: timer });
                return;
            }

            set({
                socketStatus: "connecting",
                silentRetryCount: nextSilent,
                autoRetryCount: 0,
            });

            const timer = setTimeout(() => {
                set({ retryTimer: null });
                get().socketConnect({ auto: true });
            }, 800);

            set({ retryTimer: timer });
        };

        ws.onmessage = (e: MessageEvent) => {
            let parsed: any;
            try {
                parsed = JSON.parse(e.data);
            } catch {
                console.warn("[WS] mensaje no JSON:", e.data);
                return;
            }

            if (!parsed?.type) return;

            // ✅ opcional: si tu server responde pong, puedes loguearlo
            // if (parsed.type === "pong") return;

            const handler = responses[parsed.type];
            if (!handler) {
                console.warn("[WS] sin handler para:", parsed.type);
                return;
            }

            handler(set, get, parsed.data);
        };
    },

    handleRetrySocket: () => {
        if (!get().token) return;
        get().clearRetryTimer();

        set({
            socketStatus: "connecting",
            connectInFlight: false,
            silentRetryCount: 0,
        });

        get().socketConnect({ auto: true });
    },

    onAppForeground: () => {
        const { token } = get();
        if (!token) return;
        get().socketConnect({ auto: true });
    },
});