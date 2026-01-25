import { API_WEBHOOK } from "@env";

class WebSocketManager {
   constructor() {
      this.socket = null;
      this.isConnected = false;
      this.eventListeners = {};
   }

   connect(token) {
      return new Promise(async (resolve, reject) => {
         if (this.isConnected) {
            return resolve();
         }

         try {
            console.log("Connecting to WebSocket...");
            console.log("Using WebSocket URL:", API_WEBHOOK);
            this.socket = new WebSocket(API_WEBHOOK);
            this.socket.onopen = () => {
               this.isConnected = true;
               this.socket.send(
                  JSON.stringify({
                     type: "AUTH",
                     token: token,
                  }),
               );
               resolve();
            };

            this.socket.onclose = () => {
               this.isConnected = false;
            };

            this.socket.onerror = (error) => {
               reject(error);
            };

            this.socket.onmessage = (message) => {
               const data = JSON.parse(message.data);
               this.emit(data.type, data);
            };
         } catch (error) {
            reject(error);
         }
      });
   }

   close() {
      if (this.isConnected) {
         this.socket.close();
      }
   }

   emit(event, data) {
      if (!this.eventListeners[event]) return;
      this.eventListeners[event].forEach((listener) => listener(data));
   }

   on(event, listener) {
      if (!this.eventListeners[event]) {
         this.eventListeners[event] = [];
      }
      this.eventListeners[event].push(listener);
   }

   off(event, listener) {
      if (!this.eventListeners[event]) return;
      this.eventListeners[event] = this.eventListeners[event].filter(
         (l) => l !== listener,
      );
   }
}

export default WebSocketManager;

