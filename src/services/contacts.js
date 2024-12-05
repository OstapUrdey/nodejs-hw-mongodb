import { SORT_ORDER } from '../constants/index.js';
import ContactsCollection from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({ page = 1, perPage = 10, sortOrder = SORT_ORDER.ASC, sortBy = "_id", filter = {} }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = ContactsCollection.find();
    if (filter.isFavourite) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }

    if (filter.userId) {
        contactsQuery.where('userId').equals(filter.userId);
    }
    const data = await contactsQuery
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder });

    const totalItems = await contactsQuery.clone().countDocuments();

    const paginationData = calculatePaginationData({ totalItems, page, perPage });

    return {
        data,
        ...paginationData,
    };
};

export const getContactsById = async (contactId, userId) => {
    const contact = await ContactsCollection.findOne({ _id: contactId, userId });
    return contact;
};

export const createContact = (payload) => ContactsCollection.create(payload);

export const updateContact = async ({ _id, payload, options = {}, userId, photo }) => {
    const updatedPayload = { ...payload };
    if (photo) {
        updatedPayload.photo = photo;
    }

    const rawResult = await ContactsCollection.findOneAndUpdate(
        { _id, userId },
        { $set: updatedPayload },
        {
            ...options,
            new: true,
            includeResultMetadata: true,
        },
    );

    if (!rawResult || !rawResult.value) return null;

    return {
        data: rawResult.value,
        isNew: Boolean(rawResult.lastErrorObject.upserted),
    };
};

export const deleteContact = async (filter) => {
    return ContactsCollection.findOneAndDelete(filter);
};
