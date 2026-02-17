import utils from "core/utils";

export const responseMessageSend = (set, get, data) => {
};

export const responseMessageChats = (set, get, data) => {
};

export const responseMessageNew = (set, get, data) => {
    utils.log("responseMessageNew", data);
};

export const responseMessageList = (set, get, data) => {
    set((state) => ({
        messagesList: [...get().messagesList, ...data.messages],
        messagesNext: data.next,
        messagesUser: data.room.customers[0],
        messagesRoom: data.room.id,
    }));
};

export const responseCustomerGet = (set, get, data) => {
    set((state) => ({
        customer: data,
    }));
};

export const responseCompanyGet = (set, get, data) => {
    set((state) => ({
        company: data,
    }));
};

export const responseCompanyActivity = (set, get, data) => {
    set((state) => ({
        company: {
            ...get().company,
            activity: data,
        },
    }));
}

export const responseServicesGet = (set, get, data) => {
    set((state) => ({
        services: data,
    }));
};

export const responseSalesGet = (set, get, data) => {
    set((state) => ({
        sales: data,
    }));
};

export const responseOrdersGet = (set, get, data) => {
    set((state) => ({
        orders: data,
    }));
};