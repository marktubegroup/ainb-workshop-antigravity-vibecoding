---
name: secure-endpoint
description: Skill de seguridad para endpoints que reciben datos de usuarios y manejan información sensible.
---

# Secure Endpoint Skill

Esta skill define las directrices obligatorias para crear, auditar y mantener endpoints seguros en aplicaciones JavaScript/TypeScript, garantizando la confidencialidad, integridad y disponibilidad del sistema.

## Directrices de Seguridad Requeridas

### 1. Validación por Schema y Sanitización
* **Validación por Schema**: Todo endpoint que reciba datos del usuario o de fuentes externas debe validar la estructura del payload mediante un esquema riguroso (por ejemplo, usando validaciones nativas estrictas o esquemas como Zod o Joi). Se deben rechazar campos inesperados o tipos incorrectos inmediatamente.
* **Sanitización de Inputs**: Los datos de entrada deben sanitizarse para evitar vulnerabilidades de inyección de código (como Cross-Site Scripting - XSS o inyección SQL). Cualquier carácter especial o tag HTML inesperado debe ser neutralizado o rechazado mediante una sanitización adecuada antes de procesar el tip.

### 2. Gestión de Credenciales y Secretos
* **Secretos Externos o Secret Manager**: Queda estrictamente prohibido hardcodear secretos, tokens o contraseñas en el código fuente. Se debe utilizar un Secret Manager o inyectar secretos externos mediante variables de entorno en tiempo de ejecución.
* **Seguridad de Variables de Entorno**: El archivo `.env` local debe estar ignorado en el control de versiones (incluido en `.gitignore`), permitiendo únicamente la subida de un `.env.example` con placeholders sin secretos reales.

### 3. Cabeceras de Seguridad
Los endpoints deben devolver siempre headers de seguridad para mitigar ataques basados en el navegador:
* **Content-Security-Policy (CSP)**: Establecer políticas restrictivas como `default-src 'none'` para restringir la carga de recursos externos no autorizados.
* **X-Frame-Options**: Establecido en `DENY` o `SAMEORIGIN` para prevenir ataques de Clickjacking.
* **Strict-Transport-Security (HSTS)**: Forzar conexiones seguras (HTTPS) mediante cabeceras como `max-age=31536000; includeSubDomains`.

### 4. Logs Estructurados sin PII
* **Logs sin PII**: Nunca se deben registrar datos personales identificables (Personally Identifiable Information - PII) como correos de contacto, nombres, o el texto de la denuncia/tip original.
* **Sin Credenciales en Logs**: Queda prohibido imprimir tokens de acceso, API keys o cualquier tipo de secreto en los logs. Los logs deben ser genéricos y estructurados para auditoría segura.

### 5. Validación mediante Pruebas y Test Adversarial
* **Test Adversarial**: Todo endpoint debe contar con pruebas unitarias y de integración que incluyan escenarios adversarios con un payload malicioso (por ejemplo, inyecciones XSS, payloads vacíos o intentos de fuga de secretos) para asegurar que el endpoint responde de manera segura (ej. devolviendo un código de estado `400 Bad Request` ante entradas inválidas).
