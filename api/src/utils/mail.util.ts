import { Injectable } from "@nestjs/common";
const Mailjet = require('node-mailjet');

interface IMailInput {
  to: {
    email: string;
    name: string;
  }[],
  subject: string,
  textPart: string,
  htmlPart: string,
  customID?: string,
}

@Injectable()
export class MailUtil {

  private mailJet: any;

  constructor() {
    this.mailJet = new Mailjet({
      apiKey: process.env.MAIL_JET_API_KEY ?? 'asd',
      apiSecret: process.env.MAIL_JET_API_SECRET ?? 'sda',
    });
  }

  async sendEmail(input: IMailInput) {

    await this.mailJet.post('send', { version: 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": "emocionesutm@gmail.com",
              "Name": "Deteccion de emociones",
            },
            "To": input.to,
            "Subject": input.subject,
            "textPart": input.textPart,
            "HTMLPart": input.htmlPart,
            "CustomID": input.customID ?? 'recovery-code',
          }
        ],
      });
  }
}
