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

   utils.log('responseCustomerGet', data)
}

const responseCompanyGet = (set, get, data) => {
   utils.log('responseCompanyGet', data)
   set((state) => ({
      company: data
   }))
}



const useGlobal = create((set, get) => ({
   initiainitialized: false,
   user: null,
   customer: null,
   token: null,
   socket: null,

   chats: [],

   messagesList: [],
   messagesNext: null,
   messagesUser: null,
   messagesRoom: null,

   company: null,

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

            'company.get':   responseCompanyGet,
         }

         const resp = responses[parsed.type]
         // if(resp) {
         //    resp(parsed)
         // }

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
      console.log('companyReload')

      const { socket } = get()
      socket.send(JSON.stringify({
         source: 'company.reload'
      }))
   }
}))


export default useGlobal