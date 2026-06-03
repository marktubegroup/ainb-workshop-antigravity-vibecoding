import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const secretPattern = /WORKSHOP_(SECRET|TOKEN)_[A-Z0-9_-]{16,}|postgres:\/\/[^:\s]+:[^@\s]+@/i;

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function listFiles(dir, files = []) {
  for (const entry of readdirSync(path.join(root, dir))) {
    const relativePath = path.join(dir, entry);
    const absolutePath = path.join(root, relativePath);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      if (!['.git', 'node_modules', 'dist', 'coverage'].includes(entry)) {
        listFiles(relativePath, files);
      }
      continue;
    }

    files.push(relativePath);
  }

  return files;
}

function gitTracked(file) {
  try {
    const output = execSync(`git ls-files -- ${file}`, { encoding: 'utf8' });
    return output.split('\n').filter(Boolean).includes(file);
  } catch {
    return false;
  }
}

function gitIgnored(file) {
  try {
    execSync(`git check-ignore -q -- ${file}`);
    return true;
  } catch {
    return false;
  }
}

if (existsSync(path.join(root, '.env')) && gitTracked('.env')) {
  failures.push('El archivo .env esta versionado. Eliminalo del indice con git rm --cached .env y usa .env.example para placeholders.');
}

if (existsSync(path.join(root, '.env')) && !gitIgnored('.env')) {
  failures.push('El archivo .env existe pero no esta ignorado. Agrega .env al .gitignore.');
}

if (!existsSync(path.join(root, '.gitignore'))) {
  failures.push('Falta .gitignore.');
} else {
  const gitignore = read('.gitignore');
  const ignoresEnv = /^\.env$/m.test(gitignore);
  const ignoresEnvVariants = /^\.env\.\*$/m.test(gitignore) || /^\.env\.local$/m.test(gitignore);
  const keepsEnvExample = !/^\.env\.\*$/m.test(gitignore) || /^!\.env\.example$/m.test(gitignore);

  if (!ignoresEnv || !ignoresEnvVariants) {
    failures.push('El .gitignore debe ignorar .env y variantes locales como .env.local o .env.*.');
  }

  if (!keepsEnvExample) {
    failures.push('El .gitignore ignora .env.example. Agrega !.env.example para poder versionar el ejemplo sin secretos.');
  }
}

if (!existsSync(path.join(root, '.env.example'))) {
  failures.push('Falta .env.example con nombres de variables sin secretos reales.');
} else if (secretPattern.test(read('.env.example'))) {
  failures.push('.env.example contiene un valor sensible. Debe incluir solo nombres de variables o placeholders seguros.');
}

const skillPath = '.agents/skills/secure-endpoint/SKILL.md';
if (!existsSync(path.join(root, skillPath))) {
  failures.push(`Falta ${skillPath}. El workshop requiere una skill versionada para endpoints seguros.`);
} else {
  const skill = read(skillPath);
  const requiredSkillTerms = [
    [/schema|validaci/i, 'validacion por schema'],
    [/saniti/i, 'sanitizacion de inputs'],
    [/secret manager|secrets externos|secreto/i, 'secretos externos o Secret Manager'],
    [/content-security-policy|csp|x-frame-options|hsts|headers/i, 'headers de seguridad'],
    [/pii|datos personales|contacto|logs/i, 'logs sin PII'],
    [/test adversarial|adversarial test|payload malicioso|input malicioso/i, 'test adversarial']
  ];

  for (const [pattern, label] of requiredSkillTerms) {
    if (!pattern.test(skill)) {
      failures.push(`${skillPath}: debe cubrir ${label}.`);
    }
  }
}

for (const file of listFiles('.')) {
  if (!/\.(js|ts|jsx|tsx|env)$/.test(file)) {
    continue;
  }

  if (file === 'scripts/security-check.mjs') {
    continue;
  }

  if (/^\.env(\.|$)/.test(file) && !gitTracked(file) && gitIgnored(file)) {
    continue;
  }

  const content = read(file);

  if (secretPattern.test(content)) {
    failures.push(`${file}: contiene un secreto hardcodeado o un valor de entorno sensible.`);
  }

  if (/process\.env\.(SECRET|ADMIN|TOKEN|PASSWORD|DATABASE|API_KEY)[A-Z0-9_]*/.test(content)) {
    failures.push(`${file}: accede a secretos directamente desde codigo de aplicacion. Usa una capa de configuracion segura o Secret Manager.`);
  }

  if (/logger\.(info|log|debug|warn|error)\([^)]*(body\.(text|contact|email)|adminToken|\bsecret\b|\bpassword\b|\btoken\b)/is.test(content)) {
    failures.push(`${file}: registra PII o secretos en logs.`);
  }

  if (file === 'src/submit-endpoint.js') {
    if (!/Content-Security-Policy|X-Frame-Options|Strict-Transport-Security/.test(content)) {
      failures.push(`${file}: falta definir headers de seguridad minimos.`);
    }

    if (!/status:\s*400|throw new Error|reject/i.test(content)) {
      failures.push(`${file}: falta rechazo explicito de input invalido o malicioso.`);
    }
  }
}

if (failures.length > 0) {
  console.error('Security check failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Security check passed.');
