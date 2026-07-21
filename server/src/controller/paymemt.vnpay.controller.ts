import { VNPay } from "vnpay/vnpay";

import type { Request, Response } from "express";
import type { IUser } from "../model/user.model";
import {
  IpnFailChecksum,
  IpnSuccess,
  IpnUnknownError,
  VnpLocale,
  type VerifyReturnUrl,
} from "vnpay";
import { sendPremiumConformationEmail } from "../services/email.service";
import User from "../model/user.model";

const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE!,
  secureSecret: process.env.VNPAY_SECURE_SECRET!,
  testMode: true,
});

export const createUrlCheckout = async (req: Request, res: Response) => {
  const user = req.user as IUser;

  try {
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: 10000,
      vnp_IpAddr: req.ip || "127.0.0.1",
      vnp_ReturnUrl: `${process.env.CLIENT_URL}/payment_success`,
      vnp_TxnRef: `${user._id.toString()}`,
      vnp_OrderInfo: "Đăng ký thành viên Contract Analysis",
      vnp_Locale: VnpLocale.VN,
    });

    res.json({ success: true, url: paymentUrl });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyIPN = async (req: Request, res: Response) => {
  try {
    console.log(req.query);
    const verify: VerifyReturnUrl = await vnpay.verifyIpnCall(req.query as any);
    if (!verify) {
      return res.json(IpnFailChecksum);
    }

    if (!verify.isSuccess) {
      return res.json(IpnUnknownError);
    }

    if (verify.vnp_ResponseCode === "00") {
      const userId = verify.vnp_TxnRef;
      if (userId) {
        const user = await User.findByIdAndUpdate(
          userId,
          { isPremium: true },
          { returnDocument: "after" },
        );
        if (user && user.email) {
          await sendPremiumConformationEmail(user.email, user.displayName);
        }
      }
    }
    return res.json(IpnSuccess);
  } catch (error: any) {
    console.log(`verify error: ${error}`);
    return res.json(IpnUnknownError);
  }
};
