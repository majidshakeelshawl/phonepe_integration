import crypto from 'crypto';

export function generateXVerifyPayment(saltKey, saltIndex, payload) {
    const base64Encoded = Buffer.from(JSON.stringify(payload)).toString('base64');
    const requiredString = `${base64Encoded}/pg/v1/pay${saltKey}`;
    const X_VERIFY = `${crypto.createHash('sha256').update(requiredString).digest('hex')}###${saltIndex}`
    return X_VERIFY;
}

export function plainToBase64(payload) {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function initiatePayment(base64EncodedPayload, xVerify) {
    const data = await fetch(process.env.PHONEPE_API_TEST + '/pg/v1/pay', {
        method: "POST",
        body: JSON.stringify({ request: base64EncodedPayload }),
        headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify,
        },
    });
    return data.json();

}

export function generateXVerifyCallback(payload, saltKey, saltIndex) {
    return crypto.createHash('sha256').update(payload + saltKey).digest('hex') + `###${saltIndex}`;
}