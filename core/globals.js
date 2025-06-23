import { getAuth } from "@react-native-firebase/auth";
import { create } from "zustand";
import utils from "./utils";
import { API_WEBHOOK } from "@env";

// Variables
let reconnectAttempts = 0;
const MAX_RETRIES = 5;

// SafeSend
const safeSend = (get, payload) => {
   const socket = get().socket;
   if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
   } else {
      utils.log("WebSocket not open, cannot send:", payload);
   }
};

// Responses
const responses = {
   "message.send": (set, get, data) => {
      const { chats, messagesRoom, messagesList } = get();
      const index = chats.findIndex((chat) => chat.id === data.room.id);
      const chat = chats[index];
      const exists = chat?.messages?.some((msg) => msg.id === data.id);

      if (exists) return;

      const updatedChat = {
         ...chat,
         messages: index !== -1 ? [data, ...chat.messages] : [data],
      };

      set({
         chats:
            index !== -1
               ? [updatedChat, ...chats.filter((c) => c.id !== data.room.id)]
               : [...chats.filter((c) => c.id !== data.room.id), updatedChat],
         messagesList:
            messagesRoom === data.room.id
               ? [data, ...messagesList]
               : messagesList,
      });
   },
   "message.chats": (set, _, data) => set({ chats: data }),
   "message.new": (_, __, data) => utils.log("New message:", data),
   "message.list": (set, _, data) =>
      set({
         messagesList: [...get().messagesList, ...data.messages],
         messagesNext: data.next,
         messagesUser: data.room.customers[0],
         messagesRoom: data.room.id,
      }),

   "customer.get": (set, _, data) => set({ customer: data }),

   "company.get": (set, _, data) => set({ company: data }),
   "services.list": (set, _, data) => set({ services: data }),

   "sales.list": (set, _, data) => set({ sales: data }),
   "orders.list": (set, _, data) => set({ orders: data }),
};

const useGlobal = create((set, get) => ({
   // Server
   initiainitialized: false,
   socket: null,

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

   init: async () => {
      const credentials = getAuth().currentUser;
      if (credentials) {
         const token = await credentials.getIdToken(true);
         set({ initialized: true, user: credentials.user, token });
      }
   },

   socketConnect: async () => {
      const { token } = get();
      if (!token) return;

      console.log(token);

      const socket = await new WebSocket(`${API_WEBHOOK}?token=${token}`);

      socket.onopen = () => {
         utils.log("WebSocket connected");
         reconnectAttempts = 0;
         set({ socket });
      };

      socket.onmessage = (e) => {
         try {
            const parsed = JSON.parse(e.data);
            const handler = responses[parsed.type];

            if (handler) {
               handler(set, get, parsed.data);
            } else {
               utils.log("Unhandled message type:", parsed.type);
            }
         } catch (err) {
            utils.log("Failed to parse message:", e.data);
         }
      };

      socket.onerror = (e) => utils.log("socket.onerror", e.message);
      socket.onclose = () => {
         utils.log("WebSocket closed");
         if (reconnectAttempts < MAX_RETRIES) {
            const delay = Math.min(1000 * 2 ** reconnectAttempts, 3000);
            reconnectAttempts++;

            utils.log(`Reconnecting in ${delay / 1000}s...`);
            setTimeout(() => get().socketConnect(), delay);
         }
      };
   },

   sendMessage: (room, message) => {
      safeSend(get, {
         source: "message.send",
         room,
         message,
      });
   },

   messageList: (room, page = 0) => {
      if (page === 0) {
         set({
            messagesList: [],
            messagesNext: null,
            messagesUser: null,
            messagesRoom: null,
         });
      } else {
         set({ messagesNext: null });
      }

      safeSend(get, {
         source: "message.list",
         room,
         page,
      });
   },

   companyReload: () => {
      safeSend(get, { source: "company.reload" });
   },

   getServices: () => {
      const prev = get().services?.data || [];
      set({ services: { loaded: false, data: prev } });
      safeSend(get, { source: "services.list" });
   },

   getOrders: () => {
      const prev = get().orders?.data || [];
      set({ orders: { loaded: false, data: prev } });
      safeSend(get, { source: "orders.list" });
   },

   getSales: () => {
      const prev = get().sales?.data || [];
      set({ sales: { loaded: false, data: prev } });
      safeSend(get, { source: "sales.list" });
   },
}));

export default useGlobal;
