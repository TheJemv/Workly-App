import { create } from "zustand";
import { initialState } from "./store/initialState";
import { createSocketHandlers } from "./store/socketHandlers";
import { createAuthHandlers } from "./store/authHandlers";
import { GlobalStore } from "./store/types";

const useGlobal = create<GlobalStore>((set, get) => ({
    ...initialState,

    // Auth & Init Handlers
    ...createAuthHandlers(set, get),

    // Socket Handlers
    ...createSocketHandlers(set, get),

    // API Handlers (inline)
    sendMessage: (room: string, message: string) => {
        const { socket } = get();
        if (!socket) {
            console.warn("[API] No hay socket conectado");
            return;
        }

        socket.send(
            JSON.stringify({
                source: "message.send",
                room,
                message,
            })
        );
    },

    messageList: (room: string, page: number = 0) => {
        if (page === 0) {
            set({
                messagesList: [],
                messagesNext: null,
                messagesUser: null,
                messagesRoom: null,
            });
        } else {
            set({
                messagesNext: null,
            });
        }

        const { socket } = get();
        if (!socket) {
            console.warn("[API] No hay socket conectado");
            return;
        }

        socket.send(
            JSON.stringify({
                source: "message.list",
                room,
                page,
            })
        );
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

    getOrders: () => {
        set((state) => ({
            orders: {
                loaded: false,
                data: state.orders?.data || [],
            },
        }));

        const { socket } = get();
        if (!socket) {
            console.warn("[API] No hay socket conectado");
            return;
        }

        socket.send(
            JSON.stringify({
                source: "orders.list",
            })
        );
    },

    getSales: () => {
        set((state) => ({
            sales: {
                loaded: false,
                data: state.sales?.data || [],
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