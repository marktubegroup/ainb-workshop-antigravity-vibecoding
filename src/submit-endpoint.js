// Handler minimo para un POST /submit de tips o denuncias anonimas.
export function handleSubmit(request, logger = console) {
  const body = request.body || {};

  // Validar y sanitizar input
  const text = body.text;
  const contact = body.contact;

  if (typeof text !== 'string' || text.trim() === '') {
    return {
      status: 400,
      headers: {
        'Content-Security-Policy': "default-src 'none'",
        'X-Frame-Options': 'DENY',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      },
      body: { error: 'Rechazado: El tip de texto no puede estar vacío.' }
    };
  }

  // Sanitización simple contra XSS o HTML malicioso
  const htmlPattern = /<[^>]*>/g;
  if (htmlPattern.test(text)) {
    return {
      status: 400,
      headers: {
        'Content-Security-Policy': "default-src 'none'",
        'X-Frame-Options': 'DENY',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
      },
      body: { error: 'Rechazado: Entrada maliciosa o inválida.' }
    };
  }

  // Logs seguros y estructurados sin PII (sin text, contact, ni secretos)
  logger.info('new tip processed successfully', {
    receivedAt: new Date().toISOString(),
    hasContact: Boolean(contact)
  });

  return {
    status: 200,
    headers: {
      'Content-Security-Policy': "default-src 'none'",
      'X-Frame-Options': 'DENY',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    },
    body: {
      ok: true,
      message: 'El tip ha sido procesado de forma anónima.'
    }
  };
}

