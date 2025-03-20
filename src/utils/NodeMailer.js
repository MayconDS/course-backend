const nodeMailer = require("nodemailer");
const sendGrid = require("nodemailer-sendgrid-transport");
const getEnvironmentVariables = require("../environments/environment");

class NodeMailer {
  static initiateTransport() {
    return nodeMailer.createTransport({
      host: "smtp.gmail.com", // Substitua pelo SMTP do provedor de e-mail que você está usando
      port: 587,
      secure: false, // true para 465, false para outras portas
      auth: {
        user: "crossfireelite601@gmail.com", // Seu e-mail
        pass: "ehce fhgn ieze ocee", // Sua senha ou app password
      },
    });
  }

  static sendEmail(data) {
    return NodeMailer.initiateTransport().sendMail({
      from: getEnvironmentVariables().sendgrid.email_from,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}

module.exports = NodeMailer;
