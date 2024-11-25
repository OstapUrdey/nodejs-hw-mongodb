import { SORT_ORDER } from '../constants/index.js';
import ContactsCollection from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import mongoose from 'mongoose';

export const getContacts = async ({ page = 1, perPage = 10, sortOrder = SORT_ORDER.ASC, sortBy = "_id", filter = {} }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    let contactsQuery = ContactsCollection.find(filter);

    if (filter.type) {
        contactsQuery.where("contactType").equals(filter.type);
    }

    if (filter.isFavourite !== undefined) {
        contactsQuery.where("isFavourite").equals(filter.isFavourite);
    }

    const validSortFields = ["_id", "name", "phoneNumber", "email", "createdAt", "updatedAt"];
    if (!validSortFields.includes(sortBy)) {
        sortBy = "_id";
    }

    if (![SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder)) {
        sortOrder = SORT_ORDER.ASC;
    }

    const data = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder });

    const countQuery = ContactsCollection.find(filter);
    if (filter.type) {
        countQuery.where("contactType").equals(filter.type);
    }

    if (filter.isFavourite !== undefined) {
        countQuery.where("isFavourite").equals(filter.isFavourite);
    }

    const totalItems = await countQuery.countDocuments();
    const paginationData = calculatePaginationData({ totalItems, page, perPage });

    return {
        data,
        ...paginationData,
    };
};

export const getContactsById = async (id, userId) => {
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid ID or UserId");
    }
    return await ContactsCollection.findOne({ _id: id, userId });
};

export const createContact = async (payload) => {
    return await ContactsCollection.create(payload);
};

export const updateContact = async ({ _id, payload, userId, options = {} }) => {
    const filter = { _id, userId };
    const rawResult = await ContactsCollection.findOneAndUpdate(filter, payload, {
        ...options,
        new: true,
    });

    if (!rawResult) return null;

    return {
        data: rawResult,
        isNew: Boolean(options.upsert && rawResult.lastErrorObject?.upserted),
    };
};

export const deleteContact = async (_id, userId) => {
    return await ContactsCollection.findOneAndDelete({ _id, userId });
};
