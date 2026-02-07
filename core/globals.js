import { getAuth } from "@react-native-firebase/auth";
import { create } from "zustand";
import utils from "./utils";
import { API_WEBHOOK, API_HOST } from "@env";
import { Platform } from "react-native";

// Configuración de reconexión automática
const MAX_AUTO_RETRIES = 3;

const responseMessageSend = (set, get, data) => {
   const index = get().chats.findIndex((chat) => chat.id === data.room.id);

   // Verificar si el mensaje ya existe en el chat
   const checkIfExistMessage = get().chats[index]?.messages.find(
      (message) => message.id === data.id,
   );
   if (checkIfExistMessage) return;

   if (index !== -1) {
      const selectedRoom = get().chats[index];
      const updatedRoom = {
         ...selectedRoom,
         messages: [data, ...selectedRoom.messages],
      };

      set((state) => ({
         chats: [
            updatedRoom,
            ...state.chats.filter((chat) => chat.id !== data.room.id),
         ],
      }));
   } else {
      const selectedRoom = get().chats.find((chat) => chat.id === data.room.id);

      const updatedRoom = {
         ...selectedRoom,
         messages: [...selectedRoom.messages, data],
      };

      set((state) => ({
         chats: [
            ...state.chats.filter((chat) => chat.id !== data.room.id),
            updatedRoom,
         ],
      }));
   }

   if (get().messagesRoom === data.room.id) {
      set((state) => ({
         messagesList: [data, ...get().messagesList],
      }));
   }
};

const responseMessageChats = (set, get, data) => {
   set((state) => ({
      chats: data,
   }));
};

const responseMessageNew = (set, get, data) => {
   utils.log("responseMessageNew", data);
};

const responseMessageList = (set, get, data) => {
   set((state) => ({
      messagesList: [...get().messagesList, ...data.messages],
      messagesNext: data.next,
      messagesUser: data.room.customers[0],
      messagesRoom: data.room.id,
   }));
};

const responseCustomerGet = (set, get, data) => {
   set((state) => ({
      customer: data,
   }));
};

const responseCompanyGet = (set, get, data) => {
   set((state) => ({
      company: data,
   }));
};

const responseCompanyActivity = (set, get, data) => {
   set((state) => ({
      company: {
         ...get().company,
         activity: data,
      },
   }));
}

const responseServicesGet = (set, get, data) => {
   set((state) => ({
      services: data,
   }));
};

const responseSalesGet = (set, get, data) => {
   set((state) => ({
      sales: data,
   }));
};

const responseOrdersGet = (set, get, data) => {
   set((state) => ({
      orders: data,
   }));
};

const responsePong = () => {
   console.log(`🏓 [${new Date().toLocaleTimeString()}] Pong recibido`);
}

const responses = {
   "message.send": responseMessageSend,
   "message.chats": responseMessageChats,
   "message.new": responseMessageNew,
   "message.list": responseMessageList,
   "customer.get": responseCustomerGet,

   "company.get": responseCompanyGet,
   "company.activity": responseCompanyActivity,

   "sales.list": responseSalesGet,
   "services.list": responseServicesGet,
   "orders.list": responseOrdersGet,

   "pong": responsePong,
};

