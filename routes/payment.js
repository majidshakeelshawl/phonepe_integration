import { Router } from "express";

// Utils
import { initiatePayment, generateXVerifyPayment, plainToBase64 } from "../utils/phonePe.js";

const router = Router();

router.post('/createPhonePePayment', async (req, res) => {
    const { amount, merchantUserId, mobileNumber, name, email } = req.body;
    const merchantId = process.env.PHONEPE_MERCHANT_ID_TEST;
    const merchantTransactionId = `txn_${Date.now()}`;
    console.log(req.body)

    const payload = {
        merchantId,
        merchantTransactionId,
        merchantUserId,
        amount,
        name,
        email,
        mobileNumber,
        redirectUrl: 'https://66f6-49-36-202-232.ngrok-free.app/',
        redirectMode: 'REDIRECT',
        callbackUrl: `${process.env.NGROK_URL}/webhook/phonePe/web/callback`,
        paymentInstrument: {
            type: 'PAY_PAGE',
        },
    };

    // Generate X-VERIFY
    const X_VERIFY = generateXVerifyPayment(payload);
    // base64EncodedPayload
    const base64EncodedPayload = plainToBase64(payload);
    // Initiate Phonepe
    const response = await initiatePayment(base64EncodedPayload, X_VERIFY);

    console.log("PhonePe Response: ");
    console.dir(response, { depth: null });

    return res.send({
        redirectURL: response.data.instrumentResponse.redirectInfo.url
    });
});




export default router;