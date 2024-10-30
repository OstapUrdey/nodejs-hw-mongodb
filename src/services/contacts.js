import ContactsCollection from '../db/models/contacts.js';

export const getContacts = () => ContactsCollection.find();
export const getContactsById = (id) => ContactsCollection.findById(id);