const useGlobal = create((set, get) => ({
   // Server
   initialized: false,
   socket: null,
   serverUp: true,

   // socket reconnection
   connectInFlight: false,
   autoRetryCount: 0,
   autoRetryEnabled: true,
   retryTimer: null,
   socketStatus: "disconnected", // "connecting", "connected", "disconnected"

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

   // Limpia todo el estado de datos del usuario actual.
   // Se llama al cerrar sesión o al detectar que no hay usuario.
   clearData: () => {
      set({
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

   setToken: (token) => {
      // Si el token es null = cierre de sesión → limpiar todo
      if (!token) {
         get().clearData();
         get().socketDisconnect();
         set({ token: null, user: null });
         return;
      }

      set({ token, socketStatus: "connecting", autoRetryCount: 0 });
      get().socketConnect();
   },

   // ---------- SERVER PING ----------
   serverPing: async () => {
      try {
         const res = await fetch(`${API_HOST}ping`);
         set({ serverUp: res.ok });
         return res.ok;
      } catch (err) {
         set({ serverUp: false });
         return false;
      }
   },

   clearRetryTimer: () => {
      const t = get().retryTimer;
      if (t) clearTimeout(t);
      set({ retryTimer: null });
   },

   // ---------- SOCKET ----------
   socketDisconnect: () => {
      get().clearRetryTimer();
      const s = get().socket;
      try { s?.close(); } catch { }
      set({
         socket: null,
         socketStatus: "disconnected",
         connectInFlight: false,
         autoRetryCount: 0,
      });
   },

   socketConnect: async ({ auto } = { auto: true }) => {
      const { token, socket, connectInFlight, autoRetryCount } = get();
      if (!token) return set({ socketStatus: "disconnected" });

      // evita duplicados
      if (connectInFlight) return;
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return;

      // si es auto y ya se pasó el límite, no insistas
      if (auto && autoRetryCount >= MAX_AUTO_RETRIES) {
         set({ socketStatus: "disconnected" });
         return;
      }

      get().clearRetryTimer();
      set({ connectInFlight: true, socketStatus: "connecting" });

      // opcional pero recomendable: ping antes de abrir ws
      const ok = await get().serverPing();
      if (!ok) {
         set({ connectInFlight: false, socketStatus: "disconnected" });
         return;
      }

      let ws
      if (Platform.OS == "android") {
         ws = new WebSocket(`ws://${API_WEBHOOK}?token=${token}`)
      } else {
         ws = new WebSocket(`wss://${API_WEBHOOK}?token=${token}`)
      }

      set({ socket: ws });

      ws.onopen = () => {
         const now = new Date().toLocaleTimeString();
         console.log(`🟢 [${now}] Socket conectado`);

         set({
            socketStatus: "connected",
            connectInFlight: false,
            autoRetryCount: 0,
         });

         // ✅ ENVIAR PRIMER PING INMEDIATAMENTE
         if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
               type: "ping",
               timestamp: Date.now()
            }));
            console.log(`🏓 [${new Date().toLocaleTimeString()}] Ping inicial enviado`);
         }

         // ✅ Luego continuar cada 50 segundos
         const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
               ws.send(JSON.stringify({
                  type: "ping",
                  timestamp: Date.now()
               }));
               console.log(`🏓 [${new Date().toLocaleTimeString()}] Ping enviado`);
            } else {
               clearInterval(pingInterval);
            }
         }, 50000);

         ws._pingInterval = pingInterval;
      };

      ws.onerror = () => {
         try { ws.close(); } catch { }
      };

      ws.onclose = () => {
         const now = new Date().toLocaleTimeString();
         console.log(`🔴 [${now}] Socket cerrado`);

         if (ws._pingInterval) {
            clearInterval(ws._pingInterval);
         }

         set({ socket: null, connectInFlight: false });

         // auto-retry con backoff simple
         const { token } = get();
         if (!token) return;

         const next = get().autoRetryCount + 1;
         if (next >= MAX_AUTO_RETRIES) {
            set({ socketStatus: "disconnected", autoRetryCount: next });
            return;
         }

         set({ socketStatus: "connecting", autoRetryCount: next });
         const delay = 800 * next; // 800ms, 1600ms, 2400ms
         const timer = setTimeout(() => {
            set({ retryTimer: null });
            get().socketConnect({ auto: true });
         }, delay);

         set({ retryTimer: timer });
      };

      // onmessage
      ws.onmessage = (e) => {
         let parsed;
         try {
            parsed = JSON.parse(e.data);
         } catch (err) {
            console.warn("[WS] mensaje no JSON:", e.data);
            return;
         }

         if (!parsed?.type) {
            console.warn("[WS] mensaje sin type:", parsed);
            return;
         }

         const handler = responses[parsed.type];
         if (!handler) {
            console.warn("[WS] sin handler para:", parsed.type);
            return;
         }

         handler(set, get, parsed.data);
      };
   },

   // botón "Reintentar": reinicia contador y reintenta 3 veces auto otra vez
   handleRetrySocket: () => {
      if (!get().token) return;
      get().clearRetryTimer();
      set({ autoRetryCount: 0, socketStatus: "connecting", connectInFlight: false });
      get().socketConnect({ auto: true });
   },

   // reconectar al volver a foreground
   onAppForeground: () => {
      const { socketStatus, token } = get();
      if (!token) return;
      if (socketStatus !== "connected") {
         get().socketConnect({ auto: true });
      }
   },

   // API calls via WebSocket
   sendMessage: (room, message) => {
      const { socket } = get();

      socket.send(
         JSON.stringify({
            source: "message.send",
            room: room,
            message: message,
         }),
      );
   },

   messageList: (room, page = 0) => {
      if (page === 0) {
         set((state) => ({
            messagesList: [],
            messagesNext: null,
            messagesUser: null,
            messagesRoom: null,
         }));
      } else {
         set((state) => ({
            messagesNext: null,
         }));
      }

      const { socket } = get();
      socket.send(
         JSON.stringify({
            source: "message.list",
            room: room,
            page: page,
         }),
      );
   },

   companyReload: () => {
      const { socket } = get();
      socket.send(
         JSON.stringify({
            source: "company.reload",
         }),
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
      socket.send(
         JSON.stringify({
            source: "services.list",
         }),
      );
   },

   removeTempService: (id) => {
      set((state) => ({
         services: state.services.filter(service => service.id !== id),
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
      socket.send(
         JSON.stringify({
            source: "orders.list",
         }),
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
      socket.send(
         JSON.stringify({
            source: "sales.list",
         }),
      );
   },
}));

export default useGlobal;