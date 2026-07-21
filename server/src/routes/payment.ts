import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { handleErrors } from "../middlewares/error";
import {
  createCheckoutSession,
  getPremiumStatus,
} from "../controller/payment.controller";
import {
  createUrlCheckout,
  verifyIPN,
} from "../controller/paymemt.vnpay.controller";

const router: express.Router = express.Router();

router.get(
  "/create-checkout-session",
  isAuthenticated,
  handleErrors(createCheckoutSession),
);
router.get(
  "/membership-status",
  isAuthenticated,
  handleErrors(getPremiumStatus),
);
router.get(
  "/create-checkout-session/vnpay",
  isAuthenticated,
  handleErrors(createUrlCheckout),
);

router.get("/vnpay-ipn", verifyIPN);

export default router;
