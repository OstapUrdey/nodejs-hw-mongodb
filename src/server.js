import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import * as contactsServices from './services/contacts.js';

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(
        pino({
            transport: {
                target: "pino-pretty",
            },
        }),
    );

    app.get("/contacts", async (req, res) => {

        const data = await contactsServices.getContacts();

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data,
        });
    });

    app.get("/contacts/:id", async (req, res) => {

        const {id} = req.params;
        const data = await contactsServices.getContactsById(id);

        if(!data) {
            return res.status(404).json({
                status: 404,
                message: `Contact with id ${id} not found`,
            })
        }

        res.json({
            status: 200,
            message: `Successfully found contact with id ${id}!`,
            data,
        })
    });

    app.use((req, res, next) => {
        res.status(404).json({
            message: `${req.url} not found`,
        })
    });

    app.use((err, req, res, next) => {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        });
    });

    const port = Number(env("PORT", 3000))

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};
