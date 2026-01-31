import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { RequestDataSchema } from "schemas/request.schema";

export type RequestData = z.infer<typeof RequestDataSchema>
export const requestDataResolver = zodResolver(RequestDataSchema);
export const defaultRequestData: RequestData = {
    name: "",
    rfc: "",
    email: "",
    phone: "",
}