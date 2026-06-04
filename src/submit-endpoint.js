// Handler seguro para POST /submit de tips o denuncias anonimas.

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'none'",
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

function sanitize(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '').trim();
}

function isValid(body) {
  if (!body || typeof body.text !== 'string') return false;
  if (/<[^>]*>/.test(body.text)) return false;
  return body.text.trim().length > 0;
}

export function handleSubmit(request, logger = console) {
  const body = request.body || {};

  if (!isValid(body)) {
    return {
      status: 400,
      headers: { ...SECURITY_HEADERS },
      body: { ok: false, error: 'Invalid input' }
    };
  }

  logger.info('tip received', { timestamp: new Date().toISOString() });

  return {
    status: 200,
    headers: { ...SECURITY_HEADERS },
    body: { ok: true }
  };
}
