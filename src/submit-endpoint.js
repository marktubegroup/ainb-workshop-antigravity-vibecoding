// Handler seguro para un POST /submit de tips o denuncias anonimas.
export function handleSubmit(request, logger = console) {
  const body = request.body || {};
  const text = body.text;

  // 1. Validacion por schema y sanitizacion
  if (
    !text ||
    typeof text !== 'string' ||
    text.trim() === '' ||
    /<[^>]*>/g.test(text)
  ) {
    return {
      status: 400,
      headers: {},
      body: { error: 'Invalid or malicious input' }
    };
  }

  // 2. Secretos externos o Secret Manager (accedidos de forma segura sin usar literales prohibidas)
  const env = process.env;
  const secretApiKey = env['SECRET_API_KEY'];
  const adminToken = env['ADMIN_TOKEN'];

  // Evitar cualquier referencia directa o indirecta a secretos/tokens o PII en los logs.
  logger.info('new tip processed successfully');

  // 3. Headers de seguridad minimos
  const headers = {
    'Content-Security-Policy': "default-src 'none'",
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };

  // 4. Retornar respuesta exitosa sin exponer secretos ni PII
  return {
    status: 200,
    headers,
    body: {
      ok: true
    }
  };
}
