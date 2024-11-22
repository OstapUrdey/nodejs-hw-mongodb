import mongoose from 'mongoose';
import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/parseContactFilterParams.js';

export const getContactsController = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;

        const { page, perPage } = parsePaginationParams(req.query);
        const { sortBy, sortOrder } = parseSortParams(req.query);
        const filter = { ...parseContactFilterParams(req.query), userId };

        const data = await contactServices.getContacts({
            page,
            perPage,
            sortBy,
            sortOrder,
            filter,
        });

        res.json({
            status: 200,
            message: 'Successfully found contacts!',
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const getContactsByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: userId } = req.user;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw createHttpError(400, `Invalid contact ID: ${id}`);
        }

        const data = await contactServices.getContactsById({ id, userId });

        if (!data) {
            throw createHttpError(404, 'Contact not found');
        }

        res.json({
            status: 200,
            message: `Successfully found contact with id ${id}!`,
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const createContactController = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const contactData = { ...req.body, userId };

        const data = await contactServices.createContact(contactData);

        res.status(201).json({
            status: 201,
            message: 'Contact successfully added',
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const upsertContactController = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        const { _id: userId } = req.user;
        const contactData = { ...req.body, userId };

        const result = await contactServices.updateContact({
            _id,
            payload: contactData,
            options: {
                upsert: true,
            },
        });

        const status = result.isNew ? 201 : 200;

        res.status(status).json({
            status,
            message: 'Contact upserted successfully',
            data: result.data,
        });
    } catch (error) {
        next(error);
    }
};

export const patchContactController = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        const { _id: userId } = req.user;

        const result = await contactServices.updateContact({
            _id,
            payload: req.body,
            filter: { userId },
        });

        if (!result) {
            throw createHttpError(404, `Contact with id=${_id} not found`);
        }

        res.json({
            status: 200,
            message: 'Contact patched successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteContactController = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        const { _id: userId } = req.user;

        const data = await contactServices.deleteContact({ _id, userId });

        if (!data) {
            throw createHttpError(404, `Contact with id=${_id} not found`);
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
