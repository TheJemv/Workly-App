import { useCallback, useState } from "react";
import { usePaymentSheet } from "@stripe/stripe-react-native";

interface BaseParams {
    customerEphemeralKeySecret: string;
    customerId: string;
    merchantDisplayName: string;
    returnURL: string;
    applePay?: { merchantCountryCode: string };
}

interface SetupIntentParams extends BaseParams {
    setupIntentClientSecret: string;
    paymentIntentClientSecret?: never;
}

interface PaymentIntentParams extends BaseParams {
    paymentIntentClientSecret: string;
    setupIntentClientSecret?: never;
}

export type StripeCheckoutParams = SetupIntentParams | PaymentIntentParams;

interface PresentResult {
    success: boolean;
    error?: string;
}

interface UseStripeCheckoutResult {
    isInitializing: boolean;
    isReady: boolean;
    initialize: (params: StripeCheckoutParams) => Promise<boolean>;
    open: () => Promise<PresentResult>;
}

/**
 * Wrapper de bajo nivel sobre usePaymentSheet de Stripe.
 * Centraliza el try/catch de las llamadas nativas para evitar
 * que una NSException no controlada tumbe la app en producción
 * (ver: performVoidMethodInvocation / convertNSExceptionToJSError).
 */
export function useStripeCheckout(): UseStripeCheckoutResult {
    const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
    const [isInitializing, setIsInitializing] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const initialize = useCallback(async (params: StripeCheckoutParams): Promise<boolean> => {
        setIsInitializing(true);
        setIsReady(false);
        try {
            const { error } = await initPaymentSheet({
                allowsDelayedPaymentMethods: true,
                ...params,
            });

            if (error) {
                console.log("Stripe initPaymentSheet error:", error.message);
                return false;
            }

            setIsReady(true);
            return true;
        } catch (nativeError) {
            console.log("Native Stripe error (initPaymentSheet):", nativeError);
            return false;
        } finally {
            setIsInitializing(false);
        }
    }, [initPaymentSheet]);

    const open = useCallback(async (): Promise<PresentResult> => {
        try {
            const { error } = await presentPaymentSheet();
            if (error) return { success: false, error: error.message };
            return { success: true };
        } catch (nativeError) {
            const message = nativeError instanceof Error ? nativeError.message : String(nativeError);
            console.log("Native Stripe error (presentPaymentSheet):", nativeError);
            return { success: false, error: message };
        }
    }, [presentPaymentSheet]);

    return { isInitializing, isReady, initialize, open };
}