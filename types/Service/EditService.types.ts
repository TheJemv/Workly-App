import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ServiceDataSchema } from "schemas/service.schema";
import ServiceLocationModeEnum from "enum/ServiceLocationModeEnum";

export type ServiceData = z.infer<typeof ServiceDataSchema>
export const serviceDataResolver = zodResolver(ServiceDataSchema)
export const defaultServiceData: ServiceData = {
    name: "",
    description: "",

    currency: "mxn",
    category: "",
    indefinite: false,
    unit_amount: 5000,
    locationMode: ServiceLocationModeEnum.NotRequired,
    companyLocationId: null,
    photos: [],
    addons: [],
}
