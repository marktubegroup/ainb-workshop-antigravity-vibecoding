// Capa de configuración segura para encapsular las variables de entorno de la aplicación.
// Evita el acceso directo a process.env para proteger los secretos del código base.

export const config = {
  secretApiKey: process.env['SECRET_API_KEY'],
  adminToken: process.env['ADMIN_TOKEN'],
  databaseUrl: process.env['DATABASE_URL']
};
