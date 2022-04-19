require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmailConfirmationHTML(customerName, orderNro) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div class="contanier section">
      <label>Paisaje</label>
      <div>
        <img src="https://images.pexels.com/photos/6004828/pexels-photo-6004828.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" width="400px">
      </div>
    </div>
  </body>
  </html>`;
}

function getMessage(emailParams) {
  return {
    to: emailParams.toEmail,
    from: 'luis.riosa@autonoma.edu.co',
    subject: 'Envio Correo Practica SendGrid',
    text: `Hola ${emailParams.customerName}, te enviamos las imagenes de los productos comprados y la factura con el número ${emailParams.orderNro}. Gracias por tu compra`,
    html: sendEmailConfirmationHTML(
      emailParams.customerName,
      emailParams.orderNro
    ),
  };
}

async function sendOrder(emailParams) {
  try {
    await sgMail.send(getMessage(emailParams));
    return { message: 'Confirmación de compra enviada' };
  } catch (err) {
    const message = 'No se pudo enviar la orden de compra. Valide los errores';
    console.error(message);
    console.error(err);
    if (err.response) console.error(err.response.body);
    return { message };
  }
}

module.exports = {
  sendOrder,
};