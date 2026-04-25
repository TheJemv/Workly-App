const BASE_URL = "https://app.workly.services";

export const getCompanyShareUrl = (id: string): string => {
    return new URL(`/share/company/${id}`, BASE_URL).toString();
};

export const getServiceShareUrl = (id: string): string => {
    return new URL(`/share/service/${id}`, BASE_URL).toString();
};