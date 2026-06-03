# AINB Workshop: Antigravity Vibecoding

Ejercicio alineado con la Sesion 03 de AINB: crear una skill de Antigravity que genere o corrija un flujo web minimo con seguridad por defecto.

## Objetivo del ejercicio

Los participantes deben crear una skill que revise el codigo del repositorio y convierta un endpoint vulnerable en un flujo defendible. El caso viene de la charla: un formulario para recibir tips o denuncias anonimas con contacto opcional para una redaccion.

Este repo no incluye una app web completa ni un servidor HTTP. El endpoint esta representado como un handler testeable en `src/submit-endpoint.js` para que el ejercicio se concentre en la skill, la seguridad y la validacion automatica.

El repositorio arranca con fallos intencionales:

- `.env` esta versionado.
- `.gitignore` no ignora `.env` ni variantes locales.
- Falta `.agents/skills/secure-endpoint/SKILL.md`.
- `src/submit-endpoint.js` no valida ni sanitiza inputs.
- El endpoint no define headers de seguridad.
- Los logs exponen texto, contacto y tokens.
- El codigo accede a secretos directamente desde la aplicacion.

El CI ejecuta `scripts/security-check.mjs` y los tests adversariales de Node. Mientras queden fallos, GitHub Actions falla en el pull request.

Importante: esos fallos son parte del punto de partida. No los corrijas antes de entregar el repositorio base del workshop; los participantes deben resolverlos durante el ejercicio.

## Alcance del ejercicio

Este repositorio es un laboratorio de practica. El endpoint esta simplificado a proposito y arranca con fallos de seguridad para que puedan detectarse, corregirse y validarse con tests.

La solucion esperada cubre una base minima: validar lo que entra, no exponer datos sensibles, no registrar PII, separar secretos del codigo y devolver algunos headers de seguridad. Eso no convierte al ejemplo en un backend listo para produccion.

En una aplicacion real harian falta mas capas: diseno de amenazas, autenticacion o autorizacion si corresponde, rate limiting, proteccion contra abuso, almacenamiento seguro, monitoreo, revision de dependencias y controles propios del entorno de despliegue.

## Flujo para participantes

1. Descargar Antigravity.
2. Tener Node.js y npm instalados. El CI usa Node.js 22.
3. Crear un fork de este repositorio en GitHub.
4. Clonar tu fork:

```bash
git clone https://github.com/TU-USUARIO/ainb-workshop-antigravity-vibecoding.git
cd ainb-workshop-antigravity-vibecoding
```

5. Crear una rama con nombre participante, medio y lugar:

```bash
git checkout -b tunombre-medio-lugar
```

6. Crear una skill en `.agents/skills/secure-endpoint/SKILL.md`.
7. Usar esa skill para corregir solo los archivos necesarios del ejercicio: `.gitignore`, `.env`, `.env.example`, `.agents/skills/secure-endpoint/SKILL.md` y `src/submit-endpoint.js`.
8. Ejecutar la validacion local. No hace falta instalar dependencias; este repo usa solo Node.js:

```bash
npm test
```

9. Commit y push a tu fork:

```bash
git add .
git commit -m "Fix workshop security findings"
git push origin tunombre-medio-lugar
```

10. Abrir un pull request desde tu fork hacia el repositorio principal para ver el resultado del CI del workshop.

### Si no puedes crear un fork

Si GitHub no te permite crear un fork, solicita acceso directo al repositorio:

1. En GitHub, entra a `Issues`, haz clic en `New issue` y elige la plantilla "Solicitar acceso al repo".
2. Completa tu usuario de GitHub sin `@`.
3. Espera a que el equipo facilitador te de acceso temporal al repositorio.
4. Acepta la invitacion de GitHub.
5. Clona el repositorio principal:

```bash
git clone https://github.com/marktubegroup/ainb-workshop-antigravity-vibecoding.git
cd ainb-workshop-antigravity-vibecoding
```

6. Crea una rama con la misma estructura: nombre, medio y lugar.

```bash
git checkout -b tunombre-medio-lugar
```

7. Completa el ejercicio en esa rama.
8. Ejecuta la validacion local:

```bash
npm test
```

9. Commit y push al repositorio principal:

```bash
git add .
git commit -m "Fix workshop security findings"
git push origin tunombre-medio-lugar
```

10. Abre un pull request desde tu rama hacia `main`.

En cualquier caso, la entrega del ejercicio debe terminar en un pull request hacia el repositorio principal.

## Criterios para completar el workshop

El ejercicio se considera completo para fines del workshop cuando:

- `.env` ya no esta versionado.
- Existe un `.env.example` sin secretos reales.
- `.gitignore` ignora `.env` y variantes locales, pero permite versionar `.env.example`.
- Existe `.agents/skills/secure-endpoint/SKILL.md`.
- La skill exige validacion por schema, sanitizacion, Secret Manager o secretos externos, headers de seguridad, logs sin PII y test adversarial.
- `src/submit-endpoint.js` rechaza payloads maliciosos.
- El endpoint no registra PII, texto del tip, tokens ni secretos.
- El endpoint devuelve headers minimos: CSP, HSTS y X-Frame-Options.
- `npm test` pasa localmente y en GitHub Actions.

## Validacion

Al inicio del ejercicio, `npm test` debe fallar porque el repositorio viene vulnerable a proposito. Despues de aplicar la skill y corregir los archivos permitidos, valida localmente:

```bash
npm test
```

La validacion revisa tanto la estructura del repositorio como el comportamiento seguro del endpoint ante entradas validas y maliciosas.

Despues abre el pull request. GitHub Actions correra la misma validacion en el PR. Si el check falla, revisa el mensaje de error, corrige tu rama y vuelve a pushear.

No modifiques `package.json`, `.github/workflows/security.yml`, `scripts/security-check.mjs` ni `tests/submit-endpoint.security.test.js`: son el arnes de validacion del workshop. En un pull request, GitHub Actions verifica que esos archivos no hayan cambiado.

## Prompt sugerido para crear la skill

```text
Crea una skill llamada secure-endpoint para repositorios JavaScript/TypeScript.
Debe usarse cuando se cree o revise un endpoint que reciba datos de usuarios, fuentes o audiencias.

La skill debe exigir:
- validacion por schema y sanitizacion;
- secretos externos o Secret Manager, nunca secretos en codigo;
- `.env` ignorado y `.env.example` versionado sin secretos reales;
- headers de seguridad: CSP, HSTS y X-Frame-Options;
- logs estructurados sin PII, contacto, texto sensible ni claves;
- tests unitarios y al menos un test adversarial con payload malicioso.

Despues usa la skill secure-endpoint para corregir src/submit-endpoint.js y ejecuta npm test.
```
