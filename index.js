require('dotenv').config();

const express = require('express');

const port = 3000 || process.env.port;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const email = require('./email');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({ message: 'success' });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

client.messages
  .create({
    body: 'Mensaje de twilio por whatsapp',
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+573023607665',
  })
  .then((message) => console.log(message.sid))
  .done();

app.post('/api/email/confirmation', async (req, res, next) => {
  try {
    res.json(await email.sendOrder(req.body));
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: error.message });
  return;
});

function getMessage() {
  const body = 'Mensaje enviado el 06/04/2022 07:00:00 a.m';
  return {
    to: 'simonriosarcila@gmail.com',
    from: 'luis.riosa@autonoma.edu.co',
    subject: 'Prueba Mensaje de prueba software II',
    text: body,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    </head>
    <body>
    <div class="contanier section">
        <label><strong>Paisaje</strong></label>
        <img src="https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" width="400px">
    </div>
    </body>
    </html>`,
  };
}

async function sendEmail() {
  try {
    await sgMail.send(getMessage());
    console.log('Correo ha sido enviado');
  } catch (err) {
    console.error('No se pudo enviar el mensaje');
    console.error(err);
    if (err.response) console.error(err.response.body);
  }
}

async () => {
  console.log('Enviando correo electronico');
  await sendEmail();
};
