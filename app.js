import express from 'express';
import os from 'os';
import crypto from 'crypto';

const app = express();
app.use(express.json());

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
        redirectUrl: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        redirectMode: 'POST',
        callbackUrl: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        paymentInstrument: {
            type: 'PAY_PAGE',
        },
    };

    // Generate X-VERIFY
    const saltKey = process.env.PHONEPE_SALT_KEY_TEST;
    const saltIndex = process.env.PHONEPE_SALT_INDEX_TEST;
    const base64Encoded = Buffer.from(JSON.stringify(payload)).toString('base64');
    const requiredString = `${base64Encoded}/pg/v1/pay${saltKey}`;
    const X_VERIFY = `${crypto.createHash('sha256').update(requiredString).digest('hex')}###${saltIndex}`
    console.table({
        apiEndpoint: process.env.PHONEPE_API_TEST + '/pg/v1/pay',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': X_VERIFY,
        },
        body: JSON.stringify({ request: base64Encoded }),
    });
    const data = await fetch(process.env.PHONEPE_API_TEST + '/pg/v1/pay', {
        method: "POST",
        body: JSON.stringify({ request: base64Encoded }),
        headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': X_VERIFY,
        },
    });
    const response = await data.json();
    console.log("PhonePe Response: ");
    console.dir(response, { depth: null });

    return res.send({
        redirectURL: response.data.instrumentResponse.redirectInfo.url
    });
});

// Static
app.use(express.static('public'));


app.listen(3000, () => {
    if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
        console.table({
            status: 'running',
            port: 3000,
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