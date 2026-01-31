const GetStatus = (value: Boolean): "Activo" | "Inactivo" =>
    value ? "Activo" : "Inactivo";

export default GetStatus;
