const { Payment, MercadoPagoConfig, Preference } = require("mercadopago");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const getEnvironmentVariables = require("../environments/environment");
const { allowAccessCourse } = require("../utils/Utils");
const WebSocketService = require("../services/WebSocketService");
const crypto = require("crypto");

const production = {
  secretKey: "d6efb3b21809e21789f91fe9a7ab4eadcb800f93f77b663bcb5d0c24926bd948",

  acessToken:
    "APP_USR-7811419267009284-101914-49614075aa04e9fcb67dd7200735d2c0-1429874750",
};
const development = {
  secretKey: "d6efb3b21809e21789f91fe9a7ab4eadcb800f93f77b663bcb5d0c24926bd948",
  acessToken:
    "TEST-7811419267009284-101914-a37c1f8227c97bc4ed2445041b8e7f8b-1429874750",
};
class MercadoPagoController {
  static async getPayment(req, res, next) {
    const client = new MercadoPagoConfig({
      accessToken: development.acessToken,
      options: {
        timeout: 5000,
        idempotencyKey: "abc",
      },
    });

    const information = await new Payment(client)
      .get({
        id: req.headers.paymentid,
      })
      .catch(console.log);

    res.status(200).json({
      response: information,
    });
  }
  static async createPreference(req, res, next) {
    const { title, quantity, price } = req.body;
    const client = new MercadoPagoConfig({
      accessToken: development.acessToken,
      options: {
        timeout: 5000,
        idempotencyKey: "abc",
      },
    });

    try {
      const preference = await new Preference(client).create({
        body: {
          items: [
            {
              title: title,
              quantity: quantity,
              unit_price: price,
              picture_url:
                "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
              description: "Descrição do Item",
            },
          ],

          back_urls: {
            success: "http://localhost:3000/profile",
            failure: "https://www.seusite.com/falha",
            pending: "https://www.seusite.com/pendente",
          },
          auto_return: "approved",
        },
      });

      res.json({ preferenceId: preference.id });
    } catch (error) {
      console.error("Erro ao criar preferência:", error);
      res.status(500).json({ error: "Erro ao criar preferência" });
    }
  }
  static async createPaymentCard(req, res, next) {
    const client = new MercadoPagoConfig({
      accessToken: development.acessToken,
      options: {
        timeout: 5000,
        idempotencyKey: "abc",
      },
    });

    const payment = new Payment(client);
    console.log(req.body);
    payment
      .create({
        body: {
          token: req.body.token,
          issuer_id: req.body.issuer_id,
          transaction_amount: req.body.transaction_amount,
          payment_method_id: req.body.payment_method_id,
          installments: req.body.installments,
          statement_descriptor: "ALSCREATIVE",
          notification_url:
            "https://b43f-177-75-242-252.ngrok-free.app/api/payment/payment-update",
          payer: {
            email: req.body.payer.email,
            first_name: req.body.payer.first_name,
            identification: {
              type: req.body.payer.identification.type,
              number: req.body.payer.identification.number,
            },
          },
          additional_info: {
            items: req.body.items,
          },
          external_reference: req.body.external_reference,
          metadata: {
            productId: req.body.metadata.productId,
          },
        },
        requestOptions: {
          idempotencyKey: uuidv4(),
        },
      })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch(console.log);
  }
  static async createPaymentPix(req, res, next) {
    const client = new MercadoPagoConfig({
      accessToken: development.acessToken,
      options: {
        timeout: 5000,
        idempotencyKey: "abc",
      },
    });

    const payment = new Payment(client);
    console.log(req.body);
    payment
      .create({
        body: {
          transaction_amount: req.body.transaction_amount,
          payment_method_id: req.body.payment_method_id,

          payer: {
            email: req.body.payer.email,
            first_name: req.body.payer.first_name,
          },
          additional_info: {
            items: req.body.items,
          },
          external_reference: req.body.external_reference,
          metadata: {
            productId: req.body.metadata.productId,
          },
          statement_descriptor: "ALSCREATIVE",
          notification_url:
            "https://b43f-177-75-242-252.ngrok-free.app/api/payment/payment-update",
        },
        requestOptions: {
          idempotencyKey: uuidv4(),
        },
      })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch(console.log);
  }
  static async paymentUpdate(req, res, next) {
    try {
      const xSignature = req.headers["x-signature"];
      const xRequestId = req.headers["x-request-id"];

      if (!xSignature || !xRequestId) {
        console.error("Assinatura ou ID de requisição faltando.");
        return res
          .status(400)
          .json({ error: "Missing signature or request-id" });
      }

      // Pegando os parâmetros da URL
      const url = new URL(`http://localhost:4000${req.originalUrl}`);
      const dataID = url.searchParams.get("data.id");

      if (!dataID) {
        console.error("Parâmetro data.id não encontrado na URL.");
        return res.status(400).json({ error: "Missing data.id" });
      }

      // Separando a assinatura
      const [tsPart, v1Part] = xSignature.split(",");
      const ts = tsPart.split("=")[1];
      const receivedHash = v1Part.split("=")[1];

      // Pegando o corpo da requisição
      const body = JSON.stringify(req.body);
      const secret = development.secretKey;

      // Criando HMAC

      const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
      const hmac = crypto.createHmac("sha256", secret);

      hmac.update(manifest);
      const generatedHash = hmac.digest("hex");

      if (generatedHash !== receivedHash) {
        console.error("Assinatura inválida.");
        return res.status(400).json({ error: "Invalid signature" });
      }

      const parsedBody = JSON.parse(body);

      if (req.body.action === "payment.updated") {
        try {
          const response = await axios({
            url: "https://b43f-177-75-242-252.ngrok-free.app/api/payment/getpayment",
            headers: {
              paymentid: req.body.data.id,
            },
          });

          const r = response.data;

          if (r.response.status === "approved") {
            await allowAccessCourse(
              r.response.external_reference,
              r.response.metadata.product_id
            );

            // Emitir evento via WebSocket
            const userId = r.response.external_reference; // Use o ID do usuário associado ao pagamento
            WebSocketService.emitToUser(userId, "payment_status", {
              status: "approved",
              paymentId: req.body.data.id,
            });

            res.status(200).json({ response: r });
          } else {
            console.log("Payment not approved:", r.response.status);
            res.status(400).json({ message: "Payment not approved" });
          }
        } catch (error) {
          console.log("Erro na requisição ou processamento:", error.message);
          res.status(500).json({ error: error.message });
        }
      } else {
        return;
      }
    } catch (error) {
      req.status(500).json({ error: error.message });
    }
  }
}

module.exports = MercadoPagoController;
