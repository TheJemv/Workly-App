export const responseMessageNew = (set, get, data) => { };

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
    console.log("📦 responseOrdersGet:", data);

    // data ya es { loaded, data, meta }
    if (!data?.data) return; // 👈 guard por si llega mal
    set((state) => ({
        orders: {
            loaded: true,
            data: data.meta?.page === 1 || !data.meta
                ? data.data
                : [...(state.orders?.data ?? []), ...data.data],
            meta: data.meta ?? null,
        },
    }));
};


//  Chats
export const responseMessageChats = (set, get, data) => {
    set(() => ({
        chats: data.map((chat: any) => ({
            ...chat,
            messagesNext: null,
            messagesLoaded: false,
        }))
    }));
};

export const responseMessageList = (set, get, data) => {
    const roomId = data.room.id;
    set((state) => {
        const existing = state.chats.find(c => c.id === roomId);
        const existingMessages = existing?.messages ?? [];
        const existingIds = new Set(existingMessages.map(msg => msg.id));
        const newMessages = data.messages.filter(msg => !existingIds.has(msg.id));

        return {
            activeRoom: roomId,
            chats: state.chats.map(chat =>
                chat.id !== roomId ? chat : {
                    ...chat,
                    messages: data.page === 0
                        ? data.messages
                        : [...existingMessages, ...newMessages],
                    messagesNext: data.next,
                    messagesLoaded: true,
                }
            )
        };
    });
};

export const responseMessageSend = (set, get, data) => {
    const roomId = data.room.id;
    const state = get();
    set({
        chats: state.chats.map(chat => {
            if (chat.id !== roomId) return chat;
            const messages = data.tempId
                ? chat.messages.map(msg =>
                    msg.tempId === data.tempId ? { ...data, tempId: null } : msg
                )
                : [...chat.messages, data] // ✅ ASC: nuevo al FINAL
            return { ...chat, messages, lastMessage: data };
        }).sort((a, b) =>
            new Date(b.lastMessage?.createdAt ?? 0).getTime() -
            new Date(a.lastMessage?.createdAt ?? 0).getTime()
        )
    });
};