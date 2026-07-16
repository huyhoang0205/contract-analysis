import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { handleErrors } from "../middlewares/error";
import {
  createCheckoutSession,
  getPremiumStatus,
} from "../controller/payment.controller";

const router: express.Router = express.Router();

router.get("/create-checkout-session", isAuthenticated, createCheckoutSession);
router.get("/membership-status", isAuthenticated, getPremiumStatus);

export default router;
