/**
 * Utilidades de validación para empresas
 */

interface CompanyActivity {
    charges_enabled?: boolean;
    payouts_enabled?: boolean;
    requirements?: {
        currently_due?: string[];
        disabled_reason?: string | null;
    };
    capabilities?: Record<string, string>;
}

interface Company {
    activity?: CompanyActivity;
    [key: string]: any;
}

/**
 * Verifica si una empresa ha completado su configuración de Stripe
 * y está lista para procesar pagos.
 * 
 * @param company - Objeto de empresa a validar
 * @returns true si la empresa está completamente configurada, false en caso contrario
 * 
 * @example
 * const isReady = checkCompanyStatus(companyData);
 * if (isReady) {
 *   // Empresa lista para procesar pagos
 * }
 */
export const checkCompanyStatus = (company: Company | null | undefined): boolean => {
    // Validación inicial
    if (!company?.activity) {
        return false;
    }

    const { charges_enabled, payouts_enabled, requirements, capabilities } = company.activity;

    // Verificar si hay razón de deshabilitación
    if (requirements?.disabled_reason) {
        return false;
    }

    // Verificar si hay requisitos pendientes
    const currentlyDue = requirements?.currently_due || [];
    if (currentlyDue.length > 0) {
        return false;
    }

    // Verificar que charges y payouts estén habilitados
    if (!charges_enabled || !payouts_enabled) {
        return false;
    }

    // Verificar que todas las capacidades estén activas
    if (capabilities) {
        const hasInactiveCapability = Object.values(capabilities).some(
            (status) => status !== "active"
        );

        if (hasInactiveCapability) {
            return false;
        }
    }

    // Si pasa todas las validaciones
    return true;
};

/**
 * Obtiene el estado detallado de configuración de una empresa
 * 
 * @param company - Objeto de empresa a validar
 * @returns Objeto con el estado y detalles de lo que falta
 */
export const getCompanyStatusDetails = (company: Company | null | undefined) => {
    if (!company?.activity) {
        return {
            isComplete: false,
            reason: "No hay información de actividad de la empresa",
            missingItems: ["activity"],
        };
    }

    const { charges_enabled, payouts_enabled, requirements, capabilities } = company.activity;
    const missingItems: string[] = [];

    if (requirements?.disabled_reason) {
        return {
            isComplete: false,
            reason: `Cuenta deshabilitada: ${requirements.disabled_reason}`,
            missingItems: ["disabled_account"],
        };
    }

    const currentlyDue = requirements?.currently_due || [];
    if (currentlyDue.length > 0) {
        missingItems.push(...currentlyDue);
    }

    if (!charges_enabled) {
        missingItems.push("charges_enabled");
    }

    if (!payouts_enabled) {
        missingItems.push("payouts_enabled");
    }

    if (capabilities) {
        const inactiveCapabilities = Object.entries(capabilities)
            .filter(([_, status]) => status !== "active")
            .map(([name]) => `capability_${name}`);

        missingItems.push(...inactiveCapabilities);
    }

    return {
        isComplete: missingItems.length === 0,
        reason: missingItems.length > 0
            ? `Faltan ${missingItems.length} requisito(s)`
            : "Configuración completa",
        missingItems,
    };
};

/**
 * Alias para mantener compatibilidad con código existente
 * @deprecated Usa checkCompanyStatus en su lugar
 */
export const CheckCompany = checkCompanyStatus;

export default checkCompanyStatus;