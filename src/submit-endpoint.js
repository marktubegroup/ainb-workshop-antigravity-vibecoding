// Handler minimo para un POST /submit de tips o denuncias anonimas.
// El archivo esta vulnerable a proposito para el ejercicio del workshop.
export function handleSubmit(request, logger = console) {
  const body = request.body || {};

  logger.info('new tip received', {
    text: body.text,
    contact: body.contact,
    adminToken: process.env.ADMIN_TOKEN
  });

  return {
    status: 200,
    headers: {},
    body: {
      ok: true,
      text: body.text,
      contact: body.contact,
      routedWith: process.env.SECRET_API_KEY
    }
  };
}
