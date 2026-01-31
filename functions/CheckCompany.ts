const checkcompany = (company: any): boolean => {
    const activity = company?.activity;
    if (!activity) return false;

    const { charges_enabled, payouts_enabled, requirements, capabilities } =
        activity;

    const { currently_due = [], disabled_reason } = requirements || {};

    if (disabled_reason) return false;
    if (currently_due.length > 0) return false;
    if (!charges_enabled || !payouts_enabled) return false;

    const someinactive = Object.values(capabilities || {}).some(
        (value) => value !== "active",
    );

    if (someinactive) return false;
    return true;
};

export default checkcompany;
