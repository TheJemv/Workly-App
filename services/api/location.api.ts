import apiClient from "services/api/apiClient";
import { parseApiError } from "services/api/errors";

export const postLocation = async (data: any) => {
    try {
        const response = await apiClient.post("/location", data)
        return response.data;
    } catch (error) {
        throw parseApiError(error);
    }
}

export const getLocations = async () => {
    try {
        const response = await apiClient.get("/location")
        return response.data
    } catch (error) {
        throw parseApiError(error);
    }
}

export const delLocation = async (locatioId: string) => {
    try {
        const response = await apiClient.delete(`/location/${locatioId}`)
        return response.data
    } catch (error) {
        throw parseApiError(error);
    }
}
