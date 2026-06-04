import { config } from './config.js';

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'none'",
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Handler seguro para un POST /submit de tips o denuncias anónimas.
export function handleSubmit(request, logger = console) {
  const body = request.body || {};

  const tipText = body.text;
  if (!tipText || typeof tipText !== 'string' || tipText.trim() === '') {
    return {
      status: 400,
      headers: SECURITY_HEADERS,
      body: { error: 'El texto del tip es requerido.' }
    };
  }

  // Sanitización y validación contra contenido malicioso (como scripts o tags HTML)
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(tipText) || /<[^>]+>/g.test(tipText)) {
    return {
      status: 400,
      headers: SECURITY_HEADERS,
      body: { error: 'Contenido malicioso detectado.' }
    };
  }

  // Registrar el evento sin exponer PII (tipText, contact) ni secretos (adminToken)
  const hasContactInfo = !!body.contact;
  logger.info('new tip received', {
    hasContactInfo,
    timestamp: new Date().toISOString()
  });

  return {
    status: 200,
    headers: SECURITY_HEADERS,
    body: {
      ok: true,
      routedWith: config.secretApiKey ? 'configured' : 'missing'
    }
  };
}
