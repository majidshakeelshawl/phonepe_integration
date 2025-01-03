import express from 'express';
import os from 'os';
import morgan from 'morgan';

// Utils
import { generateXVerifyPayment, initiatePayment, plainToBase64, generateXVerifyCallback } from './utils/phonePe.js';

const app = express();
app.use(express.json());

// Morgan
app.use(morgan('dev'));

// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index', {
        title: 'PhonePe | Web Integration',
        message: 'PhonePe Payment',
        environment: process.env.ENVIRONMENT,
    });
});

app.post('/createPhonePePayment', async (req, res) => {
    const saltKey = process.env.PHONEPE_SALT_KEY_TEST;
    const saltIndex = process.env.PHONEPE_SALT_INDEX_TEST;

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
    const X_VERIFY = generateXVerifyPayment(saltKey, saltIndex, payload);
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

// Callback URL 
app.post('/webhook/phonePe/web/callback', async (req, res) => {
    const xVerify = req.headers['x-verify'];
    const payload = req.body.response;
    const saltKey = process.env.PHONEPE_SALT_KEY_TEST;
    const saltIndex = process.env.PHONEPE_SALT_INDEX_TEST;
    const computedXverify = generateXVerifyCallback(payload, saltKey, saltIndex);
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


// Static
app.use(express.static('public'));


app.listen(3011, () => {
    if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
        console.table({
            status: 'running',
            port: 3011,
            time: new Date().toLocaleString(),
            os: os.platform(),
            host: os.hostname(),
            cpus: os.cpus().length,
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            uptime: os.uptime(),
        }) 
    }
});