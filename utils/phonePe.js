import crypto from 'crypto';

// PhonePe Env Setup
let API_URL, SALT_KEY, SALT_INDEX, MERCHANT_ID, BASE_URL;
if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
    API_URL = process.env.PHONEPE_API_TEST;
    SALT_KEY = process.env.PHONEPE_SALT_KEY_TEST;
    SALT_INDEX = process.env.PHONEPE_SALT_INDEX_TEST;
    MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID_TEST;
    BASE_URL = process.env.NGROK_URL;
} else {
    API_URL = process.env.PHONEPE_API_PROD;
    SALT_KEY = process.env.PHONEPE_SALT_KEY_PROD;
    SALT_INDEX = process.env.PHONEPE_SALT_INDEX_PROD;
    MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID_PROD;
    BASE_URL = process.env.PRODUCTION_URL;
}

export function generateXVerifyPayment(payload) {
    const base64Encoded = plainToBase64(payload);
    console.log("yeah js", base64Encoded)
    const requiredString = `${base64Encoded}/pg/v1/pay${SALT_KEY}`;
    const X_VERIFY = `${crypto.createHash('sha256').update(requiredString).digest('hex')}###${SALT_INDEX}`
    return X_VERIFY;
}

export function plainToBase64(payload) {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function initiatePayment(base64EncodedPayload, xVerify) {
    const data = await fetch(API_URL + '/pg/v1/pay', {
        method: "POST",
        body: JSON.stringify({ request: base64EncodedPayload }),
        headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify,
        },
    });
    return data.json();
}

export function generateXVerifyCallback(payload) {
    return crypto.createHash('sha256').update(payload + SALT_KEY).digest('hex') + `###${SALT_INDEX}`;
}

export default {
    BASE_URL,
}