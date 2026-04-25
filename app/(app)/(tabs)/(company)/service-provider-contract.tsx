import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

const ServiceProviderContract = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Contrato de Prestación de Servicios</Text>
                <Text style={styles.subtitle}>Para Empresas Proveedoras</Text>
                <Text style={styles.lastUpdate}>Última actualización: 26 de marzo de 2026</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Partes</Text>
                    <Text style={styles.text}>
                        El presente contrato (en adelante, el "Contrato") se celebra entre Workly Services
                        (en adelante, "Workly") y la persona moral registrada dentro de la plataforma como
                        empresa proveedora (en adelante, la "Empresa Proveedora" o la "Empresa").
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Objeto</Text>
                    <Text style={styles.text}>
                        El presente Contrato tiene por objeto regular la participación de la Empresa Proveedora
                        dentro de la plataforma digital Workly, mediante la publicación, oferta y prestación de
                        servicios profesionales a usuarios finales (clientes), así como establecer los derechos
                        y obligaciones de ambas partes.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Naturaleza de la Relación</Text>
                    <Text style={styles.bulletPoint}>• La Empresa Proveedora actúa como un prestador de servicios independiente.</Text>
                    <Text style={styles.bulletPoint}>• No existe relación laboral, sociedad, asociación, mandato o representación entre Workly y la Empresa.</Text>
                    <Text style={styles.bulletPoint}>• La Empresa será la única responsable de sus obligaciones fiscales, laborales, administrativas y legales.</Text>
                    <Text style={styles.bulletPoint}>• En ningún caso Workly será considerado empleador, patrón o responsable solidario.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Registro, Validación y Onboarding</Text>
                    <Text style={styles.text}>
                        La Empresa deberá registrarse proporcionando información veraz, completa y actualizada.
                        Workly se reserva el derecho de aprobar o rechazar cualquier solicitud de registro sin
                        necesidad de justificación. Para efectos de pagos, la Empresa deberá completar el proceso
                        de onboarding a través de Stripe u otro proveedor autorizado, proporcionando:
                    </Text>
                    <Text style={styles.bulletPoint}>• Documentación fiscal</Text>
                    <Text style={styles.bulletPoint}>• Información bancaria</Text>
                    <Text style={styles.bulletPoint}>• Identificación oficial</Text>
                    <Text style={styles.bulletPoint}>• Documentos constitutivos</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Obligaciones de la Empresa Proveedora</Text>
                    <Text style={styles.text}>La Empresa se obliga a:</Text>
                    <Text style={styles.bulletPoint}>• Prestar servicios con calidad, profesionalismo y diligencia</Text>
                    <Text style={styles.bulletPoint}>• Cumplir con las condiciones, tiempos y alcances ofrecidos en la plataforma</Text>
                    <Text style={styles.bulletPoint}>• Mantener actualizada su información</Text>
                    <Text style={styles.bulletPoint}>• Actuar conforme a la legislación aplicable en México</Text>
                    <Text style={styles.bulletPoint}>• Abstenerse de realizar prácticas engañosas o fraudulentas</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Confidencialidad y Protección de Datos</Text>
                    <Text style={styles.text}>La Empresa deberá:</Text>
                    <Text style={styles.bulletPoint}>• Mantener la confidencialidad de toda la información proporcionada por los clientes</Text>
                    <Text style={styles.bulletPoint}>• Utilizar los datos exclusivamente para la prestación del servicio contratado</Text>
                    <Text style={styles.bulletPoint}>• Abstenerse de compartir, vender o utilizar los datos para fines publicitarios sin consentimiento expreso</Text>
                    <Text style={styles.text} style={{ marginTop: 8 }}>
                        El incumplimiento de esta cláusula podrá resultar en la baja definitiva de la Empresa.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Pagos y Comisiones</Text>
                    <Text style={styles.bulletPoint}>• Workly cobrará una comisión de 4.5% + $30 MXN por transacción.</Text>
                    <Text style={styles.bulletPoint}>• La comisión es un cargo adicional al valor del servicio; no se descuenta del monto definido por la Empresa.</Text>
                    <Text style={styles.bulletPoint}>• El precio del servicio será establecido libremente por la Empresa.</Text>
                    <Text style={styles.bulletPoint}>• Todos los pagos deberán realizarse exclusivamente dentro de la plataforma.</Text>
                    <Text style={styles.bulletPoint}>• Los fondos serán liberados dentro de 7 días hábiles posteriores a la entrega del servicio.</Text>
                    <Text style={styles.bulletPoint}>• Workly no será responsable por errores en la información bancaria proporcionada por la Empresa.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>8. Responsabilidad Fiscal</Text>
                    <Text style={styles.text}>La Empresa será la única responsable de:</Text>
                    <Text style={styles.bulletPoint}>• Emitir comprobantes fiscales (facturación)</Text>
                    <Text style={styles.bulletPoint}>• Declarar y pagar impuestos</Text>
                    <Text style={styles.bulletPoint}>• Cumplir con las obligaciones ante el SAT</Text>
                    <Text style={styles.text} style={{ marginTop: 8 }}>
                        Workly no asume responsabilidad fiscal, directa o indirecta.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>9. Prohibición de Operar Fuera de la Plataforma</Text>
                    <Text style={styles.text}>
                        La Empresa se obliga a no contactar, negociar o concretar servicios fuera de la plataforma
                        con usuarios obtenidos a través de Workly. Queda prohibido recibir pagos fuera del sistema.
                        En caso de incumplimiento:
                    </Text>
                    <Text style={styles.bulletPoint}>• Se podrá aplicar una multa simbólica de $200 MXN por evento</Text>
                    <Text style={styles.bulletPoint}>• Se podrá suspender o cancelar la cuenta de la Empresa</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>10. Cancelaciones y Modificaciones</Text>
                    <Text style={styles.text}>
                        Toda cancelación o modificación deberá realizarse a través de la plataforma. No se
                        permitirá realizar cancelaciones o cambios con menos de 3 horas de anticipación respecto
                        a la fecha y hora originalmente acordadas.
                    </Text>
                    <View style={styles.exampleBox}>
                        <Text style={styles.exampleText}>
                            Ejemplo: Si un servicio está programado para el martes a las 3:00 PM, no será posible
                            cancelarlo o modificarlo a partir de las 12:00 PM del mismo día.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>11. Calidad del Servicio y Reputación</Text>
                    <Text style={styles.text}>
                        Workly podrá evaluar el desempeño de la Empresa mediante calificaciones, reportes y
                        comportamiento histórico. Las empresas con mejor desempeño podrán obtener mayor
                        visibilidad dentro de la plataforma. En caso de quejas recurrentes o mala calidad del
                        servicio, Workly podrá suspender o dar de baja definitiva a la Empresa.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>12. Sistema de Strikes</Text>
                    <Text style={styles.text}>
                        Workly podrá aplicar advertencias o sanciones por incumplimientos a las políticas de la
                        plataforma. Cada incumplimiento podrá generar un "strike". En caso de acumulación de
                        5 strikes, Workly podrá proceder con la baja definitiva de la Empresa.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>13. Retención de Pagos</Text>
                    <Text style={styles.text}>Workly podrá retener temporalmente los pagos cuando:</Text>
                    <Text style={styles.bulletPoint}>• Exista una disputa activa</Text>
                    <Text style={styles.bulletPoint}>• Se detecten actividades sospechosas</Text>
                    <Text style={styles.bulletPoint}>• Exista posible fraude</Text>
                    <Text style={styles.bulletPoint}>• Se requiera verificación adicional</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>14. Uso de Información y Analítica</Text>
                    <Text style={styles.text}>
                        Workly podrá utilizar información relacionada con el desempeño de la Empresa (métricas
                        de servicio, volumen de ventas, evaluaciones de usuarios) con el fin de mejorar la
                        plataforma y ajustar la visibilidad dentro del sistema.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>15. Límite de Responsabilidad</Text>
                    <Text style={styles.text}>
                        La responsabilidad total de Workly frente a la Empresa, por cualquier causa, no excederá
                        en ningún caso el monto de la transacción específica en disputa.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>16. Actividades Prohibidas</Text>
                    <Text style={styles.text}>Queda estrictamente prohibido:</Text>
                    <Text style={styles.bulletPoint}>• Participar en actividades de lavado de dinero</Text>
                    <Text style={styles.bulletPoint}>• Operar con recursos de procedencia ilícita</Text>
                    <Text style={styles.bulletPoint}>• Ofrecer, comercializar o facilitar la venta de sustancias ilegales</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>17. Fuerza Mayor</Text>
                    <Text style={styles.text}>
                        Workly no será responsable por incumplimientos derivados de fallas técnicas,
                        interrupciones del sistema, fallas de proveedores externos o eventos fuera de
                        su control razonable.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>18. Suspensión y Terminación</Text>
                    <Text style={styles.text}>
                        Workly podrá suspender o cancelar la cuenta de la Empresa en cualquier momento,
                        notificando al responsable de la cuenta y proporcionando los motivos correspondientes.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>19. Propiedad Intelectual</Text>
                    <Text style={styles.text}>
                        La Empresa no podrá utilizar la marca, logotipos o elementos de Workly sin
                        autorización previa.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>20. Modificaciones</Text>
                    <Text style={styles.text}>
                        Workly podrá modificar el presente Contrato en cualquier momento. El uso continuo
                        de la plataforma implica la aceptación de dichas modificaciones.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>21. Legislación y Jurisdicción</Text>
                    <Text style={styles.text}>
                        El presente Contrato se regirá por las leyes de México. Para cualquier controversia,
                        las partes se someten a los tribunales competentes de México.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>22. Contacto Oficial</Text>
                    <Text style={styles.text}>
                        Para cualquier comunicación relacionada con este Contrato:
                    </Text>
                    <Text style={styles.bulletPoint}>• Email: oscar@workly.services</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Al registrarse y utilizar la plataforma, la Empresa declara haber leído, entendido
                        y aceptado en su totalidad el presente Contrato.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E232C',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1E232C',
        marginBottom: 6,
        textAlign: 'center',
    },
    lastUpdate: {
        fontSize: 12,
        color: '#8391A1',
        marginBottom: 24,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E232C',
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        color: '#6A707C',
        lineHeight: 22,
        textAlign: 'justify',
    },
    bulletPoint: {
        fontSize: 14,
        color: '#6A707C',
        lineHeight: 22,
        marginLeft: 10,
        marginTop: 4,
    },
    exampleBox: {
        marginTop: 10,
        padding: 12,
        backgroundColor: '#F7F8F9',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#1E232C',
    },
    exampleText: {
        fontSize: 13,
        color: '#6A707C',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    footer: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#F7F8F9',
        borderRadius: 8,
    },
    footerText: {
        fontSize: 13,
        color: '#6A707C',
        lineHeight: 20,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default ServiceProviderContract;