import { Router } from "express";

// Utils
import { generateXVerifyCallback, base64ToPlain } from "../utils/phonePe.js";

const router = Router();

router.post('/phonePe/web/callback', async (req, res) => {
    try {
    const xVerify = req.headers['x-verify'];
    const payload = req.body.response;
    const computedXverify = generateXVerifyCallback(payload);

    if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
        console.table({ xVerify, computedXverify });
    }
        if (xVerify !== computedXverify) {
            return res.status(401).send({
                message: 'Hash Mismatched',
                status: 'FAILED',
            });
        }

        if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
            console.log("Hash Matched ✅");
        }

        // base64 to json and then parse to JS object
        const decodedResponse = JSON.parse(base64ToPlain(payload));

        // Convert amount from paise to rupees
        decodedResponse.data.amount = (decodedResponse.data.amount / 100);

        if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
            console.log(decodedResponse);
        }

        // Here we can do our business logic.
        /**
         * - Update the payment record created upon initiate payment as per requirement.
         * - Update balance. etc
         */

        return res.status(200).send({
            message: 'Callback Success',
            status: 'SUCCESS',
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            message: 'Internal Server Error',
            status: 'FAILED',
        });
    }
});

export default router;