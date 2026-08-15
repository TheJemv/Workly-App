import { useCallback, useState } from "react";
import { useStripeCheckout } from "./useStripeCheckout";

interface PayServiceParams {
    paymentIntentClientSecret: string;
    ephemeralKey: string;
    customerId: string;
    merchantDisplayName: string;
    merchantCountryCode?: string;
}

interface PayResult {
    success: boolean;
    error?: string;
}

interface UseServicePaymentSheetResult {
    isProcessing: boolean;
    pay: (params: PayServiceParams) => Promise<PayResult>;
}

export function useServicePaymentSheet(): UseServicePaymentSheetResult {
    const { initialize, open } = useStripeCheckout();
    const [isProcessing, setIsProcessing] = useState(false);

    const pay = useCallback(async (params: PayServiceParams): Promise<PayResult> => {
        setIsProcessing(true);
        try {
            const initialized = await initialize({
                customerEphemeralKeySecret: params.ephemeralKey,
                paymentIntentClientSecret: params.paymentIntentClientSecret,
                merchantDisplayName: params.merchantDisplayName,
                returnURL: "workly://stripe-return",
                customerId: params.customerId,
                applePay: params.merchantCountryCode
                    ? { merchantCountryCode: params.merchantCountryCode }
                    : undefined,
            });

            if (!initialized) {
                return { success: false, error: "No se pudo inicializar el pago." };
            }

            return await open();
        } finally {
            setIsProcessing(false);
        }
    }, [initialize, open]);

    return { isProcessing, pay };
}