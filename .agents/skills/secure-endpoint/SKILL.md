# Skill: Secure Endpoint (secure-endpoint)

Esta skill define las mejores prácticas de seguridad por defecto para la creación o revisión de endpoints HTTP que reciben datos del usuario o de fuentes externas en repositorios JavaScript o TypeScript.

## Requisitos de Seguridad Obligatorios

### 1. Validación por Schema y Sanitización de Inputs
Todo input recibido del usuario debe ser validado estructuralmente y sanitizado antes de ser procesado:
- Implementar **validación por schema** (por ejemplo, validando tipos de datos, longitudes y campos requeridos).
- Realizar una **sanitización de inputs** estricta para evitar ataques de inyección (XSS, inyecciones de código), rechazando o limpiando cualquier entrada sospechosa o maliciosa.

### 2. Gestión Segura de Secretos
- Los secretos del sistema nunca deben ser hardcodeados en el código de la aplicación.
- Utilizar **secretos externos o Secret Manager** (o variables de entorno cargadas a través de una capa de configuración segura).
- Asegurarse de que el archivo `.env` local esté en el `.gitignore` y que solo se versione un `.env.example` con placeholders genéricos y sin secretos reales.
- El código de la lógica del endpoint no debe acceder directamente a variables globales de entorno como `process.env`. Se debe usar una capa intermedia de configuración.

### 3. Headers de Seguridad
Cada respuesta HTTP devuelta por el endpoint debe incluir headers de seguridad mínimos para proteger a los usuarios:
- **Content-Security-Policy (CSP)**: P. ej., `default-src 'none'` para restringir la carga de recursos no autorizados.
- **X-Frame-Options**: P. ej., `DENY` para evitar ataques de Clickjacking.
- **Strict-Transport-Security (HSTS)**: P. ej., `max-age=31536000; includeSubDomains` para forzar conexiones seguras HTTPS.

### 4. Logs Estructurados sin PII
- Los **logs deben estar libres de PII** (Información de Identificación Personal). Nunca registrar en los archivos de logs información sensible como texto del tip/denuncia, datos de contacto del usuario (email, teléfono), ni secretos del sistema o tokens de administración.
- Los logs deben registrar únicamente información contextual y metadata no sensible de manera estructurada.

### 5. Tests Adversariales
- El código debe estar respaldado por tests unitarios y por lo menos un **test adversarial** que verifique el rechazo correcto ante un payload malicioso o entrada inválida.
