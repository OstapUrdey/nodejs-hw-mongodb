import { SORT_ORDER } from '../constants/index.js';
import ContactsCollection from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({page = 1, perPage = 10, sortOrder = SORT_ORDER.ASC, sortBy = "_id", filter = {},}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = ContactsCollection.find();
    if (filter.type) {
        contactsQuery.where("contactType").equals(filter.type);
    }

    if (filter.isFavourite !== undefined) {
        contactsQuery.where("isFavourite").equals(filter.isFavourite);
    }
    const data = await ContactsCollection.find().skip(skip).limit(limit).sort({[sortBy]: sortOrder});

    const totalItems = await contactsQuery.countDocuments();
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
