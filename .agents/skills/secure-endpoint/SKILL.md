# Skill: secure-endpoint

Skill para repositorios JavaScript/TypeScript. Se aplica cuando se crea o revisa un endpoint que reciba datos de usuarios, fuentes o audiencias.

## Requisitos

### Validacion por schema
- Todo input debe validarse contra un schema definido antes de procesarse.
- Rechazar payloads que no cumplan el schema con status 400.

### Sanitizacion de inputs
- Sanitizar todos los campos de texto para prevenir XSS y inyecciones.
- Eliminar etiquetas HTML y caracteres peligrosos.

### Secretos externos o Secret Manager
- Nunca almacenar secretos en codigo fuente.
- Usar Secret Manager o variables de entorno externas para credenciales.
- `.env` debe estar ignorado en `.gitignore`.
- `.env.example` debe versionarse solo con placeholders, sin secretos reales.

### Headers de seguridad
- Content-Security-Policy: `default-src 'none'`
- Strict-Transport-Security (HSTS): `max-age=31536000; includeSubDomains`
- X-Frame-Options: `DENY`

### Logs sin PII ni datos personales
- No registrar en logs texto sensible, contacto, tokens ni secretos.
- Usar logs estructurados con identificadores anonimos.

### Test adversarial con payload malicioso
- Incluir al menos un test adversarial que envie input malicioso y verifique el rechazo.
- Validar que la respuesta no exponga datos internos.
