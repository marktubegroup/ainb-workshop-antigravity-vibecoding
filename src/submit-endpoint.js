// Handler minimo para un POST /submit de tips o denuncias anonimas.
const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'none'",
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

const MAX_TEXT_LENGTH = 2000;
const MAX_CONTACT_LENGTH = 200;
const DANGEROUS_INPUT = /<\s*script\b|javascript:|on\w+\s*=|<\/?[a-z][\s\S]*>/i;

function sanitizeText(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function isSafeText(value, maxLength) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= maxLength &&
    !DANGEROUS_INPUT.test(value)
  );
}

function validateBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return null;
  }

  if (!isSafeText(body.text, MAX_TEXT_LENGTH)) {
    return null;
  }

  if (body.contact !== undefined && body.contact !== '' && !isSafeText(body.contact, MAX_CONTACT_LENGTH)) {
    return null;
  }

  return {
    text: sanitizeText(body.text),
    hasContact: typeof body.contact === 'string' && body.contact.trim().length > 0
  };
}

export function handleSubmit(request, logger = console) {
  const submission = validateBody(request?.body);

  if (!submission) {
    logger.info('tip rejected', {
      event: 'tip_rejected',
      reason: 'invalid_payload'
    });

    return {
      status: 400,
      headers: SECURITY_HEADERS,
      body: {
        ok: false,
        error: 'invalid_payload'
      }
    };
  }

  logger.info('tip accepted', {
    event: 'tip_accepted',
    textLength: submission.text.length,
    hasContact: submission.hasContact
  });

  return {
    status: 200,
    headers: SECURITY_HEADERS,
    body: {
      ok: true,
      received: true
    }
  };
}
