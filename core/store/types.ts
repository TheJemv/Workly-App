import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import MessageType from "enum/MessageType";
import { Customer } from "@/types/Customer";
import { Service as ServiceData } from "@/types/Service";
import { Company } from "@/types/Company";
import { Order } from "@/types/Order";

// WebSocket status
export type SocketStatus = "disconnected" | "connecting" | "connected";

export interface Chat {
    id: string;
    customers: Customer[];
    lastMessage: Message | null;
    messages: Message[];        // 👈 mensajes del chat
    messagesNext: string | null; // 👈 paginación
    messagesLoaded: boolean;    // 👈 si ya cargó
}

export interface Message {
    id: string;
    tempId?: string | null;
    room: { id: string };
    content: string;
    type: MessageType;
    createdAt: string;
    timestamp?: number;
    customer?: {
        id: string;
        uid: string;
        profile?: any;
    } | null;
    order?: any | null;
    billing?: any | null;
    location?: any | null;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
}

export interface PaginatedData<T> {
    loaded: boolean;
    data: T[];
    meta: PaginationMeta | null;
}

// Estado principal del store
export interface GlobalState {
    // Server
    initialized: boolean;
    socket: WebSocket | null;
    serverUp: boolean;

    // Socket reconnection
    connectInFlight: boolean;
    attempts: number;
    autoRetryEnabled: boolean;
    retryTimer: NodeJS.Timeout | null;
    socketStatus: SocketStatus;

    // User
    token: string | null;
    user: FirebaseAuthTypes.User | null;
    // Customer
    customer: Customer | null;
    orders: PaginatedData<Order> | null;

    // Messages
    chats: Chat[];
    activeRoom: string | null;

    // Company
    company: Company | null;
    services: {
        loaded: boolean;
        data: ServiceData[];
    } | null;
    sales: PaginatedData<Order> | null;
}

// Actions del store
export interface GlobalActions {
    // Auth & Init
    clearData: () => void;
    init: () => Promise<void>;
    setToken: (token: string | null) => void;
    serverPing: () => Promise<boolean>;
    // Socket
    clearRetryTimer: () => void;
    socketDisconnect: () => void;
    socketConnect: () => Promise<void>;
    handleRetrySocket: () => void;
    onAppForeground: () => void;
    // API calls via WebSocket
    sendMessage: (room: string, message: string, temp?: string | null, type?: MessageType) => void;
    messageList: (room: string, page?: number) => void;
    companyReload: () => void;
    getServices: () => void;
    removeTempService: (id: string) => void;
    getOrders: (page?: number) => void;   // 👈 page opcional
    getSales: (page?: number) => void;    // 👈 page opcional
}

// Store completo
export type GlobalStore = GlobalState & GlobalActions;

// Tipos para los handlers
export type SetState = (
    partial: Partial<GlobalState> | ((state: GlobalState) => Partial<GlobalState>)
) => void;
export type GetState = () => GlobalStore;

// Tipos para respuestas WebSocket
export interface WebSocketMessage<T = any> {
    type: string;
    data?: T;
}

export type WebSocketHandler = (
    set: SetState,
    get: GetState,
    data?: any
) => void;