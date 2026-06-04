// Handler minimo para un POST /submit de tips o denuncias anonimas.
// El archivo esta vulnerable a proposito para el ejercicio del workshop.
export function handleSubmit(request, logger = console) {
  const body = request.body || {};

  // 1. Validacion por schema y sanitizacion
  const text = body.text;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return {
      status: 400,
      headers: {},
      body: { ok: false }
    };
  }

  // Rechazo explicito de input malicioso (ej. etiquetas script o HTML)
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(text) || /<[^>]+>/g.test(text)) {
    return {
      status: 400,
      headers: {},
      body: { ok: false }
    };
  }

  // 2. Logs estructurados sin PII ni secretos
  logger.info('new tip submission received');

  // 3. Retorno seguro con cabeceras de seguridad
  return {
    status: 200,
    headers: {
      'Content-Security-Policy': "default-src 'none'",
      'X-Frame-Options': 'DENY',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    },
    body: {
      ok: true
    }
  };
}
