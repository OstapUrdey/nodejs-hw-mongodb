import { SORT_ORDER } from '../constants/index.js';
import ContactsCollection from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({ page = 1, perPage = 10, sortOrder = SORT_ORDER.ASC, sortBy = "_id", filter = {} }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = ContactsCollection.find(filter);
    if (filter.type) {
        contactsQuery.where("contactType").equals(filter.type);
    }

    if (filter.isFavourite !== undefined) {
        contactsQuery.where("isFavourite").equals(filter.isFavourite);
    }
    const data = await ContactsCollection.find().skip(skip).limit(limit).sort({[sortBy]: sortOrder});

    const totalItems = await ContactsCollection.find(filter).countDocuments();
    const paginationData = calculatePaginationData({totalItems, page, perPage});

    return {
        data,
        ...paginationData,
    };
};

export const getContactById = async ({ _id, userId }) => {
    return await ContactsCollection.findOne({ _id, userId });  // Перевіряємо належність контакту
};

export const createContact = payload => ContactsCollection.create(payload);

export const updateContact = async ({ _id, payload, filter }) => {
    const updatedContact = await ContactsCollection.findOneAndUpdate({ _id, ...filter }, payload, {
        new: true,
    });

    return updatedContact;
};

export const deleteContact = async ({ _id, userId }) => {
    return await ContactsCollection.findOneAndDelete({ _id, userId });  // Перевірка на належність контакту
};
