import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { handleSubmit } from '../src/submit-endpoint.js';

function createLogger() {
  const entries = [];

  return {
    entries,
    info(message, payload) {
      entries.push({ message, payload });
    }
  };
}

describe('POST /submit security behavior', () => {
  it('rejects malicious or empty tip text', () => {
    const response = handleSubmit({
      body: {
        text: '<script>alert("xss")</script>',
        contact: 'source@example.com'
      }
    }, createLogger());

    assert.equal(response.status, 400);
  });

  it('sets minimum browser security headers', () => {
    const response = handleSubmit({
      body: {
        text: 'Tengo informacion verificable para la redaccion.',
        contact: ''
      }
    }, createLogger());

    assert.equal(response.headers['Content-Security-Policy'], "default-src 'none'");
    assert.equal(response.headers['X-Frame-Options'], 'DENY');
    assert.equal(response.headers['Strict-Transport-Security'], 'max-age=31536000; includeSubDomains');
  });

  it('does not log contact data, tip text, tokens, or secrets', () => {
    const logger = createLogger();

    handleSubmit({
      body: {
        text: 'Mi nombre no deberia quedar en logs.',
        contact: 'source@example.com'
      }
    }, logger);

    const serializedLogs = JSON.stringify(logger.entries);

    assert.doesNotMatch(serializedLogs, /source@example\.com/);
    assert.doesNotMatch(serializedLogs, /Mi nombre no deberia quedar en logs/);
    assert.doesNotMatch(serializedLogs, /TOKEN|SECRET|WORKSHOP_SECRET|WORKSHOP_TOKEN/i);
  });

  it('does not return contact data, tip text, tokens, or secrets', () => {
    const response = handleSubmit({
      body: {
        text: 'Tengo informacion sensible para compartir.',
        contact: 'source@example.com'
      }
    }, createLogger());

    const serializedBody = JSON.stringify(response.body);

    assert.doesNotMatch(serializedBody, /Tengo informacion sensible/);
    assert.doesNotMatch(serializedBody, /source@example\.com/);
    assert.doesNotMatch(serializedBody, /TOKEN|SECRET|WORKSHOP_SECRET|WORKSHOP_TOKEN/i);
  });
});
