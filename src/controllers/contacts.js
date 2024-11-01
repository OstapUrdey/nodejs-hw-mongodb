import * as contactServices from '../services/contacts';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {

    const data = await contactServices.getContacts();

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data,
    });
};

export const getContactsByIdController = async (req, res) => {

    const {id} = req.params;
    const data = await contactServices.getContactsById(id);

    if(!data) {
        throw createHttpError(404, "Contact not found");
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data,
    })
};
