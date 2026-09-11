import { useRouter } from "expo-router";
import { postCompanyLocation } from "services/api/companyLocation.api";
import LocationMapForm, { LocationFormValues } from "components/Location/LocationMapForm";

const MIN2 = (label: string, value: string) =>
    value.trim().length < 2 ? `${label} debe tener al menos 2 caracteres.` : null;

/** Rangos del contrato de `POST /company/locations`. */
function validateCompanyLocation(data: LocationFormValues): string | null {
    const name = data.name.trim();
    if (name.length < 4 || name.length > 16) {
        return "El nombre de la sucursal debe tener entre 4 y 16 caracteres.";
    }

    const details = data.details.trim();
    if (details.length < 1 || details.length > 65) {
        return "Los detalles deben tener entre 1 y 65 caracteres.";
    }

    if (!/^\d{5}$/.test(data.postalCode.trim())) {
        return "El código postal debe tener exactamente 5 dígitos.";
    }

    const streetNumber = data.streetNumber.trim();
    if (streetNumber.length < 1 || streetNumber.length > 10) {
        return "El número debe tener entre 1 y 10 caracteres.";
    }

    return (
        MIN2("El país", data.country) ??
        MIN2("El estado", data.state) ??
        MIN2("La ciudad", data.city) ??
        MIN2("La colonia", data.neighborhood) ??
        MIN2("La calle", data.street)
    );
}

export default function CompanyLocationCreate() {
    const router = useRouter();

    return (
        <LocationMapForm
            formTitle="Datos de la sucursal"
            nameLabel="Nombre de la sucursal"
            namePlaceholder="Ej. Sucursal Roma"
            defaultName=""
            detailsLabel="Cómo encontrarla"
            detailsPlaceholder="Ej. Planta baja, junto a la cafetería"
            validate={validateCompanyLocation}
            onSubmit={async (payload) => {
                await postCompanyLocation(payload);
                if (router.canGoBack()) router.back();
            }}
        />
    );
}
