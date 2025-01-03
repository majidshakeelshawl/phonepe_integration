import express from 'express';
import os from 'os';

const app = express();
app.use(express.json());


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