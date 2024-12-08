import express from 'express';
import cors from 'cors';
import { env } from './utils/env.js';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

export const setupServer = () => {

    const app = express();

    app.use(express.json());

    app.use(cors());

    app.use(cookieParser());

    app.use("/uploads", express.static(UPLOAD_DIR));

    app.use('/api-docs', swaggerDocs());

    // app.use(logger);

    app.get("/", (req, res) => {
        res.json({ message: "Welcome to the API" });
    });

    app.use(router);

    app.use(notFoundHandler);

    app.use(errorHandler);

    app.use("/uploads", express.static(UPLOAD_DIR));

    const port = Number(env("PORT", 3000))

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
