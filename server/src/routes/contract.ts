import express from "express";
import {
  detectAndConfirmContractType,
  analyzeContract,
  uploadMiddleware,
} from "../controller/contract.controller";
import { isAuthenticated } from "../middlewares/auth";
import { handleErrors } from "../middlewares/error";

const router: express.Router = express.Router();

router.post(
  "/detect-type",
  isAuthenticated,
  uploadMiddleware,
  handleErrors(detectAndConfirmContractType),
);

router.post(
  "/analyze",
  isAuthenticated,
  uploadMiddleware,
  handleErrors(analyzeContract),
);

// router.get("/user-contracts", isAuthenticated, handleErrors(getUserContracts));
// router.get("/contract/:id", isAuthenticated, handleErrors(getContractByID));

export default router;