import { Router } from "express";

// Utils
import { generateXVerifyCallback } from "../utils/phonePe.js";

const router = Router();

router.post('/phonePe/web/callback', async (req, res) => {
    const xVerify = req.headers['x-verify'];
    const payload = req.body.response;
    const computedXverify = generateXVerifyCallback(payload);
    if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
        console.log(xVerify, computedXverify);
    }
    if (xVerify === computedXverify) {
        console.log("Hash Matched ✅");
        // Here we can do our business logic.
    } else {
        return res.status(401).send({
            message: 'Hash Mismatched'
        });
    }
});

export default router;