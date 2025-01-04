import { Router } from "express";

// Utils
import { initiatePayment, generateXVerifyPayment, plainToBase64 } from "../utils/phonePe.js";
import PHONE_PE_CONSTANTS from '../utils/phonePe.js';

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
        redirectUrl: `${PHONE_PE_CONSTANTS.BASE_URL}/payment/status`,
        redirectMode: 'REDIRECT',
        callbackUrl: `${PHONE_PE_CONSTANTS.BASE_URL}/webhook/phonePe/web/callback`,
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

router.get('/status', (req, res) => {
    res.render('paymentStatus', {
        title: 'PhonePe | Web Integration',
        message: 'PhonePe Payment',
        // You have to implement this dynamically using the transactionId and get the record that
        // is updated by the callbackUrl webhook.
        status: "SUCCESS",
        transactionId: "SAMPLE_ID",
    });
});

export default router;