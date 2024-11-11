import ContactsCollection from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({page = 1, perPage = 10}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const data = await ContactsCollection.find().skip(skip).limit(limit);

    const totalItems = await ContactsCollection.countDocuments();
    const paginationData = calculatePaginationData({totalItems, page, perPage});

    return {
        data,
        ...paginationData,
    };
};

export const getContactsById = (id) => ContactsCollection.findById(id);

export const createContact = payload => ContactsCollection.create(payload);

export const updateContact = async ({_id, payload, options = {}}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate({_id}, payload, {
        ...options,
        new: true,
        includeResultMetadata: true,
    });

    if(!rawResult || !rawResult.value) return null;

    return {
        data: rawResult.value,
        isNew: Boolean(rawResult.lastErrorObject.upserted)
    };
};

export const deleteContact = (_id) => ContactsCollection.findOneAndDelete({_id});
