import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render('index', {
        title: 'PhonePe | Web Integration',
        message: 'PhonePe Payment',
        environment: process.env.ENVIRONMENT,
    });
});

export default router;