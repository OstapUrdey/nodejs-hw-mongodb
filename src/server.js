import express from 'express';
import cors from 'cors';
import { env } from './utils/env.js';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {

    const app = express();

    app.use(express.json());

    app.use(cors());

    app.use(cookieParser());

    // app.use(logger);

    app.get("/", (req, res) => {
        res.json({ message: "Welcome to the API" });
    });

    app.use(router);

    app.use(notFoundHandler);

    app.use(errorHandler);

    const port = Number(env("PORT", 3000))

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
