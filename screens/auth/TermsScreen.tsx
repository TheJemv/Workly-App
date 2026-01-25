import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

const TermsAndConditions = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Términos y Condiciones</Text>
                <Text style={styles.lastUpdate}>Última actualización: Enero 2026</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
                    <Text style={styles.text}>
                        Al acceder y utilizar esta aplicación, usted acepta estar sujeto a estos
                        Términos y Condiciones de uso. Si no está de acuerdo con alguna parte de
                        estos términos, no debe utilizar nuestra aplicación.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Descripción del Servicio</Text>
                    <Text style={styles.text}>
                        Nuestra aplicación proporciona servicios de [descripción de tu servicio].
                        Nos reservamos el derecho de modificar o descontinuar el servicio en
                        cualquier momento sin previo aviso.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Registro y Cuenta de Usuario</Text>
                    <Text style={styles.text}>
                        Para utilizar ciertos servicios, debe crear una cuenta proporcionando
                        información precisa y completa. Usted es responsable de:
                    </Text>
                    <Text style={styles.bulletPoint}>• Mantener la confidencialidad de su contraseña</Text>
                    <Text style={styles.bulletPoint}>• Todas las actividades que ocurran bajo su cuenta</Text>
                    <Text style={styles.bulletPoint}>• Notificarnos inmediatamente de cualquier uso no autorizado</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Uso Aceptable</Text>
                    <Text style={styles.text}>
                        Usted se compromete a NO utilizar la aplicación para:
                    </Text>
                    <Text style={styles.bulletPoint}>• Violar leyes o regulaciones aplicables</Text>
                    <Text style={styles.bulletPoint}>• Transmitir contenido ilegal, ofensivo o inapropiado</Text>
                    <Text style={styles.bulletPoint}>• Intentar acceder sin autorización a sistemas o datos</Text>
                    <Text style={styles.bulletPoint}>• Interferir con el funcionamiento del servicio</Text>
                    <Text style={styles.bulletPoint}>• Realizar actividades fraudulentas o engañosas</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Privacidad y Protección de Datos</Text>
                    <Text style={styles.text}>
                        Su privacidad es importante para nosotros. Recopilamos y utilizamos su
                        información personal de acuerdo con nuestra Política de Privacidad. Al
                        utilizar nuestros servicios, usted acepta la recopilación y uso de información
                        según lo descrito en dicha política.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Propiedad Intelectual</Text>
                    <Text style={styles.text}>
                        Todo el contenido, marcas, logos y material disponible en la aplicación son
                        propiedad de la empresa o sus licenciantes. No se le otorga ningún derecho
                        o licencia para usar dicho contenido sin autorización expresa.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Pagos y Facturación</Text>
                    <Text style={styles.text}>
                        Si nuestro servicio requiere pago, usted acepta proporcionar información de
                        pago válida y precisa. Los precios están sujetos a cambios con previo aviso.
                        Todos los pagos son procesados de forma segura a través de proveedores
                        de pago de terceros.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>8. Cancelación y Suspensión</Text>
                    <Text style={styles.text}>
                        Nos reservamos el derecho de suspender o cancelar su cuenta si:
                    </Text>
                    <Text style={styles.bulletPoint}>• Viola estos Términos y Condiciones</Text>
                    <Text style={styles.bulletPoint}>• Proporciona información falsa o engañosa</Text>
                    <Text style={styles.bulletPoint}>• Realiza actividades que perjudiquen a otros usuarios</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>9. Limitación de Responsabilidad</Text>
                    <Text style={styles.text}>
                        La aplicación se proporciona "tal cual" sin garantías de ningún tipo. No nos
                        hacemos responsables por daños directos, indirectos, incidentales o
                        consecuentes que resulten del uso o la imposibilidad de usar nuestros servicios.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>10. Modificaciones a los Términos</Text>
                    <Text style={styles.text}>
                        Nos reservamos el derecho de modificar estos términos en cualquier momento.
                        Le notificaremos sobre cambios significativos mediante un aviso en la aplicación
                        o por correo electrónico. El uso continuado de nuestros servicios después de
                        dichos cambios constituye su aceptación de los nuevos términos.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>11. Ley Aplicable</Text>
                    <Text style={styles.text}>
                        Estos términos se rigen por las leyes de México. Cualquier disputa será
                        resuelta en los tribunales competentes de Heroica Matamoros, Tamaulipas.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>12. Contacto</Text>
                    <Text style={styles.text}>
                        Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en:
                    </Text>
                    <Text style={styles.bulletPoint}>• Email: soporte@tuapp.com</Text>
                    <Text style={styles.bulletPoint}>• Teléfono: +52 XXX XXX XXXX</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Al utilizar nuestra aplicación, usted reconoce que ha leído, entendido y
                        acepta estar sujeto a estos Términos y Condiciones.
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
        marginBottom: 8,
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

export default TermsAndConditions;