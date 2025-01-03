import express from 'express';
import os from 'os';

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