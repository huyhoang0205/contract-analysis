import express from "express";
import {
  detectAndConfirmContractType,
  analyzeContract,
  uploadMiddleware,
  getUserContracts,
  getContractByID,
} from "../controller/contract.controller";
import { isAuthenticated } from "../middlewares/auth";
import { handleErrors } from "../middlewares/error";
import { rateLimit } from "express-rate-limit";

const router: express.Router = express.Router();



//rate limited
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message:
    "Bạn đã gửi quá nhiều request từ IP này, vui lòng thử lại sau 15 phút!",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(429).json({
      success: false,
      message:
        "Bạn đã vượt quá giới hạn dùng thử miễn phí. Vui lòng quay lại sau 10 phút!",
    });
  },
});


router.post(
  "/detect-type",
  limiter,
  isAuthenticated,
  uploadMiddleware,
  handleErrors(detectAndConfirmContractType),
);

router.post(
  "/analyze",
  limiter,
  isAuthenticated,
  uploadMiddleware,
  handleErrors(analyzeContract),
);

router.get("/user-contracts", isAuthenticated, handleErrors(getUserContracts));
router.get("/contract/:id", isAuthenticated, handleErrors(getContractByID));

export default router;
