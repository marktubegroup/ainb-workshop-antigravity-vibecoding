export function handleSubmit(request, logger = console) {
  const body = request.body || {};

  const text =
    typeof body.text === 'string'
      ? body.text.trim()
      : '';

  const contact =
    typeof body.contact === 'string'
      ? body.contact.trim()
      : '';

  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'none'",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };

  // Rechazo explícito de input inválido
  if (!text || text.length > 1000) {
    return {
      status: 400,
      headers: securityHeaders,
      body: {
        ok: false,
        error: 'Invalid input'
      }
    };
  }

  // Rechazo explícito de payloads maliciosos
  if (/<script|javascript:|onerror=|onload=/i.test(text)) {
    return {
      status: 400,
      headers: securityHeaders,
      body: {
        ok: false,
        error: 'Invalid input'
      }
    };
  }

  // Sanitización básica (aunque ya no se devuelvan en el body, es buena práctica)
  // const sanitizedText = text.replace(/[<>]/g, '');
  // const sanitizedContact = contact.replace(/[<>]/g, '');

  // Log sin PII ni secretos
  logger.info('new tip received');

  return {
    status: 200,
    headers: securityHeaders,
    body: {
      ok: true,
      message: 'Tip received successfully'
    }
  };
}
