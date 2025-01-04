import { Router } from "express";

// Routers
import homeRouter from './home.js';
import paymentRouter from './payment.js';
import webhookRouter from './webhook.js';

const router = Router();

// Home
router.use('/', homeRouter);
// Payments
router.use('/payment', paymentRouter);
// Webhook
router.use('/webhook', webhookRouter);

export default router;