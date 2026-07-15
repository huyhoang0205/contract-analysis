import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { handleErrors } from "../middlewares/error";
import { createCheckoutSession } from "../controller/payment.controller";

const router: express.Router = express.Router();

router.get("/create-checkout-session", isAuthenticated, createCheckoutSession);

export default router;
