import { SORT_ORDER } from '../constants/index.js';
import ContactsCollection from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({ page = 1, perPage = 10, sortOrder = SORT_ORDER.ASC, sortBy = "_id", filter = {}, }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = ContactsCollection.find(filter);

    if (filter.type) {
        contactsQuery.where("contactType").equals(filter.type);
    }

    if (filter.isFavourite !== undefined) {
        contactsQuery.where("isFavourite").equals(filter.isFavourite);
    }

    const data = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder });

    const totalItems = await contactsQuery.countDocuments();
    const paginationData = calculatePaginationData({ totalItems, page, perPage });

    return {
        data,
        ...paginationData,
    };
};

export const getContactsById = async (id, userId) => {
    if (!id || !userId) throw new Error("ID or UserId is missing");
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
