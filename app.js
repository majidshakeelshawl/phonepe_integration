import express from 'express';
import os from 'os';
import morgan from 'morgan';

// Routers
import webhookRouter from './routes/webhook.js';
import paymentRouter from './routes/payment.js';
import homeRouter from './routes/home.js';

const app = express();
app.use(express.json());

// Morgan
app.use(morgan('dev'));

// View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Home routes
app.use('/', homeRouter);
// Payment routes
app.use('/payment', paymentRouter);
// Webhook routes
app.use('/webhook', webhookRouter);

// Static
app.use(express.static('public'));


app.listen(process.env.PORT, () => {
    if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
        console.table({
            status: 'running',
            port: process.env.PORT,
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