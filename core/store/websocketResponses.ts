import {
    responseCompanyActivity,
    responseCompanyGet,
    responseCustomerGet,
    responseMessageChats,
    responseMessageList,
    responseMessageNew,
    responseMessageSend,
    responseOrdersGet,
    responseSalesGet,
    responseServicesGet,
} from "./websocket/events";
import { WebSocketHandler } from "./types";

const responsePong: WebSocketHandler = () => {
    console.log(`🏓 [${new Date().toLocaleTimeString()}] Pong recibido`);
};

export const responses: Record<string, WebSocketHandler> = {
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

    pong: responsePong,
};