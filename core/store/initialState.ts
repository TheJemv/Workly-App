import { GlobalState } from "./types";

export const initialState: GlobalState = {
    // Server
    initialized: false,
    socket: null,
    serverUp: true,

    // socket reconnection
    connectInFlight: false,
    autoRetryCount: 0,
    autoRetryEnabled: true,
    retryTimer: null,
    socketStatus: "disconnected",
    silentRetryCount: 0,

    // user
    token: null,
    user: null,

    // customer
    customer: null,
    orders: null,
    chats: [],

    // messages
    messagesList: [],
    messagesNext: null,
    messagesUser: null,
    messagesRoom: null,

    // company
    company: null,
    services: null,
    sales: null,
};