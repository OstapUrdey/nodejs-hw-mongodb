import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/parseContactFilterParams.js';

export const getContactsController = async (req, res, next) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseContactFilterParams(req.query);
    const { _id: userId } = req.user;
    filter.userId = userId;

    const contacts = await contactServices.getContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
    });

    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};

export const getContactsByIdController = async (req, res, next) => {
    const { id } = req.params;
    const data = await contactServices.getContactsById(id);

    if (!data) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data,
    });
};

export const createContactController = async (req, res, next) => {
    const { _id: userId } = req.user;

    const data = await contactServices.addContact({ ...req.body, userId });

    res.status(201).json({
        status: 201,
        message: 'Contacts successfullt added',
        data,
    });
};

export const upsertContactController = async (req, res) => {
    const { id: _id } = req.params;

    const result = await contactServices.updateContact({
        _id,
        payload: req.body,
        options: { upsert: true },
    });

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: 'Contact update successfull',
        data: result,
    });
};

export const patchContactController = async (req, res) => {
    const { id: _id } = req.params;

    const result = await contactServices.updateContact({
        _id,
        payload: req.body,
    });

    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result.data,
    });
};

export const deleteContactController = async (req, res) => {
    const { id: _id } = req.params;

    const data = await contactServices.deleteContact({ _id });

    if (!data) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(204).json({
        status: 204,
    });
};
