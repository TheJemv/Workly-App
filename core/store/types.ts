import { Profile } from "@/types/Company";
import CompanyType from "@/types/Company/Company.types";
import { User } from "@react-native-firebase/auth";

// WebSocket status
export type SocketStatus = "disconnected" | "connecting" | "connected";

// Customer types
export interface Customer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    // Agrega más campos según tu modelo
}

export interface Order {
    id: string;
    status: string;
    total: number;
    // Agrega más campos según tu modelo
}

export interface Chat {
    id: string;
    room: string;
    lastMessage?: string;
    // Agrega más campos según tu modelo
}

// Message types
export interface Message {
    id: string;
    room: string;
    content: string;
    timestamp: number;
    userId: string;
    // Agrega más campos según tu modelo
}

export interface Service {
    id: string;
    name: string;
    loaded?: boolean;
    data?: Service[];
    // Agrega más campos según tu modelo
}

export interface Sale {
    id: string;
    amount: number;
    // Agrega más campos según tu modelo
}

// Estado principal del store
export interface GlobalState {
    // Server
    initialized: boolean;
    socket: WebSocket | null;
    serverUp: boolean;

    // Socket reconnection
    connectInFlight: boolean;
    autoRetryCount: number;
    autoRetryEnabled: boolean;
    retryTimer: NodeJS.Timeout | null;
    socketStatus: SocketStatus;
    silentRetryCount: number;

    // User
    token: string | null;
    user: User | null;

    // Customer
    customer: Customer | null;
    orders: {
        loaded: boolean;
        data: Order[];
    } | null;
    chats: Chat[];

    // Messages
    messagesList: Message[];
    messagesNext: string | null;
    messagesUser: string | null;
    messagesRoom: string | null;

    // Company
    company: CompanyType | null;
    services: {
        loaded: boolean;
        data: Service[];
    } | null;
    sales: {
        loaded: boolean;
        data: Sale[];
    } | null;
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
    socketConnect: (options?: { auto?: boolean }) => Promise<void>;
    handleRetrySocket: () => void;
    onAppForeground: () => void;

    // API calls via WebSocket
    sendMessage: (room: string, message: string) => void;
    messageList: (room: string, page?: number) => void;
    companyReload: () => void;
    getServices: () => void;
    removeTempService: (id: string) => void;
    getOrders: () => void;
    getSales: () => void;
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