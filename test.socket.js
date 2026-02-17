const { io } = require("socket.io-client");

class SocketClient {
    constructor(token) {
        this.token = token;
        this.socket = null;
    }

    connect() {
        this.socket = io("http://localhost:8080", {
            path: "/ws",
            auth: {
                token: this.token,
            },
            transports: ["websocket"], // fuerza websocket
            reconnection: true,
        });

        this.socket.on("connect", () => {
            console.log("✅ Connected to server");
        });

        this.socket.on("connection:success", (data) => {
            console.log("✅ Connection confirmed:", data);
        });

        this.socket.on("disconnect", (reason) => {
            console.log("🔌 Disconnected:", reason);
        });

        this.socket.on("connect_error", (error) => {
            console.error("❌ Connection error:", error.message);
        });
    }

    emit(event, data) {
        return new Promise((resolve, reject) => {
            if (!this.socket || !this.socket.connected) {
                return reject(new Error("Socket not connected"));
            }

            this.socket.emit(event, data, (response) => {
                if (response && response.success) {
                    resolve(response);
                } else {
                    reject(new Error(response?.error || "Unknown error"));
                }
            });
        });
    }

    on(event, handler) {
        if (this.socket) {
            this.socket.on(event, handler);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}


const firebaseToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRiMTFjYjdhYjVmY2JlNDFlOTQ4MDk0ZTlkZjRjNWI1ZWNhMDAwOWUiLCJ0eXAiOiJKV1QifQ.eyJhY2NvdW50VHlwZSI6ImFjY291bnQiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vd29ya2l0YXBwLTkyZGUyIiwiYXVkIjoid29ya2l0YXBwLTkyZGUyIiwiYXV0aF90aW1lIjoxNzcwNzUzMjExLCJ1c2VyX2lkIjoidkdtZ0ZQMWY1aFZ6NXdLQ2JQU1dHdXV1eXJSMiIsInN1YiI6InZHbWdGUDFmNWhWejV3S0NiUFNXR3V1dXlyUjIiLCJpYXQiOjE3NzA4NDY2MTEsImV4cCI6MTc3MDg1MDIxMSwiZW1haWwiOiJwZXRzbWFydEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsicGV0c21hcnRAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.Prx1HkFEJPC6kvyys9ogg1oRf3lWV23P-BmwiY62wDYEAAW7608AeCCfiPrQoARpa0KwOyDKjLvlr8nRVQc7_LuRA_xWckcYQHL9IjNHZJzKkuk3ekkb9_VqS1shBLXiH7nxMcwL_8mKgqg-XcaZKSLAv6Wf2EYsF9iBJG4cTac6zTy5oX_9PptK6gtPx79mf6zt791_ZgnPvpxcaZ2v8Mp5BFNwhHWzJ0NeyDa4SV2LhYfT2QXoAqnwc-_dcCdrtfnLy8nuz3BkRHq5ZX5EbmAm5qes35xkJ0HIQA2g_trhDGLypfktdCF4qf7R5dj25AFeBrCAWbgPU8KSZvW-gg";
const client = new SocketClient(firebaseToken);
client.connect();




//  Customer
client.on("customer.get", (data) => { console.log("Received customer data:", data); });                     //  5
client.on("orders.list", (data) => { console.log("Received orders:", data); });                             //  10


//  Company
client.on("company.get", (data) => { console.log("Received company data:", data); });                       // 6
client.on("company.activity", (data) => { console.log("Received company activity:", data); });              // 7
client.on("sales.list", (data) => { console.log("Received sales data:", data); });                          // 8
client.on("services.list", (data) => { console.log("Received services data:", data); });                    // 9


//  Messages
client.on("message.send", (data) => { console.log("Received new message:", data); })                        //  1
client.on("message.chats", (data) => { console.log("Received chat messages:", data); })                     //  2
client.on("message.list", (data) => { console.log("Received message list:", data); })                       //  4