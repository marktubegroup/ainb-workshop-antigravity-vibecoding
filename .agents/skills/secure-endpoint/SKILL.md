# Secure Endpoint Skill

Esta skill define las pautas obligatorias para crear o revisar endpoints seguros que reciban datos de usuarios, fuentes o audiencias en aplicaciones Node.js/JavaScript/TypeScript.

## Requisitos de Seguridad

1. **Validación por Schema y Sanitización**:
   - Todo input recibido debe pasar por un esquema de validación estricto para asegurar los tipos de datos.
   - Es obligatorio realizar la sanitización de inputs para evitar ataques como XSS (Cross-Site Scripting) o inyecciones de código. Por ejemplo, rechazar explícitamente caracteres de control o tags HTML/scripts maliciosos.

2. **Secretos externos o Secret Manager**:
   - Nunca almacene secretos, tokens o contraseñas hardcodeados en el código de la aplicación.
   - Utilice secretos externos o Secret Manager para inyectar configuraciones sensibles de manera segura en producción.
   - En desarrollo, use variables de entorno pero asegúrese de que `.env` esté debidamente ignorado en el control de versiones.

3. **Control de Versiones Limpio**:
   - El archivo `.env` y variantes locales deben estar siempre agregados al `.gitignore` para no ser subidos.
   - Se debe versionar un archivo `.env.example` limpio con placeholders sin secretos reales.

4. **Headers de Seguridad**:
   - Todos los endpoints y respuestas deben incluir headers de seguridad mínimos para proteger a los navegadores:
     - `Content-Security-Policy` (CSP)
     - `X-Frame-Options`
     - `Strict-Transport-Security` (HSTS)

5. **Logs sin PII (Datos Personales)**:
   - Los registros (logs) del servidor no deben capturar datos de identificación personal (PII) como contacto, emails o campos del tip, ni tampoco tokens o secretos.

6. **Test Adversarial**:
   - Los archivos de prueba deben incluir escenarios y tests adversariales usando payloads maliciosos o inputs maliciosos para comprobar que el endpoint responde y mitiga los ataques correctamente con un código de error de rechazo.
