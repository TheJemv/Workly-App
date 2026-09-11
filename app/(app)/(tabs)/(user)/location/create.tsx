import { useRouter } from "expo-router";
import { postLocation } from "services/api/location.api";
import LocationMapForm from "components/Location/LocationMapForm";

export default function LocationCreate() {
    const router = useRouter();

    return (
        <LocationMapForm
            formTitle="Datos de la dirección"
            nameLabel="Alias"
            namePlaceholder="Ej. Casa, Oficina"
            defaultName="Mi ubicacion"
            detailsLabel="Detalles del lugar"
            detailsPlaceholder="Ej. Casa azul, portón negro"
            onSubmit={async (payload) => {
                await postLocation(payload);
                if (router.canGoBack()) router.back();
            }}
        />
    );
}
