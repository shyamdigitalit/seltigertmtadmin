import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRouter from './router/auth.js';
import accountRouter from './router/admin/account.js';
import leadRouter from './router/lead.js';
import subcategoryRouter from './router/masters/subcategory.js';
import productRouter from './router/masters/product.js';
import stateRouter from './router/masters/state.js';
import settingRouter from './router/admin/setting.js';
import blogRouter from './router/admin/blog.js';
dotenv.config();

await connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = {
    dev: {
        quality: ['http://localhost:3032', 'http://localhost:3047'],
        production: ['http://localhost:3046']
    },
    live: {
        quality: ['https://seltigertmtadmin-qas.shyamgroup.com'],
        production: ['https://seltigertmtadmin.shyamgroup.com']
    }
};
const portDetails = {
    quality: process.env.PORT_QAS,
    production: process.env.PORT_PRD
}

const apienv = process.env.NODE_ENV || 'dev';
const appenv = process.env.APP_ENV || 'quality';
const origins = allowedOrigins[apienv][appenv] || allowedOrigins.dev.quality;
const port = portDetails[appenv] || 5042;
const host = process.env.HOST || 'localhost';

const app = express();

// Trust Apache proxy
app.set("trust proxy", "loopback");
// Debug route to verify IP + UA
app.get("/api/debug/ip", (req, res) => {
    res.json({
        ip: req.ip,
        ips: req.ips,
        xff: req.headers["x-forwarded-for"],
        ua: req.get("user-agent"),
        proto: req.protocol
    });
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(bodyParser.json({ limit: '10000mb' }));
app.use(bodyParser.urlencoded({ limit: '10000mb', extended: true }));
// app.use(express.static('uploads'));

app.use("/api/auth", authRouter)
app.use("/api/account", accountRouter)
app.use("/api/lead", leadRouter)
app.use("/api/subcategory", subcategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/state", stateRouter)
app.use("/api/settings", settingRouter)
app.use("/api/blogs", blogRouter)

// static frontend delivery
if (apienv === 'live') {
    // static frontend
    const distPath = path.join(__dirname, '..', 'app', 'dist');
    console.log("Serving frontend from:", distPath);
    app.use(express.static(distPath));

    // frontend routes
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}


// No host param → cluster shares the TCP handle
app.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`)
})
