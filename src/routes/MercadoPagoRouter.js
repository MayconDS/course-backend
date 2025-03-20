const Router = require("express");
const MercadoPagoController = require("../controllers/MercadoPagoController");

class MercadoPagoRouter {
  static router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();

    this.deleteRoutes();
  }
  getRoutes() {
    this.router.get("/getpayment", MercadoPagoController.getPayment);
  }
  postRoutes() {
    this.router.post(
      "/create-payment-card",
      MercadoPagoController.createPaymentCard
    );
    this.router.post(
      "/create-payment-pix",
      MercadoPagoController.createPaymentPix
    );
    this.router.post(
      "/create-preference",
      MercadoPagoController.createPreference
    );
    this.router.post("/payment-update", MercadoPagoController.paymentUpdate);
  }
  putRoutes() {}

  deleteRoutes() {}
}

module.exports = new MercadoPagoRouter().router;
