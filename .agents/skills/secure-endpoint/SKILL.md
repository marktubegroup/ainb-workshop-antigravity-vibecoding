---
name: secure-endpoint
description: Guía detallada de Antigravity para desarrollar y auditar endpoints HTTP en JavaScript/TypeScript garantizando la seguridad por defecto.
---

# Desarrollo Seguro de Endpoints (secure-endpoint)

Esta skill proporciona las directrices y requerimientos de seguridad para crear, revisar o modificar endpoints expuestos en aplicaciones web y APIs desarrolladas en JavaScript y TypeScript.

## Principios Clave de la Skill

Cualquier endpoint que procese datos provenientes de los usuarios, de fuentes externas o audiencias debe apegarse estrictamente a las siguientes directrices:

### 1. Validación por Schema y Sanitización de Inputs
- **Esquema de Validación:** Toda entrada debe ser validada mediante un esquema robusto (por ejemplo, usando `Zod`, `Joi` o validación manual rigurosa) antes de ser procesada.
- **Sanitización:** Los datos deben ser sanitizados para eliminar cualquier intento de inyección de código (XSS, SQLi, etc.). Si se espera texto plano, se deben remover o escapar caracteres peligrosos como `<`, `>`, `&`, `"`, `'` y `/`.
- **Rechazo Explícito:** Si un input falla la validación o contiene código malicioso, el endpoint debe rechazarlo inmediatamente devolviendo un estado HTTP 400 (Bad Request).

### 2. Manejo Seguro de Secretos
- **Separación de Secretos:** Nunca escribas contraseñas, claves de API, tokens de sesión o secretos en el código fuente.
- **Secretos Externos:** Utiliza variables de entorno (`process.env`), archivos de configuración locales que no se versionen, o un Secret Manager.
- **Configuración de Control de Versiones:** Asegúrate de que el archivo `.env` esté correctamente ignorado en el `.gitignore` y que solo se versionen plantillas de ejemplo libres de credenciales reales (como `.env.example`).

### 3. Configuración de Headers de Seguridad
El endpoint debe responder incluyendo siempre cabeceras de seguridad HTTP básicas para proteger al cliente en el navegador:
- **Content-Security-Policy (CSP):** Limita de dónde se pueden cargar recursos. Por ejemplo: `default-src 'none'`.
- **X-Frame-Options:** Previene ataques de Clickjacking. Ejemplo: `DENY`.
- **Strict-Transport-Security (HSTS):** Fuerza el uso de conexiones seguras HTTPS. Ejemplo: `max-age=31536000; includeSubDomains`.

### 4. Registro de Logs sin PII (Información Personal Identificable)
- **Privacidad por Diseño:** Está prohibido registrar datos personales (PII) como nombres, correos electrónicos, teléfonos, tokens de acceso o el contenido confidencial de los inputs de los usuarios.
- **Logs Estructurados:** Utiliza logs con fines puramente operativos o de depuración estructural (estado de la operación, tipo de error, etc.) sin incluir los valores sensibles ni secretos.

### 5. Tests Unitarios y Test Adversarial
- **Validación del Camino Feliz:** Crea pruebas automáticas que aseguren el comportamiento correcto con payloads válidos.
- **Test Adversarial con Payload Malicioso:** Diseña pruebas que simulen ataques y envíen payloads con código HTML/JS, caracteres de escape o datos no estructurados para verificar que el endpoint responde de manera segura, rechazándolos o manejándolos de forma segura.
