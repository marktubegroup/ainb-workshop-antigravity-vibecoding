# Skill: Secure Endpoint

## Objetivo

Corregir las vulnerabilidades intencionales del repositorio.

## Archivos permitidos

Modificar únicamente:

- .gitignore
- .env
- .env.example
- .agents/skills/secure-endpoint/SKILL.md
- src/submit-endpoint.js

No modificar ningún otro archivo.

## Problemas a resolver

- .env está versionado.
- .gitignore no ignora archivos de entorno locales.
- Falta esta skill.
- El endpoint no valida entradas.
- El endpoint no sanitiza entradas.
- No existen headers de seguridad.
- Los logs exponen información sensible.
- Los secretos se consumen de forma insegura.

## Criterios de aceptación

- Deben pasar scripts/security-check.mjs.
- Deben pasar los tests adversariales.
- No deben modificarse archivos fuera de la lista permitida.

## Validación mediante Schema

Todo input recibido por el endpoint debe validarse mediante un schema explícito antes de ser procesado.

La validación debe comprobar:

* Campos requeridos.
* Tipos de datos.
* Longitudes mínimas y máximas.
* Formatos permitidos.
* Valores fuera de rango.
* Campos inesperados.

El endpoint debe rechazar cualquier payload que no cumpla el schema definido.

## Protección contra Inputs Maliciosos

El endpoint debe rechazar explícitamente:

* Payloads inválidos.
* Campos inesperados.
* Scripts embebidos.
* Intentos de inyección.
* Valores excesivamente largos.
* Datos malformados.

La respuesta debe utilizar códigos HTTP apropiados para errores de validación.

## Tests Adversariales

Antes de considerar la tarea completa, verificar que el endpoint resista:

* Inputs vacíos.
* Tipos incorrectos.
* Campos faltantes.
* Campos adicionales.
* Payloads extremadamente grandes.
* Intentos de XSS.
* Intentos de inyección.
* Caracteres especiales inesperados.

Los tests adversariales deben pasar sin exponer información sensible.

## Gestión Segura de Secretos

No acceder a secretos directamente desde la lógica de negocio.

Utilizar una capa de configuración segura basada en variables de entorno o Secret Manager.

La lógica del endpoint no debe leer ni exponer secretos directamente.

## Logging Seguro

Nunca registrar:

* Tokens.
* Secrets.
* Authorization headers.
* Contacto del usuario.
* Texto completo enviado por el usuario.
* Variables de entorno.

Los logs deben contener únicamente información operacional mínima.

## Headers de Seguridad

Definir como mínimo:

* X-Content-Type-Options: nosniff
* X-Frame-Options: DENY
* Referrer-Policy: no-referrer
* Cache-Control: no-store

## Criterio Obligatorio

Todo input inválido o potencialmente malicioso debe ser rechazado explícitamente antes de cualquier procesamiento.

## Sanitización de Inputs

Todo dato recibido desde usuarios debe ser sanitizado antes de cualquier uso.

La sanitización debe aplicarse antes de:

* Registrar información en logs.
* Construir respuestas.
* Persistir datos.
* Invocar servicios externos.

La sanitización debe eliminar o neutralizar:

* Scripts HTML.
* Etiquetas HTML.
* Payloads XSS.
* Caracteres de control inesperados.
* Contenido potencialmente malicioso.

La validación y la sanitización son obligatorias y complementarias.

## Test Adversarial

La implementación debe superar test adversariales.

Verificar explícitamente:

* Payload vacío.
* Campos requeridos ausentes.
* Tipos incorrectos.
* Campos inesperados.
* Intentos de XSS.
* Intentos de inyección.
* Payloads excesivamente grandes.
* Caracteres especiales maliciosos.
* Inputs manipulados por usuarios.

El endpoint debe rechazar de forma explícita cualquier input inválido o malicioso.
