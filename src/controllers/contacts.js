import mongoose from 'mongoose';
import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/parseContactFilterParams.js';

export const getContactsController = async (req, res, next) => {
    const {page, perPage} = parsePaginationParams(req.query);

    const {sortBy, sortOrder} = parseSortParams(req.query);

    const filter = parseContactFilterParams(req.query);

    const {_id: userId} = req.user;
    filter.userId = userId;

    const data = await contactServices.getContacts({page, perPage, sortBy, sortOrder, filter});

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data,
    });
};

export const getContactsByIdController = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError(400, `Invalid contact ID: ${id}`);
    }

    const data = await contactServices.getContactsById(id);

    if (!data) {
        throw createHttpError(404, "Contact not found");
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data,
    });
};

export const createContactController = async (req, res, next) => {
        const { _id: userId } = req.user;

        const data = await contactServices.createContact(req.body);

    res.status(201).json({
        status: 201,
        message: "Contact successfully added",
        data,
    });
};

export const upsertContactController = async (req, res, next) => {
    const {id: _id} = req.params;

    const result = await contactServices.updateContact({_id, payload: req.body, options: {
        usert: true
    }});

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: "Contact upsert seccessfully",
        data: result.data,
    });
};

export const patchContactController = async (req, res, next) => {
    const {id: _id} = req.params;

    const result = await contactServices.updateContact({_id, payload: req.body});

    if (!result) {
        throw createHttpError(404, `Contact with id=${_id} not found`);
    }

    res.json({
        status: 200,
        message: "Contact patched successfully",
        data: result.data,
    });
};

export const deleteContactController = async (req, res, next) => {
    const {id: _id} = req.params;

    const data = await contactServices.deleteContact(_id);

    if(!data) {
        throw createHttpError(404, `Contact with id=${_id} not found`);
    }

    res.status(204).send();
};
