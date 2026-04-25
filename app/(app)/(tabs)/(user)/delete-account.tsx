import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { deleteCustomer } from "services/api/customer.api";
import { Singout } from "services/firebase/Singout";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
        <Text className="text-base font-bold text-gray-800 mb-2">{title}</Text>
        {children}
    </View>
);

const BulletItem = ({ text }: { text: string }) => (
    <View className="flex-row items-start mb-1">
        <Text className="text-gray-500 mr-2 mt-0.5">•</Text>
        <Text className="text-gray-600 text-sm flex-1">{text}</Text>
    </View>
);

export default function DeleteAccountScreen() {
    const router = useRouter();
    const [countdown, setCountdown] = useState<number>(15);
    useEffect(() => {
        if (countdown === 0) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const canDelete = countdown === 0;


    const realDelete = async () => {
        // Aquí iría la lógica real para eliminar la cuenta, como llamar a una API o limpiar el estado global.
        await deleteCustomer().then(() => {
            Alert.alert("Cuenta eliminada", "Tu cuenta ha sido eliminada correctamente.");
            // Aquí podrías agregar lógica adicional, como cerrar sesión o redirigir al usuario a una pantalla de bienvenida.
            Singout().then(() => {
                // Redirigir al usuario a la pantalla de inicio después de cerrar sesión
                router.replace('/(app)/(tabs)/(home)');
            }).catch((e) => {
                Alert.alert("Error al cerrar sesión", e.message);
            });
        }).catch(e => {
            alert(e.message);
            return;
        });
    }

    const handleDelete = () => {
        Alert.alert(
            "Eliminar cuenta",
            "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es permanente e irreversible.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => await realDelete()
                }
            ]
        );
    };

    return (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>

            {/* Header */}
            <Text className="text-2xl font-bold text-gray-900 mb-2">Eliminar cuenta</Text>
            <Text className="text-sm text-gray-500 mb-6">
                Antes de continuar, lee detenidamente la siguiente información. Esta acción es permanente
                y no podrá deshacerse una vez confirmada.
            </Text>

            {/* Aviso principal */}
            <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <Text className="text-red-700 font-semibold text-sm mb-1">⚠️ Acción irreversible</Text>
                <Text className="text-red-600 text-sm">
                    Al eliminar tu cuenta, todos tus datos personales serán borrados de forma permanente de
                    nuestros servidores. No podrás recuperarlos ni restaurar tu cuenta en el futuro.
                </Text>
            </View>

            {/* Datos que se eliminan */}
            <Section title="Datos que se eliminarán">
                <Text className="text-gray-600 text-sm mb-3">
                    Los siguientes datos asociados a tu cuenta serán eliminados de forma definitiva:
                </Text>

                <Text className="text-sm font-semibold text-gray-700 mb-1">Cuenta y perfil</Text>
                <BulletItem text="Nombre completo, correo electrónico y número de teléfono registrado." />
                <BulletItem text="Foto de perfil y descripción personal." />
                <BulletItem text="Contraseña y credenciales de acceso." />
                <BulletItem text="Método de inicio de sesión (Google, Apple, teléfono)." />
                <BulletItem text="Configuraciones y preferencias de la aplicación." />

                <Text className="text-sm font-semibold text-gray-700 mt-3 mb-1">Ubicaciones guardadas</Text>
                <BulletItem text="Domicilio principal y todas las direcciones guardadas en tu cuenta." />
                <BulletItem text="Historial de ubicaciones utilizadas para solicitar servicios." />
                <BulletItem text="Referencias de acceso, indicaciones y notas asociadas a cada dirección." />
                <BulletItem text="Coordenadas GPS y mapas guardados vinculados a tu perfil." />

                <Text className="text-sm font-semibold text-gray-700 mt-3 mb-1">Datos de facturación</Text>
                <BulletItem text="Nombre fiscal, RFC y régimen fiscal registrado." />
                <BulletItem text="Dirección fiscal y código postal para emisión de facturas." />
                <BulletItem text="Uso de CFDI y forma de pago configurados." />
                <BulletItem text="Historial de facturas generadas desde la plataforma." />
                <BulletItem text="Información asociada a tu cuenta de Stripe, incluyendo métodos de pago guardados." />

                <Text className="text-sm font-semibold text-gray-700 mt-3 mb-1">Notificaciones y tokens</Text>
                <BulletItem text="Token de notificaciones push de tu dispositivo." />
                <BulletItem text="Preferencias de notificación y alertas configuradas." />
                <BulletItem text="Historial de notificaciones recibidas." />
            </Section>

            {/* Datos que NO se eliminan */}
            <Section title="Datos que se conservarán">
                <Text className="text-gray-600 text-sm mb-3">
                    Para mantener la integridad de la plataforma y proteger a otros usuarios,
                    los siguientes registros serán conservados de forma anonimizada:
                </Text>
                <BulletItem text="Historial de órdenes completadas, ya que están vinculadas a los proveedores de servicios que las atendieron." />
                <BulletItem text="Conversaciones de chat relacionadas con órdenes activas o completadas, en cumplimiento con nuestras políticas." />
                <BulletItem text="Registros de transacciones financieras requeridos por obligaciones fiscales y legales en México." />
                <BulletItem text="Calificaciones y reseñas que hayas dejado a prestadores de servicios, conservadas de forma anónima." />
                <BulletItem text="Registros de actividad necesarios para auditorías de seguridad y cumplimiento normativo." />
            </Section>

            {/* Pagos pendientes */}
            <Section title="Pagos y saldo pendiente">
                <Text className="text-gray-600 text-sm mb-2">
                    Antes de eliminar tu cuenta, asegúrate de que no tienes:
                </Text>
                <BulletItem text="Órdenes activas o en curso que aún no hayan sido completadas." />
                <BulletItem text="Pagos pendientes por servicios recibidos." />
                <BulletItem text="Disputas o reclamaciones abiertas con algún proveedor." />
                <Text className="text-gray-500 text-sm mt-2">
                    No es posible eliminar una cuenta con órdenes activas. En caso de tenerlas,
                    deberás esperar a que concluyan o cancelarlas antes de proceder.
                </Text>
            </Section>

            {/* Marco legal */}
            <Section title="Cumplimiento legal">
                <Text className="text-gray-600 text-sm">
                    La eliminación de tu cuenta se realiza conforme a la Ley Federal de Protección
                    de Datos Personales en Posesión de los Particulares (LFPDPPP) vigente en México.
                    Tienes el derecho de solicitar la eliminación de tus datos personales (derecho de
                    cancelación) en cualquier momento. Para cualquier duda sobre el tratamiento de tus
                    datos, puedes contactarnos en privacidad@workly.mx.
                </Text>
            </Section>

            {/* Proceso */}
            <Section title="¿Qué sucede después?">
                <BulletItem text="Recibirás un correo de confirmación una vez que tu cuenta haya sido eliminada." />
                <BulletItem text="Tu sesión será cerrada de forma inmediata en todos los dispositivos." />
                <BulletItem text="No podrás acceder a la aplicación con las mismas credenciales." />
                <BulletItem text="Si en el futuro deseas usar Workly, deberás crear una cuenta nueva." />
                <BulletItem text="Los datos fiscales retenidos por obligación legal serán eliminados al vencer el plazo legal correspondiente (generalmente 5 años)." />
            </Section>

            {/* Alternativa */}
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                <Text className="text-blue-700 font-semibold text-sm mb-1">¿Necesitas ayuda?</Text>
                <Text className="text-blue-600 text-sm">
                    Si estás teniendo problemas con la aplicación o tu cuenta, nuestro equipo de soporte
                    puede ayudarte antes de que tomes esta decisión. Contáctanos en soporte@workly.mx para recibir asistencia personalizada.
                </Text>
            </View>

            {/* Botón */}
            <TouchableOpacity
                className={`py-4 rounded-xl items-center ${canDelete ? "bg-red-500" : "bg-gray-300"}`}
                onPress={handleDelete}
                disabled={!canDelete}
            >
                <Text className={`font-bold text-base ${canDelete ? "text-white" : "text-gray-500"}`}>
                    {canDelete ? "Eliminar mi cuenta" : `Espera ${countdown}s para continuar`}
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
}