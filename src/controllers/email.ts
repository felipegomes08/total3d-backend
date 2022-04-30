import nodemailer from 'nodemailer'

import { NewError } from '../utils'

async function send(template) {
  const mail = nodemailer.createTransport({
    host: process.env.MAIL_TRANSPORT,
    port: parseInt(process.env.MAIL_PORT),
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  const send = await mail.sendMail(template, error => {
    if (error) {
      // eslint-disable-next-line no-console
      console.log({ errorSendMail: error })
      throw NewError(error.message, 500)
    } else {
      return true
    }
  })

  return send
}

const templateRecoveryPassword = (
  emailToSend: string,
  nameUserToSend: string,
  code: number
) => {
  return {
    from: 'Total3d ' + process.env.MAIL_USER,
    to: emailToSend,
    subject: 'Recuperação de Senha',
    html: `
      <html>
          <strong>Olá, ${nameUserToSend}</strong>
          <br/>
          <p>Recebemos uma solicitação para redefinir a senha de sua conta.</p>
          </br>
          <h2>${code}</h2>
          <br/>
          <p>O código expira em 15 minutos.</p>
          <br/>
          Equipe Total3d
      </html>
      `,
  }
}

export const generateCode = () => {
  return Math.floor(Math.random() * (999999 - 100000) + 100000)
}

export function sendMailRecovery(email: string, sender: string, code: number) {
  const template = templateRecoveryPassword(email, sender, code)

  return send(template)
}
