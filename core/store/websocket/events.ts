// Se dispara cuando se crea un chat/room nuevo (p. ej. al comprar un servicio).
// El payload trae el chat completo (id, customers, lastMessage, ...), igual que
// cada elemento de "message.chats", por lo que lo normalizamos de la misma forma.
export const responseMessageNew = (set, get, data) => {
    if (!data?.id) return;

    set((state) => {
        const exists = state.chats.some(c => c.id === data.id);
        if (exists) return {}; // ya lo tenemos (p. ej. llegó por otra vía), no duplicar

        const newChat = {
            ...data,
            messages: data.messages ?? [],
            messagesNext: data.messagesNext ?? null,
            messagesLoaded: data.messagesLoaded ?? false,
        };

        return {
            chats: [newChat, ...state.chats].sort((a, b) =>
                new Date(b.lastMessage?.createdAt ?? 0).getTime() -
                new Date(a.lastMessage?.createdAt ?? 0).getTime()
            ),
        };
    });
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
    // console.log("📦 responseOrdersGet:", data);
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
                    // Guardamos el tempId resuelto en otra llave: chat.tsx lo necesita
                    // para hacer match exacto (billing/location no tienen "content" único).
                    msg.tempId === data.tempId ? { ...data, tempId: null, resolvedTempId: data.tempId } : msg
                )
                : [...chat.messages, data] // ✅ ASC: nuevo al FINAL
            return { ...chat, messages, lastMessage: data };
        }).sort((a, b) =>
            new Date(b.lastMessage?.createdAt ?? 0).getTime() -
            new Date(a.lastMessage?.createdAt ?? 0).getTime()
        )
    });
};