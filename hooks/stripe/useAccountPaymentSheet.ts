import { useState, useCallback } from "react";
import { getPaymentParams } from "services/api/getPaymantParams";
import { useStripeCheckout } from "./useStripeCheckout";
import { Customer } from "@/types/Customer";

export interface CustomerUser {
    customerId: string;
    [key: string]: unknown;
}

interface UseAccountPaymentSheetResult {
    loadingPayments: boolean;
    isModalActivePayment: boolean;
    initializePaymentSheet: () => Promise<void>;
    handleNewCard: () => Promise<void>;
}

export function useAccountPaymentSheet(
    customerUser: Customer | null | undefined
): UseAccountPaymentSheetResult {
    const { initialize, open } = useStripeCheckout();
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [isModalActivePayment, setIsModalActivePayment] = useState(false);

    const initializePaymentSheet = useCallback(async (): Promise<void> => {
        if (!customerUser?.customerId) return;

        setLoadingPayments(false);

        let ephemeralKey: string | null = null;
        let setupIntent: string | null = null;

        try {
            const result = await getPaymentParams();
            ephemeralKey = result.ephemeralKey;
            setupIntent = result.setupIntent;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log("Error fetching payment params:", message);
            return;
        }

        if (typeof ephemeralKey !== "string" || typeof setupIntent !== "string") {
            return;
        }

        const success = await initialize({
            customerEphemeralKeySecret: ephemeralKey,
            setupIntentClientSecret: setupIntent,
            merchantDisplayName: "User",
            returnURL: "workly://stripe-return",
            customerId: customerUser.customerId,
        });

        setLoadingPayments(success);
    }, [customerUser, initialize]);

    const handleNewCard = useCallback(async (): Promise<void> => {
        if (!loadingPayments) return;
        setIsModalActivePayment(true);

        await initializePaymentSheet();
        await open();

        setIsModalActivePayment(false);
    }, [loadingPayments, initializePaymentSheet, open]);

    return {
        loadingPayments,
        isModalActivePayment,
        initializePaymentSheet,
        handleNewCard,
    };
}