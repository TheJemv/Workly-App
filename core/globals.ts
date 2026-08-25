import { create } from "zustand";
import { initialState } from "./store/initialState";
import { createSocketHandlers } from "./store/socketHandlers";
import { createAuthHandlers } from "./store/authHandlers";
import { GlobalStore } from "./store/types";
import MessageType from "enum/MessageType";

const useGlobal = create<GlobalStore>((set, get) => ({
    ...initialState,

    // Auth & Init Handlers
    ...createAuthHandlers(set, get),

    // Socket Handlers
    ...createSocketHandlers(set, get),

    // API Handlers (inline)
    // Devuelve true/false para que la UI sepa si debe des-marcar el mensaje
    // optimista (antes fallaba en silencio y el bubble gris se quedaba pegado
    // para siempre si no había socket o se caía la conexión).
    sendMessage: (room: string, message: string, temp: string | null, type = MessageType.TEXT) => {
        const { socket } = get();
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.warn("[API] No hay socket conectado");
            return false;
        }

        try {
            socket.send(
                JSON.stringify({
                    source: "message.send",
                    room,
                    message,
                    tempId: temp,
                    type
                })
            );
            return true;
        } catch (e) {
            console.warn("[API] Error enviando mensaje", e);
            return false;
        }
    },

    // Pide la lista de chats al servidor (responde vía websocket con "message.chats",
    // ver responseMessageChats). Sin esto, el pull-to-refresh de la pantalla de
    // mensajes llamaba a una función que no existía y tronaba.
    getChats: () => {
        const { socket } = get();
        if (!socket) {
            console.warn("[API] No hay socket conectado");
            return;
        }

        socket.send(
            JSON.stringify({
                source: "message.chats",
            })
        );
    },

    messageList: (room: string, page: number = 0) => {
        const { socket, chats } = get();
        const chat = chats.find(c => c.id === room);
        if (page === 0 && chat?.messagesLoaded) {
            set({ activeRoom: room });
            return;
        }

        set({ activeRoom: room });
        if (!socket) return;
        socket.send(JSON.stringify({ source: "message.list", room, page }));
    },

    companyReload: () => {
        const { socket } = get();
        if (!socket) {
            console.warn("[API] No hay socket conectado");
            return;
        }

        socket.send(
            JSON.stringify({
                source: "company.reload",
            })
        );
    },

    getServices: () => {
        set((state) => ({
            services: {
                loaded: false,
                data: state.services?.data || [],
            },
        }));

        const { socket } = get();
        if (!socket) {
            console.warn("[API] No hay socket conectado");
            return;
        }

        socket.send(
            JSON.stringify({
                source: "services.list",
            })
        );
    },

    removeTempService: (id: string) => {
        set((state) => ({
            services: state.services
                ? {
                    ...state.services,
                    data: state.services.data.filter((service) => service.id !== id),
                }
                : null,
        }));
    },

    getOrders: (page: number = 1) => {
        console.log("📋 getOrders llamado con página:", page);

        set((state) => ({
            orders: {
                loaded: false,
                data: page === 1 ? (state.orders?.data ?? []) : (state.orders?.data ?? []), // 👈 mantén data existente
                meta: state.orders?.meta ?? null,
            },
        }));

        const { socket } = get();
        if (!socket) {
            console.warn("[API] No hay socket conectado");
            return;
        }

        socket.send(JSON.stringify({
            source: "orders.list",
            page,
            limit: 10,
        }));
    },

    getSales: () => {
        set((state) => ({
            sales: {
                loaded: false,
                data: state.sales?.data || [],
                meta: null,
            },
        }));

        const { socket } = get();
        if (!socket) {
            console.warn("[API] No hay socket conectado");
            return;
        }

        socket.send(
            JSON.stringify({
                source: "sales.list",
            })
        );
    },
}));

export default useGlobal;