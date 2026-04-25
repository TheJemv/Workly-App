import { GlobalState } from "./types";

export const initialState: GlobalState = {
    // Server
    initialized: false,
    socket: null,
    serverUp: true,

    // Socket reconnection
    connectInFlight: false,
    attempts: 0,          // ✅ un solo contador de reintentos
    autoRetryEnabled: true,
    retryTimer: null,
    socketStatus: "disconnected",

    // User
    token: null,
    user: null,

    // Customer
    customer: null,
    orders: null,

    // Messages
    chats: [],
    activeRoom: null,

    // Company
    company: null,
    services: null,
    sales: null,
};