import mongoose from 'mongoose';
import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/parseContactFilterParams.js';

export const getContactsController = async (req, res, next) => {
    // const {page, perPage} = parsePaginationParams(req.query);

    // const {sortBy, sortOrder} = parseSortParams(req.query);

    // const filter = parseContactFilterParams(req.query);

    // const {_id: userId} = req.user;
    // filter.userId = userId;

    // const data = await contactServices.getContacts({page, perPage, sortBy, sortOrder, filter});

    const { id: _id } = req.params;
    const { _id: userId } = req.user; // Отримуємо userId з req.user

        const { page, perPage } = parsePaginationParams(req.query);
        const { sortBy, sortOrder } = parseSortParams(req.query);

        // Фільтруємо контакти по userId
        const filter = { userId, ...parseContactFilterParams(req.query) };

        const data = await contactServices.getContacts({
            page,
            perPage,
            sortBy,
            sortOrder,
            filter,
        });

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data,
    });
};

export const getContactsByIdController = async (req, res, next) => {
    // const { id } = req.params;

    // const data = await contactServices.getContactsById(id);

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     throw createHttpError(400, `Invalid contact ID: ${id}`);
    // }

    // if (!data) {
    //     throw createHttpError(404, "Contact not found");
    // }

    const { id: _id } = req.params;
        const { _id: userId } = req.user;  // Перевіряємо, що контакт належить поточному користувачу

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            throw createHttpError(400, `Invalid contact ID: ${_id}`);
        }

        // Фільтруємо за userId, щоб переконатися, що контакт належить користувачу
        const data = await contactServices.getContactById({ _id, userId });

        if (!data) {
            throw createHttpError(404, "Contact not found or does not belong to the user");
        }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${_id}!`,
        data,
    });
};

export const createContactController = async (req, res, next) => {
        // const { _id: userId } = req.user;

        // const data = await contactServices.createContact({...req.body, userId});

        const { _id: userId } = req.user;  // Отримуємо userId з авторизації

        // Додаємо userId до нового контакту
        const contactData = { ...req.body, userId };

        const data = await contactServices.createContact(contactData);

    res.status(201).json({
        status: 201,
        message: "Contact successfully added",
        data,
    });
};

export const upsertContactController = async (req, res, next) => {
    const {id: _id} = req.params;

    const result = await contactServices.updateContact({_id, payload: req.body, options: {
        upsert: true
    }});

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: "Contact upsert seccessfully",
        data: result.data,
    });
};

export const patchContactController = async (req, res, next) => {
    // const {id: _id} = req.params;

    // const result = await contactServices.updateContact({_id, payload: req.body});

    // if (!result) {
    //     throw createHttpError(404, `Contact with id=${_id} not found`);
    // }

    const { id: _id } = req.params;
        const { _id: userId } = req.user; // Перевіряємо, що контакт належить поточному користувачу

        const result = await contactServices.updateContact({
            _id,
            payload: req.body,
            filter: { userId }, // Фільтруємо за userId
        });

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
    // const {id: _id} = req.params;

    // const data = await contactServices.deleteContact({_id});

    // if(!data) {
    //     throw createHttpError(404, `Contact with id=${_id} not found`);
    // }

    const { id: _id } = req.params;
        const { _id: userId } = req.user; // Перевіряємо, що контакт належить поточному користувачу

        const data = await contactServices.deleteContact({ _id, userId });

        if (!data) {
            throw createHttpError(404, `Contact with id=${_id} not found`);
        }

    res.status(204).send();
};
