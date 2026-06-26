import type { NextFunction, Request, RequestHandler, Response } from "express";
import multer from "multer";
import type { IUser } from "../model/user.model";
import { redis } from "../config/redis";
import type { FallbackAnalysis } from "../services/ai.service";
import {
  detectContractType,
  extractTextFromPDF,
  AI_MODEL,
  analyzeContractWithAI,
} from "../services/ai.service";
import type { IContractAnalysis } from "../model/contract.model";
import ContractAnalysis from "../model/contract.model";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("application/pdf")) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Only pdf files are allowed!"));
    }
  },
}).single("contract");

export const uploadMiddleware: RequestHandler = upload;

export const detectAndConfirmContractType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as IUser;
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const fileKey = `file:${user._id}:${Date.now()}`;
    await redis.set(fileKey, req.file.buffer);

    await redis.expire(fileKey, 3600); // 1 hour

    const pdfText = await extractTextFromPDF(fileKey);
    const detectedType = await detectContractType(pdfText);

    await redis.del(fileKey);
    res.json({ detectedType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to detect contract type" });
  }
};

export const analyzeContract = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as IUser;
  const { contractType } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!contractType) {
    return res.status(400).json({ error: "Contract type is required" });
  }

  try {
    const fileKey = `file:${user._id}:${Date.now()}`;
    await redis.set(fileKey, req.file.buffer);
    await redis.expire(fileKey, 3600); // 1 hour

    const pdfText = await extractTextFromPDF(fileKey);

    let analysis: FallbackAnalysis | string;

    analysis = await analyzeContractWithAI(pdfText, contractType);

    if (
      typeof analysis === "object" &&
      (!analysis.summary || !analysis.risks || !analysis.opportunities)
    ) {
      throw new Error("Failed to analyze contract");
    }

    const savedAnalysis = await ContractAnalysis.create({
      userId: user._id,
      contractText: pdfText,
      contractType,
      ...(analysis as Partial<IContractAnalysis>),
      language: "vie",
      aiModel: AI_MODEL,
    });

    res.json(savedAnalysis);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to analyze contract" });
  }
};
