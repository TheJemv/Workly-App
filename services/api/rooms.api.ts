import apiClient from "./apiClient";
import { parseApiError } from "./errors";

interface GetMessagesParams {
    roomId: string;
    take?: number;
    beforeId?: string | null;
}

export const getMessages = async ({
    roomId,
    take = 20,
    beforeId = null,
}: GetMessagesParams) => {
    try {
        const params: any = { take };
        if (beforeId) { params.beforeId = beforeId }
        const response = await apiClient.get(
            `/rooms/${roomId}/messages`,
            { params }
        );

        return response.data;
    } catch (error) {
        throw parseApiError(error);
    }
};
