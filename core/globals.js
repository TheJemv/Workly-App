import { API_WEBHOOK } from "@env"
import { getAuth } from "firebase/auth"
import { create } from "zustand"
import utils from "./utils"



const responseMessageSend = (set, get, data) => {
   const index = get().chats.findIndex((chat) => chat.id === data.room.id);

   // Verificar si el mensaje ya existe en el chat
   const checkIfExistMessage = get().chats[index]?.messages.find((message) => message.id === data.id);
   if (checkIfExistMessage) return;

   if (index !== -1) {
      const selectedRoom = get().chats[index];
      const updatedRoom = {
         ...selectedRoom,
         messages: [
            data,
            ...selectedRoom.messages,
         ],
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
         messages: [
            ...selectedRoom.messages,
            data,
         ],
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
      chats: data
   }))
}

const responseMessageNew = (set, get, data) => {
   utils.log('responseMessageNew', data)
}

const responseMessageList = (set, get, data) => {
   set((state) => ({
      messagesList: [...get().messagesList, ...data.messages],
      messagesNext: data.next,
      messagesUser: data.room.customers[0],
      messagesRoom: data.room.id
   }))
}

const responseCustomerGet = (set, get, data) => {
   set((state) => ({
      customer: data
   }))
}

const responseCompanyGet = (set, get, data) => {
   set((state) => ({
      company: data
   }))
}

const responseServicesGet = (set, get, data) => {
   set((state) => ({
      services: data
   }))
}

const responseSalesGet = (set, get, data) => {
   console.log(data)
   set((state) => ({
      sales: data
   }))
}

const responseOrdersGet = (set, get, data) => {
   console.log(data)

   set((state) => ({
      orders: data
   }))
}



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
      const credentials = getAuth().currentUser
      if(credentials) {
         set({
            initialized: true,
            user: credentials.user,
            token: await credentials.getIdToken(true),
         })
      }
   },

   socketConnect: async () => {
      const { token } = get()
      if(!token) return
      const socket = new WebSocket(`${API_WEBHOOK}/?token=${token}`)

      socket.onopen = () => {
         utils.log("socket.onopen")
      }

      socket.onmessage = (e) => {
         const parsed = JSON.parse(e.data)
         const responses = {
            'message.send':      responseMessageSend,
            'message.chats':     responseMessageChats,
            'message.new':       responseMessageNew,
            'message.list':      responseMessageList,

            'customer.get':      responseCustomerGet,

            'company.get':       responseCompanyGet,
            'sales.list':        responseSalesGet,

            'services.list':     responseServicesGet,
            'orders.list':       responseOrdersGet,
         }


         const resp = responses[parsed.type]
         console.log({
            type: parsed.type,
            data: parsed.data
         })
         resp(set, get, parsed.data)
      }

      socket.onerror = (e) => {
		   utils.log('socket.onerror', e.message)
		}
		socket.onclose = () => {
		   utils.log('socket.onclose')
		}
		set((state) => ({
		   socket: socket
		}))
   },

   sendMessage: (room, message) => {
      const { socket } = get()

      socket.send(JSON.stringify({
         source: 'message.send',
         room: room,
         message: message
      }))
   },


   messageList: (room, page=0) => {
      if(page === 0) {
         set((state) => ({
            messagesList: [],
            messagesNext: null,
            messagesUser: null,
            messagesRoom: null
         }))
      } else {
         set((state) => ({
				messagesNext: null
			}))
      }

      const { socket } = get()
      socket.send(JSON.stringify({
			source: 'message.list',
			room: room,
			page: page
		}))
   },

   companyReload: () => {
      const { socket } = get()
      socket.send(JSON.stringify({
         source: 'company.reload'
      }))
   },

   getServices: () => {
      set((state) => ({
         services: {
            loaded: false,
            data: state.services?.data || []
         }
      }))
      const { socket } = get()
      socket.send(JSON.stringify({
         source: 'services.list'
      }))
   },

   getOrders: () => {
      console.log('getOrders')

      set((state) => ({
         orders: {
            loaded: false,
            data: state.orders?.data || []
         }
      }))
      const { socket } = get()
      socket.send(JSON.stringify({
         source: 'orders.list'
      }))
   },

   getSales: () => {
      console.log('getSales')
      set((state) => ({
         sales: {
            loaded: false,
            data: state.sales?.data || []
         }
      }))
      const { socket } = get()
      socket.send(JSON.stringify({
         source: 'sales.list'
      }))
   },
}))


export default useGlobal